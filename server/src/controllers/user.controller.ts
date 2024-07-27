import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (userId: any) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(
        401,
        "user does not exist so tokens can not be created!"
      );
    }
    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(401, "Something went wrong while creating the tokens!");
  }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { userName, fullName, email, password } = req.body;

  if (
    [userName, fullName, email, password].some((value) => value?.trim() === "")
  ) {
    throw new ApiError(401, "All fields are necessary!");
  }

  const userExists = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (userExists) {
    throw new ApiError(401, "Username or email already exists!");
  }

  const user = await User.create({
    userName,
    fullName,
    email,
    password,
  });

  const displayUser = await User.findById(user._id)?.select(
    "-password -refreshToken"
  );

  if (!displayUser) {
    throw new ApiError(401, "Something went wrong while creating user!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, displayUser, "user created successfully!"));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  if ([userName, password].some((value) => value.trim() === "")) {
    throw new ApiError(401, "All fields are necessary!");
  }

  const user = await User.findOne({ userName: userName });

  if (!user) {
    throw new ApiError(401, "user does not exist!");
  }

  const checkPassword = await user.isPasswordCorrect(password);

  if (!checkPassword) {
    throw new ApiError(400, "Incorrect Password!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );

  const loggedUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user: loggedUser }, "user logged in successfully!")
    );
});

const logoutUser = asyncHandler(async (req: any, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "user should be logged in first!");
  }
  await User.findByIdAndUpdate(
    user?._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user loggedout successfully"));
});

const getUser = asyncHandler(async (req: any, res: Response) => {
  const user = req.user;

  return res
    .status(200)
    .json(
      new ApiResponse(200, { FetchedUser: user }, "user fetched successfully!")
    );
});

const updatePassword = asyncHandler(async (req: any, res: Response)=>{
  const { oldPassword, newPassword } = req.body

  const user : any = await User.findById(req?.user._id)
  const isPasswordCorrect : Boolean = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400, "Invalid Password")
  }

  user.password = newPassword

  await user.save({validateBeforeSave: false})

  return res.status(200).json(new ApiResponse(201, {}, "Password Updated successfully"))
});

const sendEmail = asyncHandler(async (req: Request, res: Response)=>{
  const {email} = req.body

  if(!email){
    throw new ApiError(402,"Email Required")
  }

  const user = await User.find({email})

  if(!user){
    throw new ApiError(404,"User with given email doesn\'t exist")
  }

  const token = jwt.sign({ _id: user[0]._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" })

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASS as string,
    },
  });

  const mailOptions = {
    from: "project9960@gmail.com",
    to: email,
    subject: "Password Reset Link",
    html: `<h4>You requested for password reset</h4>
                  <p>Click <a href="http://localhost:5173/reset-password/${token}">here</a> to reset your password</p>`
  }

  await transporter.sendMail(mailOptions)

  return res.status(200).json(new ApiResponse(201, { token }, "Email sended successfully"))
});



export { registerUser, loginUser, logoutUser, getUser, updatePassword, sendEmail };

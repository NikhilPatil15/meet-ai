import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

const options = {
  httpOnly: true,
  secure: true,
};

/* Generates both access and refresh tokens */
const generateAccessandRefreshToken = async (userId: any) => {
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

/* Register the user and add the user details in the database. */
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

/* login the user by verifying its credentials */
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

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user?._id
  );

  const loggedUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refrehToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user: loggedUser }, "user logged in successfully!")
    );
});

/* To logout the user */
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

/* Get the user details */
const getUser = asyncHandler(async (req: any, res: Response) => {
  const user = req.user;

  return res
    .status(200)
    .json(
      new ApiResponse(200, { FetchedUser: user }, "user fetched successfully!")
    );
});

/* Update the user details */
const updateUserDetails = asyncHandler(async (req:any,res:Response) => {
  const {userName,fullName,email} = req.body
  const user = req.user

  if(!(userName||fullName||email)){
    throw new ApiError(401,'Add something to update!')
  }
  
  // if(userName||fullName||email){
  //   const ifUserExists = await User.findOne({userName:userName})
  // }

  // const updatedUser = await User.findByIdAndUpdate(user?._id,{
  //   userName:userName? userName :user.userName,
  //   fullName:fullName? fullName : user.fullName,
  //   email: email? email :user.email
  // })

})


export { registerUser, loginUser, logoutUser, getUser, updateUserDetails };

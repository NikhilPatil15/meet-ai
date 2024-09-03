import {
  jwtSecret,
  smtpHost,
  smtpPass,
  smtpPort,
  smtpUser,
} from "../config/envConfig";
import { IUser, User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import uploadOnCloudinary from "../utils/cloudinary";

const options: any = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
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

  console.log("Credential login: ", loggedUser);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "user logged in successfully!"
      )
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

const refreshAccessToken = asyncHandler(async (req: any, res: Response) => {
  const incomingRefreshToken: any =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken: any = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const {
      accessToken,
      refreshToken: newRefreshToken,
    } = await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getUser = asyncHandler(async (req: any, res: Response) => {
  const user = req.user;

  return res
    .status(200)
    .json(
      new ApiResponse(200, { FetchedUser: user }, "user fetched successfully!")
    );
});

const updatePassword = asyncHandler(async (req: any, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  const user: any = await User.findById(req?.user._id);
  const isPasswordCorrect: Boolean = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Password");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "Password Updated successfully"));
});

const sendEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(402, "Email Required");
  }

  const user = await User.find({ email });

  if (!user) {
    throw new ApiError(404, "User with given email doesn't exist");
  }

  const token = jwt.sign({ _id: user[0]._id }, jwtSecret as string, {
    expiresIn: "1h",
  });

  const transporter = nodemailer.createTransport({
    host: smtpHost as string,
    port: Number(smtpPort),
    auth: {
      user: smtpUser as string,
      pass: smtpPass as string,
    },
  });

  const mailOptions = {
    from: "project9960@gmail.com",
    to: email,
    subject: "Password Reset Link",
    html: `<h4>You requested for password reset</h4>
                  <p>Click <a href="http://localhost:5173/reset-password/${token}">here</a> to reset your password</p>`,
  };

  await transporter.sendMail(mailOptions);

  return res
    .status(200)
    .json(new ApiResponse(201, { token }, "Email sended successfully"));
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  console.log(token);
  const decoded: any = jwt.verify(token, jwtSecret as string);
  const user = await User.findById(decoded?._id);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(201, {}, "Password reset Successfully"));
});

const uploadAvatar = asyncHandler(async (req: Request | any, res: Response) => {
  let avatarLocalPath: string | undefined;
  const user: IUser | any = req?.user;

  console.log(req?.file);

  if (req?.file) {
    avatarLocalPath = req?.file?.path;
    console.log(avatarLocalPath);
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload avatar to Cloudinary
  const avatarImg = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarImg) {
    throw new ApiError(500, "Something went wrong while uploading avatar");
  }

  // Update user with the new avatar URL
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { avatar: avatarImg?.secure_url },
    { new: true } // Return the updated document
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  // Respond to the client with the updated user data
  return res
    .status(201)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

const updateAccountDetails = asyncHandler(async (req: any, res: Response) => {
  const { userName, email, fullName } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        userName: userName ? userName : req.user.userName,
        email: email ? email : req.user.email,
        fullName: fullName ? fullName : req.user.fullName,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { UpdatedUser: user },
        "Account details updated successfully"
      )
    );
});

const setOauthCookies = asyncHandler(async (req: any, res: Response) => {
  console.log("auth: ", req.auth);
  res
    .cookie("accessToken", req.auth, options)
    .redirect("http://localhost:3000/auth/setaccesstoken");
});

const setAccessToken = asyncHandler(async (req: any, res: Response) => {
  let token = req.cookies.accessToken;

  console.log("Token: ", token);

  res
    .status(201)
    .json(new ApiResponse(201, token, "AccessToken fetched successfully!"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  refreshAccessToken,
  updatePassword,
  sendEmail,
  resetPassword,
  updateAccountDetails,
  generateAccessAndRefreshToken,
  setOauthCookies,
  setAccessToken,
  uploadAvatar,
};

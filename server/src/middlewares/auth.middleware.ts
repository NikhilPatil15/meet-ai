import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface customJWTPayload extends JwtPayload{
    _id:any
}
export const verifyJWT = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(400, "user should be logged in first!");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as customJWTPayload;

    //   console.log("decodedToken: ",decodedToken);
      

      if (!decodedToken) {
        throw new ApiError(400, "token does not match!");
      }

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

    //   console.log("userL:",user);
      

      if (!user) {
        throw new ApiError(401, "Invalid Access Token!");
      }

      req.user = user;

      next();
    } catch (error: any) {
      throw new ApiError(500, error.message || "Unauthorized request!");
    }
  }
);

import { generateFromEmail } from "unique-username-generator";
import { generateAccessAndRefreshToken } from "../controllers/user.controller";
import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";


export const handleOAuth = async ( req: any, profile: any, callback: (err:any, user?:any)=>void) => {
    try {
      console.log("Profile: ", profile);

      console.log("Action: ", req.query.action);
      

      const id = profile?.id;

      const userExists = await User.findOne({ OauthId: id });

      if (userExists) {
        const { accessToken } =
          await generateAccessAndRefreshToken(userExists?._id);

        req.auth = accessToken;

        return callback(null,accessToken);
      }

   
      const userWithSameEmail = await User.findOne({
        email: profile?.emails[0]?.value ,
      });

      if (userWithSameEmail) {
        userWithSameEmail.OauthId = profile?.id;

        let userName;

        if (!profile?.name?.givenName) {
          userName = profile?.userName;
        } else {
          if (!(userWithSameEmail.userName === profile?.name?.givenName)) {
            userName = profile?.name?.givenName;
          }
        }
        userWithSameEmail.userName = userName;

        await userWithSameEmail.save({ validateBeforeSave: false });

        const { accessToken } =
          await generateAccessAndRefreshToken(userWithSameEmail?._id);

        req.auth = accessToken;

        return callback(null,accessToken);
      }

      let userWithSameUserName;

      if (profile?.name?.givenName) {
        userWithSameUserName = await User.findOne({
          userName: profile?.name?.givenName,
        });
      } else {
        userWithSameUserName = await User.findOne({
          userName: profile?.username,
        });
      }

      let userName;

      if (userWithSameUserName) {
        userName = generateFromEmail(profile?.emails[0]?.value, 1);
      } else {
        if (profile?.username) {
          userName = profile?.username;
        } else if (profile?.name?.givenName) {
          userName = profile?.name?.givenName;
        } else {
          userName = (profile?.displayName).replace(" ", "");
        }
      }

      const user = await User.create({
        userName: userName,
        fullName: profile?.displayName,
        email: profile?.emails[0].value,
        OauthId: profile?.id,
      });

      console.log("user in handleauth: ", user);
      

      if (!user) {
        throw new ApiError(400, "Error while creating user!");
      }

      const { accessToken } = await generateAccessAndRefreshToken(user?._id);

      req.auth = accessToken;

      return callback(null,accessToken);
    } catch (error: any) {
      throw new ApiError(
        500,
        error.message || "Something went wrong in handleOAuth function!"
      );
    }
  }

import { Router } from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetPassword,
  sendEmail,
  setAccessToken,
  setOauthCookies,
  updateAccountDetails,
  updatePassword,
  uploadAvatar,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import passport from "passport";
import { upload } from "../middlewares/multer.middleware";

const userRouter = Router();

/* Register route */
userRouter.route("/register").post(registerUser);

/* Login route */
userRouter.route("/login").post(loginUser);
userRouter.route("/forgot-password").post(sendEmail);
userRouter.route("/reset-password").put(resetPassword);

/* Oauth routes */
userRouter.route("/oauth/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
  setOauthCookies
);
userRouter.route("/oauth/github").get(
  passport.authenticate("github", {
    scope: ["profile", "email"],
    session: false,
  }),
  setOauthCookies
);

userRouter.route("/set-access-token").get(setAccessToken);

/* Auth Middleware to check if person is authenticated or not */
userRouter.use(verifyJWT);

/* Protected routes */
userRouter.route("/get-user").get(getUser);
userRouter.route("/logout").get(logoutUser);
userRouter.route("/update-password").put(updatePassword);
userRouter
  .route("/upload-avatar")
  .put(upload.single("avatar"), uploadAvatar);
userRouter.route("/refresh-token").post(refreshAccessToken)
userRouter.route("/update-profile").put(updateAccountDetails);

export default userRouter;

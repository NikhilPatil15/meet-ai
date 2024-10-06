import { query, Router } from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  sendEmail,
  setAccessToken,
  setOauthCookies,
  updateAccountDetails,
  updatePassword,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import passport from "passport";
import { asyncHandler } from "../utils/asyncHandler";

const userRouter = Router();

/* Register route */
userRouter.route("/register").post(registerUser);

/* Login route */
userRouter.route("/login").post(loginUser);
userRouter.route("/forgot-password").post(sendEmail);
userRouter.route("/reset-password").put(resetPassword);

/* Oauth routes */
userRouter.route("/oauth/google/register").get(
  (req, res, next) => {
    req.query.action = "register";
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
userRouter.route("oauth/google/login").get(
  // passport.authenticate('google',{
  //   scope:["profile,email"],
  //   session:false,
  //   state:"login"
  // })
  (req, res) => {
    res.redirect("http://localhost:5000/api/v1/user/oauth/google/callback?type=login");
  }
);

userRouter.route("/oauth/github/callback").get(setOauthCookies);

userRouter.route("/oauth/google/callback").get(
  asyncHandler(async (req, res) => {
    console.log("Query: ",req,query);
    
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    }),
      setOauthCookies;
  })
);

userRouter.route("/set-access-token").get(setAccessToken);

/* Auth Middleware to check if person is authenticated or not */
userRouter.use(verifyJWT);

/* Protected routes */
userRouter.route("/get-user").get(getUser);
userRouter.route("/logout").get(logoutUser);
userRouter.route("/update-password").put(updatePassword);
userRouter.route("/update-profile").put(updateAccountDetails);

export default userRouter;

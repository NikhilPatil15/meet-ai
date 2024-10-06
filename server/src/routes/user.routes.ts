import { query, Router } from "express";
import {
  getMeetingHistory,
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
<<<<<<< HEAD
import { asyncHandler } from "../utils/asyncHandler";
=======
import { upload } from "../middlewares/multer.middleware";
>>>>>>> 9e989f44a3f1eb3212549e576795bfee5a701965

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
<<<<<<< HEAD
=======
    scope: ["profile", "email"],
    session: false,
  }),
  setOauthCookies
);
userRouter.route("/oauth/github").get(
  passport.authenticate("github", {
>>>>>>> 9e989f44a3f1eb3212549e576795bfee5a701965
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
userRouter
  .route("/upload-avatar")
  .put(upload.single("avatar"), uploadAvatar);
userRouter.route("/refresh-token").post(refreshAccessToken)
userRouter.route("/update-profile").put(updateAccountDetails);
userRouter.route("/get-meeting-history").get(getMeetingHistory)

export default userRouter;

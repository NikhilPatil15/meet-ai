import { Router } from "express";
import { getUser, loginUser, logoutUser, registerUser, resetPassword, sendEmail, updateAccountDetails, updatePassword } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const userRouter = Router();

/* Register route */
userRouter.route("/register").post(registerUser);

/* Login route */
userRouter.route("/login").post(loginUser);

userRouter.route("/forgot-password").post(sendEmail)

userRouter.route("/reset-password").put(resetPassword)

/* Auth Middleware to check if person is authenticated or not */
userRouter.use(verifyJWT)

/* Protected routes */
userRouter.route('/get-user').get(getUser)
userRouter.route('/logout').get(logoutUser)
userRouter.route('/update-password').put(updatePassword)
userRouter.route('/update-profile').put(updateAccountDetails)

export default userRouter
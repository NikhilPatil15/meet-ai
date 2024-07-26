import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";

const userRouter = Router();

/* Register route */
userRouter.route("/register").post(registerUser);

/* Login route */
userRouter.route("/login").post(loginUser);

/* Auth Middleware to check if person is authenticated or not */
userRouter.use();

/* Protected routes */

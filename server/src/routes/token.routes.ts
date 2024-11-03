import { Router } from "express";
import { getTokenGuest, getTokenUser } from "../controllers/token.controller"


const tokenRouter = Router()

tokenRouter.route("/get-token-user").get(getTokenUser)
tokenRouter.route("/get-token-guest").post(getTokenGuest)

export default tokenRouter
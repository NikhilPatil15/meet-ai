import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const generateSummary = asyncHandler(async(req:any, res:Response, next:NextFunction)=>{
    console.log("requested generateSummary");
    
    req.summary = "this is summary"
    next()
})

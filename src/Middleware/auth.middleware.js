import { User } from "../Models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {ACCESS_TOKEN_SECRET} from "../config.js"

export const verifyJWT = asyncHandler( async(req,res,next)=>{
    console.log("In verifyJWT")
    console.log("cookie: " + req.headers.cookie)
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        console.log("token in auth",token)
        if(!token){
            console.log("Unauthorized  request")
            throw new ApiError(401,"Unauthorized request")
        }
        console.log("reached here")
        console.log(ACCESS_TOKEN_SECRET)
        const decodedToken = await jwt.verify(token,ACCESS_TOKEN_SECRET)
        console.log("decoded token",decodedToken)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        console.log("user in auth",user)

        if(!user){
            console.log("invalid User")
            throw new ApiError(401,"Invalid Access Token")
        }

        req.user = user
        next()

    }
    catch(err){
        console.log("IN auth catch")
        throw new ApiError(401,err?.message || "Invalid Access Token")
    }
})
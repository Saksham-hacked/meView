import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/apiErrors.js";
import jwt from "jsonwebtoken";
import  User  from "../model/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
   try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if(!token){
       throw new ApiErrors(401,"no token in cookie")
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user =await User.findById(decodedToken?.id).select("-password -refreshToken")
     if(!user){
         throw new ApiErrors(401,"no user found ")
     }
 
     req.user=user;
     next();
   } catch (error) {
    throw new ApiErrors(401,error?.message||"unauthorised request")
   }



})
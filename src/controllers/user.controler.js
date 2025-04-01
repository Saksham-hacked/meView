import {asyncHandler} from "../utils/asyncHandler.js";
 import {ApiErrors} from "../utils/apiErrors.js";
 import {ApiResponse} from "../utils/apiResponse.js";
 import User from "../model/user.model.js";
 import { uploadOnCloudinary } from "../utils/cloudinary.js";
 import jwt from "jsonwebtoken";

const generateAccesstokenAndRefreshtoken = async (userId)=>{
    const user = await User.findById(userId);
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false});//we do not wnat to validate anything before saving
    return {accessToken,refreshToken};
}


const registerUser = asyncHandler(async (req, res) => {
    //getting user details
    //validation
    //check if user already exist
    //check for images and avatar
    //upload them to cloudinary
    //create user obj in db
    //remove password and refreshtoken from res
    //check for user creation
    //return res
    const {username,email,password,bio}=req.body;
    if([username,email,password].some((field)=>{
        field?.trim()===""
    })){
        throw new ApiErrors(400,"All fields are required");
    }
    if(password.length<8){
        throw new ApiErrors(400,"Password should be at least 8 characters long");
    }
    if(!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
        throw new ApiErrors(400,"Invalid email format");
    }

    const existeduser = await User.findOne({$or:[{username},{email}]});
    if(existeduser){
        throw new ApiErrors(400,"Username or email already exists");
    }
    const profilePicLocal= req.file?.path;
    console.log(profilePicLocal);
    console.log(req.file);
    
    if(!profilePicLocal){
        throw new ApiErrors(400,"Profile picture is required");
    }

    const profilePicCloud=await uploadOnCloudinary(profilePicLocal);
    if(!profilePicCloud){
        throw new ApiErrors(400,"Error uploading profile picture");
    }
    const user=await User.create({username,email,password,bio,profilePic:profilePicCloud.url});

    const createdUser=await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiErrors(500,"Error creating user");
    }

    res.status(201).json(
        new ApiResponse(
            201,
            "User created successfully",
            createdUser
        )
    );



});




const loginUser = asyncHandler(async (req,res)=>{
    //req.body -> data
    //username or email
    //find useer
    //check password
    //generate tokens
    //send cookies
    //send response

     
    console.log("body",req.body);
    const {email,password} = req.body;
    console.log("email",email);
    if(!email ){
        throw new ApiErrors(400,"Email is required");
    }
    
    const user = await User.findOne({email});
    if(!user){
        throw new ApiErrors(400,"Invalid credentials");
    }

    const isPasswordMatched = await user.comparePassword(password);//here we do not use User as it is instance method of user model and user contains the method
    if(!isPasswordMatched){
        throw new ApiErrors(400,"Invalid password");
    }

   const {accessToken,refreshToken} = await generateAccesstokenAndRefreshtoken(user._id);
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const options={
    httpOnly:true,
    Secure:true,
   }//through these options no one can modify cookie through frontend

   return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
        new ApiResponse(
            200,
            "User logged in successfully",
            {
                user:loggedInUser,
                accessToken,
                refreshToken,
            }
        )
    );
   





})

const logoutUser = asyncHandler(async (req,res)=>{
   User.findByIdAndUpdate(req.user._id,{
    $set:{
        refreshToken:undefined,
    }},
    {
        new:true,
        
    }
   )

    const options={
     httpOnly:true,
     secure:true,
    
    }//through these options no one can modify cookie through frontend

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
        new ApiResponse(
            200,
            "User logged out successfully",
            {}
        )
    );
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const imcomingRefreshToken = req.cookies?.refreshToken ||req.body.refreshToken|| req.headers("Authorization")?.split(" ")[1];
    if(!imcomingRefreshToken){
        throw new ApiErrors(401,"unauthorised request")
    }

   try {
     const decodedToken=jwt.verify(imcomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
 
     const user = await User.findById(decodedToken?.id).select("-password")
     if(!user){
         throw new ApiErrors(401,"unauthorised request")
     }
 
     if(user.refreshToken !== imcomingRefreshToken){
         throw new ApiErrors(401,"token expired, please login again")
     }
     const options={
         httpOnly:true,
         secure:true,
     }
     const {accessToken,refreshToken} = await generateAccesstokenAndRefreshtoken(user._id);
     res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
         new ApiResponse(
             200,
             "Acess token refreshed  successfully",
             {
                 user,
                 accessToken,
                 refreshToken,
             }
         )
     );
   } catch (error) {
     throw new ApiErrors(401,error?.message||"unauthorised request")
    
   }
    

    
});

const getCurrentUSer = asyncHandler(async (req,res)=>{
    return res.status(200).json(
        new ApiResponse(
            200,
            "User fetched successfully",
            req.user
        )
    );
})






export {
    registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUSer
};
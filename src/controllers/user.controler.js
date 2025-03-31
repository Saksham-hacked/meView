import {asyncHandler} from "../utils/asyncHandler.js";
 import {ApiErrors} from "../utils/apiErrors.js";
 import {ApiResponse} from "../utils/apiResponse.js";
 import User from "../model/user.model.js";
 import { uploadOnCloudinary } from "../utils/cloudinary.js";




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
    const profilePicLocal= req.files?.profilePic?.path;
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

export {registerUser};
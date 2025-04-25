import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiErrors} from "../utils/apiErrors.js";
import {ApiResponse} from "../utils/apiResponse.js";
import Review from "../model/review.model.js";






const addReview =asyncHandler(async (req, res) => { 
    const {movieId,reviewText,movieTitle,moviePoster,rating,spoiler,userId} = req.body;
    console.log("movieId",movieId);
    console.log("reviewText",reviewText);
    console.log("rating",rating);
    console.log("spoiler",spoiler);
    console.log("userId",userId);
   
    if (
        typeof movieId !== "number" || movieId <= 0 ||
        typeof reviewText !== "string" || reviewText.trim() === "" ||
        rating === null
      ) {
        throw new ApiErrors(400, "All fields are required");
      }
    if(rating<0 || rating>10){
        throw new ApiErrors(400,"Rating should be between 0 and 10");
    }
    const review = await Review.create({movieId,reviewText,movieTitle,moviePoster,rating,spoiler,userId});
    if(!review){
        throw new ApiErrors(400,"Error creating review");
    }
    res.status(200).json(
        new ApiResponse(200,"Review created successfully",review)
    ) 

})



const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find().populate("userId", "-password -refreshToken");
    if(!reviews){
        throw new ApiErrors(400,"Error fetching reviews");
    }
    res.status(200).json(
        new ApiResponse(200,"Reviews fetched successfully",reviews)
    ) 
})

const getReviewByUserId = asyncHandler(async (req, res) => {
    console.log("req.user",req.user);
    const  userId  = req.user._id;

    console.log("userId",userId);
    const review = await Review.find({userId:userId})
    console.log("review",review);
    if(!review){
        throw new ApiErrors(400,"Error fetching review");
    }
    res.status(200).json(
        new ApiResponse(200,"Review fetched successfully",review)
    ) 
})

const getReviewByMovieId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const review = await Review.find({movieId:id}).populate("userId", "-password -refreshToken");
    console.log("review",review);
    if(!review){
        throw new ApiErrors(400,"Error fetching review");
    }
    res.status(200).json(
        new ApiResponse(200,"Review fetched successfully",review)
    ) 
})
    

export {
    addReview,
    getAllReviews,
    getReviewByUserId,
    getReviewByMovieId
}
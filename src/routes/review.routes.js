import { Router } from "express";
import { addReview, getAllReviews, getReviewByUserId, getReviewByMovieId } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";      



const router = Router();


router.route("/add").post(verifyJWT,addReview);
router.route("/").get(getAllReviews);
router.route("/userReview").get(verifyJWT,getReviewByUserId);
router.route("/:id").get(getReviewByMovieId);




export default router;
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    movieId: {
      type: String, // TMDb movie ID (not stored in DB)
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    spoiler: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        commentText: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true } // Auto adds createdAt & updatedAt
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;

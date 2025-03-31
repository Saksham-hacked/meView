import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    profilePic: {
      type: String,
      default: "../public/images/defaultAvatar.jpg", // Default avatar
    },
    bio: {
      type: String,
      maxlength: 160, // Limit bio length
      default: "",
    },
    watchlist: [
      {
        type: String, // Stores TMDb movie IDs
      },
    ],
    favoriteGenres: [
      {
        type: String, // e.g., "Sci-Fi", "Thriller"
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to other users
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    badges: [
      {
        type: String, // e.g., "Top Reviewer", "Movie Critic"
      },
    ],
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true } // Auto adds createdAt & updatedAt
);

// 🔹 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.generateAcessToken = function () {
  return jwt.sign({ id: this._id , username: this.username, email: this.email}, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id , username: this.username, email: this.email}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
}

// 🔹 Compare password for login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);//THIS WILL RETURN TRUE OR FALSE
};

const User = mongoose.model("User", userSchema);
export default User;

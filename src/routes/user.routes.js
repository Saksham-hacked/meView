import { Router } from "express";

import { registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUSer,userSearch,getUserByUserName,followUser,unfollowUser } from "../controllers/user.controler.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(
    upload.single("profilePic"),
    registerUser);
router.route("/login").post(loginUser);



//secured routes
router.route("/").get(verifyJWT,getCurrentUSer);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);



router.route("/search").get(userSearch);
router.route("/:username").get(getUserByUserName);







export default router;
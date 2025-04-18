import { Router } from "express";

import { registerUser,loginUser,logoutUser,refreshAccessToken } from "../controllers/user.controler.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(
    upload.single("profilePic"),
    registerUser);
router.route("/login").post(loginUser);



//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);




export default router;
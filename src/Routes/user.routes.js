import { Router } from "express";
import { profilePageController, signInUser, signUpUser, welcomePageController } from "../Controllers/user.controller.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/multer.middleware.js";


const router = Router();

// router.route('/').get((req, res) => { res.send("Hello From Backend"); });
router.route('/signup').post(signUpUser)
router.route('/signin').post(signInUser)
router.route('/profile').post(verifyJWT, upload.single('imageUrl'), profilePageController)
router.route('/welcome').post(verifyJWT,welcomePageController)

export default router
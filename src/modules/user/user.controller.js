import { Router } from "express";
import * as userServices from "./user.service.js";
import { uploadFile } from "../../utils/multer/multer.local.js";
import { fileValidation } from "../../middleware/file-validation.middleware.js";
import { isAuthenticated } from "../../middleware/auth-middleware.js";
import { uploadFile as uploadCloud } from "../../utils/multer/multer.cloud.js";

const router = Router();
router.delete("/", isAuthenticated, userServices.deleteAccount);

// if storing is local

// router.post("/upload-profile-picture",
//     isAuthenticated,
//     uploadFile().single("profilePicture"),
//     fileValidation(),
//     userServices.uploadProfilePicture);


router.patch("/update-password",
    isAuthenticated,
    userServices.updatePassword);
router.post("/upload-profile-picture",
    isAuthenticated,
    uploadCloud().single("profilePicture"),
    fileValidation(), userServices.uploadProfileCloud);


export { router as userRouter };
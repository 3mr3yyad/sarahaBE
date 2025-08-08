import { Router } from "express";
import * as userServices from "./user.service.js";
import { uploadFile } from "../../utils/multer/index.js";
import { fileValidation } from "../../middleware/file-validation.middleware.js";
import { isAuthenticated } from "../../middleware/auth-middleware.js";

const router = Router();
router.delete("/", isAuthenticated, userServices.deleteAccount);
router.post("/upload-profile-picture",
    isAuthenticated,
    uploadFile().single("profilePicture"),
    fileValidation(),
    userServices.uploadProfilePicture);
router.patch("/update-password", isAuthenticated, userServices.updatePassword);


export { router as userRouter };
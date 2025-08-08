import { Router } from "express";
import * as authServices from "./auth.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

const router = Router();

router.post("/register",validation(registerSchema), authServices.register);
router.post("/login", validation(loginSchema), authServices.login);
router.post("/verify-email", authServices.verifyEmail);
router.post("/resend-otp", authServices.resendOtp);
router.post("/google-login", authServices.googleLogin)
router.patch("/forgot-password", authServices.forgotPassword);
router.patch("/reset-password", authServices.resetPassword);

export { router as authRouter }
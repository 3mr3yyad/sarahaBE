import { Router } from "express";
import * as authServices from "./auth.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import { registerSchema, loginSchema, forgotPasswordSchema } from "./auth.validation.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/register",validation(registerSchema), authServices.register);
router.post("/verify-email", authServices.verifyEmail);
router.post("/login", validation(loginSchema), authServices.login);
router.post("/send-otp", authServices.sendOtp);
router.post("/google-login", authServices.googleLogin)
router.patch("/forgot-password", validation(forgotPasswordSchema), authServices.forgotPassword);
router.post("/logout", isAuthenticated, authServices.logout);

export { router as authRouter }
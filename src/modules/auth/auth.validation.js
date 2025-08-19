import joi from "joi";
import { genralFields } from "../../middleware/validation.middleware.js";

export const registerSchema = joi.object({
    fullName: genralFields.name.required(),
    email: genralFields.email.required(),
    phoneNumber: genralFields.phoneNumber,
    password: genralFields.password.required(),
    dob: genralFields.dob
}).or("email", "phoneNumber");

export const loginSchema = joi.object({
    email: genralFields.email,
    phoneNumber: genralFields.phoneNumber,
    password: genralFields.password
        .required()
}).or("email", "phoneNumber");

export const forgotPasswordSchema = joi.object({
    email: genralFields.email.required(),
    otp: genralFields.otp.required(),
    newPassword: genralFields.password.required(),
    confirmPassword: genralFields.password.required()
        .valid(joi.ref("newPassword"))
})

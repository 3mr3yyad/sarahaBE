import joi from "joi";

export const registerSchema = joi.object({
    fullName: joi.string()
        .min(3)
        .max(30)
        .required(),
    email: joi.string()
        .email(),
    phoneNumber: joi.string()
        .length(11),
    password: joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required(),
    dob: joi.date()
}).or("email", "phoneNumber");

export const loginSchema = joi.object({
    email: joi.string()
        .email(),
    phoneNumber: joi.string()
    .length(11),
    password: joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
}).or("email", "phoneNumber");

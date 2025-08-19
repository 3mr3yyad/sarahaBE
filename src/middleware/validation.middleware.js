import joi from "joi";

export const validation = (schema) => {

    return (req, res, next) => {

        const { value, error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            let errorMessages = error.details.map((error) => error.message).join("\n");

            throw new Error(errorMessages, { cause: 400 });
        }

        next();
    }
}

export const genralFields = {
    email: joi.string().email(),

    phoneNumber: joi.string().length(11),

    password: joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/),

    name: joi.string().min(3).max(30),

    dob: joi.date(),

    otp: joi.string().length(5)
}


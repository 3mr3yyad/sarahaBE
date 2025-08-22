import joi from "joi";
import { genralFields } from "../../middleware/validation.middleware.js";

export const messageSchema = joi.object({
    content: joi.string().min(3).max(1000),
    receiver: genralFields.objectid.required(),
    sender: genralFields.objectid,
})
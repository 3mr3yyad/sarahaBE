import { Router } from "express";
import { uploadFile } from "../../utils/multer/multer.cloud.js";
import * as messageServices from "./message.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import { messageSchema, getMessageSchema } from "./message.validation.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/:receiver",
    uploadFile().array("attachments", 4),
    validation(messageSchema),
    messageServices.sendMessage);

router.post("/:receiver/sender",
    isAuthenticated,
    uploadFile().array("attachments", 4),
    validation(messageSchema),
    messageServices.sendMessage);

router.get("/:id",
    isAuthenticated,
    validation(getMessageSchema),
    messageServices.getMessage);

export { router as messageRouter };
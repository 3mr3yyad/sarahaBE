import { Router } from "express";
import { uploadFile } from "../../utils/multer/multer.cloud.js";
import * as messageServices from "./message.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import { messageSchema } from "./message.validation.js";

const router = Router();

router.post("/:receiver",
    uploadFile().array("attachments", 4),
    validation(messageSchema),
    messageServices.sendMessage);

export { router as messageRouter };
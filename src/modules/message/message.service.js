import { Message } from "../../DB/model/message.model.js";
import { uploadFiles } from "../../utils/cloud/cloudinary.config.js";

export const sendMessage = async (req, res) => {
    const { content } = req.body;
    const receiver = req.params.receiver;
    const { files } = req;

    let attachments = [];

    if(files){
        const attachments = await uploadFiles({
            files,
            options: {folder: `saraha/users/${receiver}/messages`}
        })
    }

    const message = await Message.create({
        content,
        receiver,
        attachments,
        sender: req.user._id
    })

    return res.status(200).json({ message: "Message sent successfully", success: true });
}

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

    await Message.create({
        content,
        receiver,
        attachments,
        sender: req.user?._id
    })

    return res.status(200).json({ message: "Message sent successfully", success: true });
}

export const getMessage = async (req, res) => {
    const { id } = req.params;
    const message = await Message.findOne(
        { _id: id, receiver: req.user._id }, {},
        {
            populate: [{
                path: "receiver",
                select: "_id fullName profilePicture"
            },{
                path: "sender",
                select: "_id fullName profilePicture"
            }]
        });

    if (!message) {
        throw new Error("Message not found", { cause: 404 });
    }

    return res.status(200).json({ message, success: true });
}
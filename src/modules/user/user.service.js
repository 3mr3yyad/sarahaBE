import { User } from "../../DB/model/user.model.js";
import fs from "node:fs";
import joi from "joi";
import bycrpt from "bcrypt";
import cloudinary from "../../utils/cloud/cloudinary.config.js";

export const deleteAccount = async (req, res) => {
    
        const deletedUser = await User.findByIdAndDelete(req.user._id);

        if (!deletedUser) {
            throw new Error("User not found", { cause: 404 });
        }

        return res.status(200).json({ message: "User deleted successfully", success: true });
    
}

// if storing is local

// export const uploadProfilePicture = async (req, res) => {
//     if (req.user.profilePicture) {
//         fs.unlinkSync(req.user.profilePicture);
//     }
//     const updatedUser = await User.findByIdAndUpdate(req.user._id, { profilePicture: req.file.path }, { new: true });

//     if (!updatedUser) {
//         throw new Error("User not found", { cause: 404 });
//     }
//     return res.status(200).json({ message: "Profile picture uploaded successfully", file: req.file, success: true });
// }

export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const match = bycrpt.compareSync(oldPassword, req.user.password);

    if (!match) {
        throw new Error("Invalid password", { cause: 401 });
    }
const schema = joi.object({
    newPassword: joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required(),
})
    const { error, value } = schema.validate({ newPassword });
    if (error) {
        throw new Error(error.details[0].message, { cause: 400 });
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { password: bycrpt.hashSync(value.newPassword, 10) }, { new: true });

    if (!updatedUser) {
        throw new Error("User not found", { cause: 404 });
    }
    return res.status(200).json({ message: "Password updated successfully", success: true });
}

export const uploadProfileCloud = async (req, res) => {
    const user = req.user;
    const file = req.file;
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
        {
            folder: `saraha/users/${user._id}/profile-picture`
        });
    if (!secure_url || !public_id) {
        throw new Error("Failed to upload image", { cause: 500 });
    }
    if(user.profilePicture.public_id){
        await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }
    await User.updateOne(
        { _id: user._id },
        { profilePicture: { secure_url, public_id } }
    );
    return res.status(200).json(
        {
            message: "Profile picture uploaded successfully",
            file: { secure_url, public_id },
            success: true
        });
}





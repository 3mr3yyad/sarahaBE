import { User } from "../../DB/model/user.model.js";
import fs from "node:fs";
import joi from "joi";
import bycrpt from "bcrypt";

export const deleteAccount = async (req, res) => {
    
        const deletedUser = await User.findByIdAndDelete(req.user._id);

        if (!deletedUser) {
            throw new Error("User not found", { cause: 404 });
        }

        return res.status(200).json({ message: "User deleted successfully", success: true });
    
}

export const uploadProfilePicture = async (req, res) => {
    if (req.user.profilePicture) {
        fs.unlinkSync(req.user.profilePicture);
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { profilePicture: req.file.path }, { new: true });

    if (!updatedUser) {
        throw new Error("User not found", { cause: 404 });
    }
    return res.status(200).json({ message: "Profile picture uploaded successfully", file: req.file, success: true });
}

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



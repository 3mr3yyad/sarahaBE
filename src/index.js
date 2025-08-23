import express from "express";
import { bootStrap } from "./app.controller.js";
import { User } from "./DB/model/user.model.js";
import cron from "node-cron";
import { deleteFile } from "./utils/cloud/cloudinary.config.js";
import { Message } from "./DB/model/message.model.js";


cron.schedule("0 7 * * *", async () => {
    const deletedAt = { $exists: true , $lt: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000 }
    const users = await User.find({ deletedAt })
    
    for (const user of users) {
        try {
            await deleteFile(`saraha/users/${user._id}`)
        } catch (error) {
            console.log("user cloud may not exist",error)
        }
    }

    const deletedResult = await User.deleteMany({deletedAt})
    await Message.deleteMany({
        receiver: { $in: users.map(user => user._id) }
    })
    console.log(`Deleted ${deletedResult.deletedCount} users older than 3 months.`)

    const unverifiedUserExpiry = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const unverifiedResult = await User.deleteMany({ isVerified: false, createdAt: { $lt: unverifiedUserExpiry } })
    console.log(`Deleted ${unverifiedResult.deletedCount} unverified users older than 30 days.`)
})

const app = express();
const port = process.env.PORT || 3000;

bootStrap(app, express);
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

import jwt from "jsonwebtoken";
import { User } from "../../DB/model/user.model.js";
import cron from "node-cron";

export const verifyToken = (token, secretKey = "3yyad-saraha-secret-key") => {
    return jwt.verify(token, secretKey);
}

export const refreshToken = (id) => {
    return jwt.sign({id}, "3yyad-saraha-secret-key", {expiresIn: "30d"})
}

cron.schedule("0 0 * * *", async () => {
    const now = new Date()
    const usersResult = await User.updateMany({refreshToken: { $exists: true }, refreshTokenExpiry: { $lt: now } }, {refreshToken: undefined, refreshTokenExpiry: undefined})
    console.log(`Deleted ${usersResult.deletedCount} users older than 30 days.`)
})

cron.schedule("0 0 * * *", async () => {
    const unverifiedUserExpiry = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await User.deleteMany({ isVerified: false, createdAt: { $lt: unverifiedUserExpiry } })
    console.log(`Deleted ${result.deletedCount} unverified users older than 30 days.`)
})


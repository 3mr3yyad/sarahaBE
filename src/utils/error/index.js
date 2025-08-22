import { Token } from "../../DB/model/token.modle.js"
import { generateToken, verifyToken } from "../token/index.js"

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            next(error)
        })
    }
}

export const globalErrorHandler = async (err, req, res, next) => {
    try {
        if(err.message === "jwt expired"){
            const refreshToken = req.headers.refreshToken;
            const payload = verifyToken(refreshToken);
            const tokenExists = await Token.findOneAndDelete({
                token: refreshToken,
                userId: payload.id,
                type: "refresh"
            })
            if(!tokenExists){
                return next(new Error("Invalid refresh token", { cause: 401 }));
                // logout from all devices
            }
            const accessToken = generateToken({
                payload: { id: payload.id, name: payload.name }
            })
            const newRefreshToken = generateToken({
                payload: { id: payload.id },
                options: { expiresIn: "7d" }
            })
            await Token.create({
                token: newRefreshToken,
                userId: payload.id,
                type: "refresh"
            })
            return res.status(200)
                .json({
                    message: "token refreshed successfully",
                    success: true,
                    accessToken,
                    refreshToken: newRefreshToken
                })
        }
    
        return res.status(err.cause || 500)
            .json({
                message: err.message,
                success: false,
                stack: err.stack,
                globalErrorHandler: true
            });
    } catch (error) {
        return res.status(err.cause || 500)
            .json({
                message: err.message,
                success: false,
                stack: err.stack,
                globalErrorHandler: true
            });
    }
}


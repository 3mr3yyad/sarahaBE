import { connectDB } from "./DB/connection.js";
import { authRouter, userRouter, messageRouter } from "./modules/index.js";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { globalErrorHandler } from "./utils/error/index.js";

export function bootStrap(app, express) {

    const limiter = rateLimit({
        windowMs: 60 * 1000,
        max: 5,
        handler: (req, res, next, options) => {
            throw new Error(options.message, { cause: options.statusCode });
        },
        legacyHeaders: false,
        skipSuccessfulRequests: true
    })
    app.use(limiter)

    const otpLimiter = rateLimit({
        windowMs: 60 * 1000,
        max: 1,
        handler: (req, res, next, options) => {
            throw new Error("you can only send otp once in a minute", { cause: options.statusCode });
        },
        legacyHeaders: true,
        skipSuccessfulRequests: false
    })
    app.use('/auth/send-otp', otpLimiter)

    app.use(express.json());

    app.use(express.static("uploads"));

    app.use(cors(
        {
            origin: "*"
            // ["http://localhost:3000", "http://localhost:3001"],
        }
    ))

    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/message", messageRouter)

    app.use("/", (req, res) => {
        return res.status(200).send({ message: "Welcome to Saraha", success: true });
    })

    app.use("/{*dummy}", (req, res) => {
        return res.status(404).send({ message: "Not Found", success: false });
    })


    app.use(globalErrorHandler)
    connectDB()
}
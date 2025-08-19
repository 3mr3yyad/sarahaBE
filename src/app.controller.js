import { connectDB } from "./DB/connection.js";
import { authRouter, userRouter, messageRouter } from "./modules/index.js";
import cors from "cors";
import { globalErrorHandler } from "./utils/error/index.js";

export function bootStrap(app, express) {
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


    app.use(globalErrorHandler)
    connectDB()
}
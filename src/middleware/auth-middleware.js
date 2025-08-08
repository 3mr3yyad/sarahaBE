import { User } from "../DB/model/user.model.js";
import { verifyToken } from "../utils/token/index.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        return next(new Error("token is required", { cause: 401 }));
    }
    const {id} = verifyToken(token);
    const userExists = await User.findById(id)
    if(!userExists){
        return next(new Error("User not found", { cause: 404 }));
    }
    req.user = userExists;
    next();
}
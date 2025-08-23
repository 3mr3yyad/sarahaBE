import { Token } from "../DB/model/token.modle.js";
import { User } from "../DB/model/user.model.js";
import { verifyToken } from "../utils/token/index.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        return next(new Error("token is required", { cause: 401 }));
    }    
    const payload = verifyToken(token);
    if(!payload){
        return next(new Error("Invalid token", { cause: 401 }));
    }
    const blockedToken = await Token.findOne({token, type: "access"})
    if(blockedToken){
        return next(new Error("Invalid token", { cause: 401 }));
    }

    
    const userExists = await User.findById(payload.payload.id)

    if(!userExists){
        return next(new Error("User not found", { cause: 404 }));
    }
        
    if(userExists.credentialsUpdatedAt > new Date(payload.iat * 1000)){
        throw new Error("token expired", { cause: 401 });
    }
    
    req.user = userExists;
    console.log(req.user);
    return next();
}
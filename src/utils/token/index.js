import jwt from "jsonwebtoken";


export const verifyToken = (token, secretKey = "3yyad-saraha-secret-key") => {
    return jwt.verify(token, secretKey);
}

export const refreshToken = (id) => {
    return jwt.sign({id}, "3yyad-saraha-secret-key", {expiresIn: "30d"})
}




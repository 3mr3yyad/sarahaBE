import jwt from "jsonwebtoken";


export const verifyToken = (token, secretKey = process.env.SECRET_KEY) => {
    return jwt.verify(token, secretKey);
}

export const refreshToken = (id) => {
    return jwt.sign({id}, process.env.REFRESH_SECRET_KEY, {expiresIn: "30d"})
}




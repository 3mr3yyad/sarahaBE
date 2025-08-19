import jwt from "jsonwebtoken";


export const verifyToken = (token, secretKey = process.env.SECRET_KEY) => {
    return jwt.verify(token, secretKey);
}

export const generateToken = (
    {payload,
    secretKey = process.env.SECRET_KEY,
    options = {expiresIn : "15m"}
}) => {
    return jwt.sign({payload}, secretKey, options)
}
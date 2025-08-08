import { User } from "../../DB/model/user.model.js";
import bycrpt from "bcrypt";
import { sendEmail } from "../../utils/email/index.js";
import { generateOtp } from "../../utils/otp/index.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { updatePassword } from "../user/user.service.js";


export const register = async (req, res) => {
    
    const {
            fullName,
            email,
            password,
            phoneNumber,
            dob } = req.body;

    const userExists = await User.findOne({
            $or: [{
                $and: [
                    { email: { $exists: true } },
                    { email: { $ne: null } },
                    { email: email }
                ]
            },
            { $and: [
                { phoneNumber: { $exists: true } },
                { phoneNumber: { $ne: null } },
                { phoneNumber: phoneNumber }
            ] }
        ]
        })

        if (userExists) {
            throw new Error("User already exists", { cause: 409 });
        }

        const user = new User({
            fullName,
            email,
            password: bycrpt.hashSync(password, 10),
            phoneNumber,
            dob
        })

        const { otp, otpExpiry } = generateOtp(5)

        user.otp = otp;
        user.otpExpiry = otpExpiry;

        if(email){
            await sendEmail({
            to: email,
            subject: "Verify your email",
            html:`<h1>Welcome to Saraha</h1>
            <p>Your confirmation -otp- code is: <b><mark>${otp}</mark></b></p>
            <p><em>OTP will expire in <strong>5 minutes</strong></em></p>`
            })
        }

        await user.save()

        return res.status(201).json({ message: "User created successfully", success: true });

    }

export const verifyEmail = async (req, res) => {
    
        const { otp, email } = req.body;

        const userExists = await User.findOne({
            email,
            otp,
            otpExpiry: { $gt: Date.now() }
        })

        if (!userExists) {
            throw new Error("Invalid OTP", { cause: 401 });
        }

        userExists.isVerified = true;
        userExists.otp = undefined;
        userExists.otpExpiry = undefined;

        await userExists.save()

        return res.status(200).json({ message: "Your email verified successfully", success: true });

    }

export const resendOtp = async (req, res) => {
    
        const { email } = req.body;

        const { otp, otpExpiry } = generateOtp(3)

        await User.updateOne({ email }, { otp, otpExpiry })

        await sendEmail({
            to: email,
            subject: "resent OTP",
            html:`<h1>Welcome to Saraha</h1>
            <p>Your new confirmation -otp- code is: <b><mark>${otp}</mark></b></p>
            <p><em>OTP will expire in <strong>3 minutes</strong></em></p>`
            })


        return res.status(200).json({ message: "OTP resent successfully", success: true });

    }

export const googleLogin = async (req, res) => {
    
        const { idToken } = req.body;

        const client = new OAuth2Client("386337795399-88fvecpd58rbl01eq8btfdfsaebcimqg.apps.googleusercontent.com");

        const ticket = await client.verifyIdToken({idToken})

        const payload = ticket.getPayload();

        let userExists = await User.findOne({email: payload.email})

        if(!userExists){
            userExists = new User({
                fullName: payload.name,
                email: payload.email,
                // password: bycrpt.hashSync(payload.email, 10),
                phoneNumber: payload.phoneNumber,
                dob: payload.birthdate,
                isVerified: true,
                otp: undefined,
                otpExpiry: undefined,
                userAgent: "google"
            })
            await userExists.save()
        }

    const token = jwt.sign({ id: userExists._id, name: userExists.fullName }, "3yyad-saraha-secret-key", { expiresIn: "15m" })
    const refreshToken = refreshToken(userExists._id)
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    userExists.refreshToken = refreshToken;
    userExists.refreshTokenExpiry = refreshTokenExpiry;
    await userExists.save()

        return res.status(200).json({ message: "User logged in successfully", success: true, user: userExists, token, refreshToken });

    }

export const login = async (req, res) => {
    
        const { email, phoneNumber, password } = req.body;

        const userExists = await User.findOne({
            $or: [{
                $and: [
                    { email: { $exists: true } },
                    { email: { $ne: null } },
                    { email: email }
                ]
            },
            { $and: [
                { phoneNumber: { $exists: true } },
                { phoneNumber: { $ne: null } },
                { phoneNumber: phoneNumber }
            ] }
        ]
        })

        if (!userExists) {
            throw new Error("Invalid credentials", { cause: 401 });
        }
    
    if(userExists.isVerified === false){
        throw new Error("Please verify your email", { cause: 401 });
    }

        const match = bycrpt.compareSync(password, userExists.password);

        if (!match) {
            throw new Error("Invalid credentials", { cause: 401 });
        }
    const token = jwt.sign({ id: userExists._id, name: userExists.fullName }, "3yyad-saraha-secret-key", { expiresIn: "15m" })
    const refreshToken = refreshToken(userExists._id)
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    userExists.refreshToken = refreshToken;
    userExists.refreshTokenExpiry = refreshTokenExpiry;
    await userExists.save()


        return res.status(200).json({ message: "User logged in successfully", success: true, token, refreshToken });

}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
        throw new Error("User not found", { cause: 404 });
    }
    const { otp, otpExpiry } = generateOtp(5)
    userExists.otp = otp;
    userExists.otpExpiry = otpExpiry;
    await userExists.save()
    await sendEmail({
        to: email,
        subject: "Forgot Password",
        html: `<h1>Welcome to Saraha</h1>
        <p>Your confirmation -otp- code is: <b><mark>${otp}</mark></b></p>
        <p><em>OTP will expire in <strong>5 minutes</strong></em></p>`
    })
    return res.status(200).json({ message: `OTP sent to ${email}`, success: true });
}

export const resetPassword = async (req, res) => {
    const { otp, password } = req.body;
    const userExists = await User.findOne({ otp });
    if (!userExists) {
        throw new Error("User not found", { cause: 404 });
    }

    const otpMatch = bycrpt.compareSync(otp, userExists.otp);
    if (!otpMatch) {
        throw new Error("Invalid OTP", { cause: 401 });
    }

    if(userExists.otpExpiry < Date.now()){
        throw new Error("OTP expired", { cause: 401 });
    }

    updatePassword(req, res);
    userExists.otp = undefined;
    userExists.otpExpiry = undefined;
    await userExists.save()
    
    return res.status(200).json({ message: `Password reset successfully`, success: true });
}

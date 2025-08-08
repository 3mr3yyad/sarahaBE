import { model, Schema } from "mongoose";

const schema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: function() {
            return this.phoneNumber ? false : true;
        },
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function() {
            return this.userAgent == "local" ? true : false;
        }
    },
    phoneNumber: {
        type: String,
        required: function() {
            return this.email ? false : true;
        },
    },
    dob: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number,
    },
    otpExpiry: {
        type: Date,
    },
    userAgent: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    profilePicture: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    refreshTokenExpiry: {
        type: Date,
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

schema.virtual("fullName").get(function() {
    return `${this.firstName} ${this.lastName}`;
})

schema.virtual("fullName").set(function(value) {
    this.firstName = value.split(" ")[0];
    this.lastName = value.split(" ")[1];
})

schema.virtual("age").get(function() {
    return new Date().getFullYear() - this.dob.getFullYear();
})

export const User = model("User", schema);
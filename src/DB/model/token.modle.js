import { model, Schema } from "mongoose"

const schema = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["refresh", "access"]
    }
}, {
    timestamps: true
})

export const Token = model("Token", schema)


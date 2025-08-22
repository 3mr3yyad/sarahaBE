import { model, Schema } from "mongoose"

const schema = new Schema({
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        minlength: 1,
        maxlength: 1000,
        required: function() {
            return this.attachment.length > 0 ? false : true;
        }
    },
    attachment: [{
        secure_url: String,
        public_id: String,
    }],
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},{
    timestamps: true
})

export const Message = model("Message", schema)

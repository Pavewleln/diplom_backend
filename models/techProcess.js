import {model, Schema} from "mongoose";

const TechProcessSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default model('TechProcess', TechProcessSchema)
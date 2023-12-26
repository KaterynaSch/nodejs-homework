import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const userSchema = new Schema({
    email: {
        type: String,
        match: emailRegex,
        reguired: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    subscription:{
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter",
    },
    token: String,
},{versionKey: false}
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({//схема реєстрації
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().required(),
    subscription: Joi.string().required(),
});

export const userSigninSchema = Joi.object({//схема логінізації
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().required(),
});

const User = model('user', userSchema);

export default User;
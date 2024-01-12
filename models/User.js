import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionValue = ["starter", "pro", "business"];

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
    avatarURL:{ 
        type: String,
    },
    subscription:{
        type: String,
        enum: subscriptionValue,
        default: "starter",
    },
    token:{
        type: String,
    },
    verify: {
        type: String,
        default: false,
    },
    verificationToken:{
        type: String,
        required: [true, 'Verify token is required'],
    }
},{versionKey: false}
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({//схема реєстрації
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().required(),
    subscription: Joi.string(),
    // verificationToken: Joi.string().required(),
});

export const userEmailSchema = Joi.object({//схема логінізації
    email: Joi.string().pattern(emailRegex).required(),    
}).messages({
    "any.required": 'missing required field "email"'});

export const userSigninSchema = Joi.object({//схема логінізації
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().required(),
});

export const usersUpdateSubscribeSchema = Joi.object({//схема оновлення підписки
    subscription: Joi.required(),    
});

const User = model('user', userSchema);

export default User;
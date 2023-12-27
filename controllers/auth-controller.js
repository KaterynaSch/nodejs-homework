import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv/config';

import User from "../models/User.js";
import {ctrlWrapper} from '../decorators/index.js';
import {HttpError} from '../helpers/index.js';

const {JWT_SECRET} = process.env;

const signup = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw HttpError(409, 'Email in use')
    }
    const hashPassword = await bcrypt.hash(password,10);// хешування пароля

    const newUser = await User.create({...req.body, password: hashPassword});
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription
    });

};

const signin = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, 'Email or password is wrong');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);//порівняння паролів
    if(!passwordCompare) {
        throw HttpError(401, 'Email or password is wrong')
    }
    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '23h'});// якщо email та password співпали генеруємо токен
    await User.findByIdAndUpdate(user._id, {token});//збереження токена в базі
    res.json({
        token,
    })
}

const getCurrent = async(req, res) => {
    const {email, subscription} = req.user;//отримання інфи про юзера якщо токен валідний
    res.json({
        email,
        subscription
    })
}
const signout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token:""});
    res.sendStatus(204);
}

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
};
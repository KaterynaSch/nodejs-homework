import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv/config';
import fs from 'fs/promises';
import path from "path";
import gravatar from 'gravatar';

import User from "../models/User.js";
import {ctrlWrapper} from '../decorators/index.js';
import {HttpError} from '../helpers/index.js';

const {JWT_SECRET} = process.env;

const avatarsPath = path.resolve('public', 'avatars');

const signup = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw HttpError(409, 'Email in use')
    }   
    const avatarURL = gravatar.url(email, {s: '100', r: 'g', d: 'monsterid'}, false);    
    const hashPassword = await bcrypt.hash(password,10);// хешування пароля
    const newUser = await User.create({...req.body, avatarURL, password: hashPassword});
    res.status(201).json({
        user:{
            email: newUser.email,
            subscription: newUser.subscription
        }
    });
};

const signin = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
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
        user:{
            email: user.email,
            subscription: user.subscription,
        }
    })
};

const getCurrent = async(req, res) => {
    const {email, subscription} = req.user;//отримання інфо про юзера якщо токен валідний
    res.json({
        email,
        subscription
    })
};

const signout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token:""});
    res.status(204).send();    
};

const updateAvatar = async(req, res) => {
    const {_id, avatarURL: oldAvatarURL } = req.user;
    
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);//переміщення файлу з temp в public/avatars   
    const avatarURL = path.join('avatars', filename);//створили назву файлу
    const result = await User.findByIdAndUpdate(_id, {avatarURL}); 

    if(avatarURL){//видалення старого файлу, якщо він був
        const oldAvatarPath = path.join(path.resolve('public', oldAvatarURL));//шлях до старого файлу
        await fs.unlink(oldAvatarPath);
    }
       
    res.json({
        avatarURL: result.avatarURL});
}

const updateSubscription = async(req, res) => {
    const subscriptionValue = ["starter", "pro", "business"];
    const {subscription} = req.body;    
    const {_id, email} = req.user;    
    if(!(subscriptionValue.includes(subscription))){
        throw HttpError(401, 'Subscribtion value is wrong')
    };
    await User.findByIdAndUpdate(_id, req.body);
    res.json({
        email,        
        subscription
    });
};

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateAvatar: ctrlWrapper(updateAvatar),
    updateSubscription: ctrlWrapper(updateSubscription),
};

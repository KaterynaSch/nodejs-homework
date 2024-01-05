import fs from 'fs/promises';
import path from "path";
import Contact from '../models/Contact.js';
import {ctrlWrapper} from '../decorators/index.js';
import {HttpError} from '../helpers/index.js';

const avatarsPath = path.resolve('public', 'avatars');
const getAll = async(req, res) => {    
        const {_id: owner} = req.user;        
        const {page = 1, limit = 20, ...filterParams} = req.query;
        const skip = (page - 1) * limit;
        const filter = {owner, ...filterParams};        
        const result = await Contact.find(filter, "", {skip, limit}).populate("owner", "email subscription");
        if(!result.length){
                throw HttpError(404, `No contacts added yet`);            
            }
        const total = result.length;        
        res.json({
                result,
                total
        });    
}; 

const getById = async(req, res) => {    
        const {id} = req.params;
        const {_id: owner} = req.user;
        const result = await Contact.findOne({_id: id, owner});
        if(!result){
            throw HttpError(404, `Contact with id=${id} not found`);            
        }
        res.json(result);   
};

const add = async(req, res) => {       
        const {_id: owner} = req.user;
        // console.log(req.file);
        // console.log(req.body);
        const {path: oldPath, filename} = req.file;
        const newPath = path.join(avatarsPath, filename);
        await fs.rename(oldPath, newPath);//переміщення файлу з temp в public/avatars
        // console.log(oldPath);
        // console.log(newPath);
        const avatar = path.join('avatars', filename);//створили назву файлу
        const result = await Contact.create({...req.body, avatar, owner});//збереження в базі
        res.status(201).json(result);
};

const updateById = async(req, res ) => {   
        const {id} = req.params;
        const {_id: owner} = req.user;
        const result = await Contact.findOneAndUpdate( {_id: id, owner}, req.body);
        if(!result){
                throw HttpError(404, `Contact with id=${id} not found`);            
            }
        res.json(result); 
}; 

const deleteById = async(req, res ) => {   
        const {id} = req.params;
        const {_id: owner} = req.user;
        const result = await Contact.findOneAndDelete({_id: id, owner});
        if(!result){
            throw HttpError(404, `Contact with id=${id} not found`);            
        }      
        res.json({
            message: 'Contact delete'
        }) 
};

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById)
};
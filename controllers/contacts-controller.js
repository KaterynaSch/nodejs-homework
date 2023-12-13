import * as contactService from "../models/contacts/index.js";

import {ctrlWrapper} from '../decorators/index.js';

import {HttpError} from '../helpers/index.js';

const getAll = async(req, res) => {    
        const result = await contactService.listContacts();
        res.json(result);    
};

const getById = async(req, res) => {    
        const {id} = req.params;
        const result = await contactService.getContactById(id);
        if(!result){
            throw HttpError(404, `Contact with id=${id} not found`);            
        }
        res.json(result);   
};

const add = async(req, res) => {  
        const result = await contactService.addContact(req.body);
        res.status(201).json(result);    
};

const updateById = async(req, res ) => {   
       const {id} = req.params;
       const result = await contactService.updateContact(id, req.body);
       if(!result){
            throw HttpError(404, `Contact with id=${id} not found`);            
        }
        res.json(result); 
};

const deleteById = async(req, res ) => {   
        const {id} = req.params;
        const result = await contactService.removeContact(id);
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
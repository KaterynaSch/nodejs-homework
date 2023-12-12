// import Joi from "joi";
import * as contactService from "../models/contacts/index.js";
import {HttpError} from '../helpers/index.js';
import { contactAddSchema } from "../schemas/contact-schemas.js";

// const contactAddSchema = Joi.object({
//     name: Joi.string().required().messages({
//         "any.required": `"name" must be exist`,
//         "string.base": `"name" must be exist`,
//     }),
//     email: Joi.string().required(),
//     phone: Joi.string().required()
// })

const getAllContacts = async(req, res, next) => {
    //додаємо обробку можливих помилок
    try {
        const result = await contactService.listContacts();
        res.json(result);
    } catch (error) {
        next(error);
        // const {status = 500, message = "Server error"} = error;
        // res.status(status).json({//помилка без статусу якщо немає коннекту з базою
        //     message,
        // })
        // res.status(500).json({
        //     message: error.message,
        // })
    }
    
};

const getById = async(req, res, next) => {
    try {        
        const {id} = req.params;
        const result = await contactService.getContactById(id);
        if(!result){//помилк якщо немає такого id
            throw HttpError(404, `Contact with id=${id} not found`);            
        }
        res.json(result)
    } catch (error) {
        next(error)
        // const {status = 500, message = "Server error"} = error;
        // res.status(status).json({//помилка без статусу якщо немає коннекту з базою
        //     message,
        // })
    }
};

const add = async(req, res, next) => {
    try {
        const {error} = contactAddSchema.validate(req.body);
        if(error) {
            throw HttpError(400,error.message);
        }
       
        const result = await contactService.addContact(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
}




export default {
    getAllContacts,
    getById,
    add
}
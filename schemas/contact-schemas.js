import Joi from "joi";

//схема для додавання нового контакту
// export const contactAddSchema = Joi.object({
//     name: Joi.string().required(),
//     email: Joi.string().required(),
//     phone: Joi.string().required()
// });

export const contactAddSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required()
});

//схема для оновлення, де поля не є обов'язковими
export const contactUpdateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string()
});

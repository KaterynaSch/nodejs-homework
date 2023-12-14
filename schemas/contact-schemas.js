import Joi from "joi";

export const contactAddSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
}).messages({
    "any.required": 'missing required "{#label}" field',
});

//схема для оновлення, де поля не є обов'язковими
export const contactUpdateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string()
});

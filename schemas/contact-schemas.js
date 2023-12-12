import Joi from "joi";

export const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": `"name" must be exist`,
        "string.base": `"name" must be exist`,
    }),
    email: Joi.string().required(),
    phone: Joi.string().required()
})
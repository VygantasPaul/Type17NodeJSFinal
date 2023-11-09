import Joi from "joi";


const userRegistrationSchema = Joi.object({
    name: Joi.string().required().min(4),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    money_balance: Joi.number().required()
})

export default userRegistrationSchema;
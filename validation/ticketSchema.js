import Joi from "joi";


const ticketSchema = Joi.object({
    title: Joi.string().min(4).required(),
    from_location: Joi.string().min(4).required(),
    to_location: Joi.string().min(4).required(),
    ticket_price: Joi.number().required(),
    to_location_photo_url: Joi.string(),
})

export default ticketSchema;
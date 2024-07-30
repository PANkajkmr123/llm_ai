import Joi from 'joi';

const registerAddressSchema = Joi.object({
    addressId: Joi.string().optional().trim(),
    addressLine1: Joi.string().required().min(3).trim(),
    addressLine2: Joi.string().required().min(4).trim(),
    addressLine3: Joi.string().optional().trim(),
    type: Joi.string().required().lowercase().trim(),   //home , work , other
    lat: Joi.string().required().trim(),
    long: Joi.string().required().trim(),
    landmark: Joi.string().optional().trim(),


})




export {
    registerAddressSchema,
}
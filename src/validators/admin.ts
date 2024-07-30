import Joi, { string } from 'joi';

//******Singup Schema********/
const signUpSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    phoneNumber: Joi.string()
    .min(10)
    .max(10)
    .required()
    .messages({
        'string.empty': `Phone Number cannot be an empty field`,
        'string.min': `Phone Number should have a minimum length of {#limit}`,
        'string.max': `Phone Number should have a maximum length of {#limit}`,
        'any.required': `Phone Number is a required field`
    }),
    password: Joi.string()

})
//******Login Schema********/
const loginSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required(),
   
})

//******changePassword Schema********/
const changePasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).max(10).required(),
    password: Joi.string().max(10).required(),
})






export {
    signUpSchema,
    loginSchema,
    changePasswordSchema
   
}
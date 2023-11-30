
const Joi = require('joi');

module.exports.productSchema = Joi.object({
    name:Joi.string().required(),
    image:Joi.string().required(),
    price:Joi.number().min(0).required(),
    selling_price:Joi.number().min(0).required(),
    category:Joi.string().required(),
    discount:Joi.string().required(),
    desc:Joi.string().required()
});

module.exports.reviewSchema = Joi.object({
    rating:Joi.number().min(0).max(5).required(),
    comment:Joi.string().required(),
    name:Joi.string().required(),
    email:Joi.string().required()
})

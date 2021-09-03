const Joi = require("joi");
//let JoiPassword = require("joi-password");
let passwordComplexity = require("joi-password-complexity");

const email = Joi.string().email({
	minDomainSegments: 2,
	tlds: { allow: ["com", "net"] },
});
const pin = Joi.string().min(4).max(4);
// const newPassword = Joi.string().min(8).max(30).required();


const resetPassReqValidation = (req, res, next) => {
    const schema = Joi.object({email})
    const value = schema.validate(req.body)
    if(value.error){
        return res.json({status: "Error", message: value.error.message});
    }
    next();
};

const updatePassReqValidation = (req, res, next) => {
    const schema = Joi.object({email, pin, newPassword: passwordComplexity().required()})
    const value = schema.validate(req.body)
    if(value.error){
        return res.json({status: "Error", message: value.error.message});
    }
    next();
};

module.exports = {
    resetPassReqValidation, 
    updatePassReqValidation
}
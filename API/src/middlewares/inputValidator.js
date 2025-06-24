import Joi from "joi";

const userSchema = Joi.object({
    id: Joi.number(),
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    designation: Joi.string().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    salary: Joi.number().integer().min(1000).required()
});

const validateEmployee = (req, res, next) => {
    const {error} = userSchema.validate(req.body);
    if(error) return res.status(404).json({
        status: 400,
        message: error.details[0].message
    })
    next();
}

export default validateEmployee;
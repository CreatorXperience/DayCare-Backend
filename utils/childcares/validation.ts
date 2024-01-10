import Joi from "joi"

type TProfile = {
	title: string;
	amount: string;
	perDuration: number;
	rating: number;
	description: string;
	owner: string;
	phonenumber: string;
	isOpen: string;
	image: string
}
const validation = (profilePayload: TProfile )=>{
let payloadSchema = Joi.object({
title: Joi.string().required().min(5).max(20),
amount: Joi.string().required(),
perDuration: Joi.number().required().min(1).max(24),
rating: Joi.number().required(),
description: Joi.string().required().min(10),
owner: Joi.string().required(),
phonenumber: Joi.string().required().min(10).max(10),
isOpen: Joi.string().required(),
image: Joi.string().required(),
location:  Joi.object({
type: Joi.string().required(),
coordinates: Joi.array().items(Joi.number()).required()
}).required(),
userId: Joi.string().required()
})


return payloadSchema.validate(profilePayload)
}


export default validation

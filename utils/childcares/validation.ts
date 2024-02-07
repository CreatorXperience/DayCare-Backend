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
from: Joi.string().required(),
to: Joi.string().required(),
rating: Joi.number().required(),
description: Joi.string().required().min(10),
owner: Joi.string().required(),
phonenumber: Joi.string().required().min(10).max(10),
isOpen: Joi.string().required(),
image: Joi.string().required(),
location:  Joi.string().required(),
userId: Joi.string().required()
})


return payloadSchema.validate(profilePayload)
}


export default validation

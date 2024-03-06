import Joi from "joi"

export type TProfile = {
	title: string;
	amount: string;
	perDuration: number;
	rating: number;
	description: string;
	owner: string;
	phonenumber: string;
	isOpen: string;
	image: string, 
    role: string,
    from: string,
    location: string,
    to: string,
    userId: string,
}

let childCareProfileUpdateSchema =  (profile: Partial<TProfile>)=>{
    let payloadSchema = Joi.object({
        title: Joi.string().min(5).max(20),
        amount: Joi.string(),
        from: Joi.string(),
        to: Joi.string(),
        rating: Joi.number(),
        description: Joi.string().min(10),
        phonenumber: Joi.string().min(10).max(10),
        isOpen: Joi.boolean(),
        image: Joi.string(),
        location:  Joi.string(),
        userId: Joi.string(),
        owner: Joi.string(),
        role: Joi.string(),
        })

     return    payloadSchema.validate(profile)
}

const validation = (profilePayload: TProfile )=>{
let payloadSchema = Joi.object({
title: Joi.string().required().min(5).max(20),
amount: Joi.string().required(),
from: Joi.string().required(),
to: Joi.string().required(),
rating: Joi.number().required(),
description: Joi.string().required().min(10),
phonenumber: Joi.string().required().min(10).max(10),
isOpen: Joi.boolean().required(),
image: Joi.string().required(),
location:  Joi.string().required(),
userId: Joi.string().required(),
owner:  Joi.string().required().max(50),
role: Joi.string().required().max(30),
})


return payloadSchema.validate(profilePayload)
}


export {validation, childCareProfileUpdateSchema}

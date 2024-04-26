import Joi from "joi"



type TPayload = {
    name: string;
    children_name: string;
    gender: string,
    age: number,
    drop: string,
    take: string,
    role: string
}

const schemaValidation = (payload: TPayload)=>{
    let schema = Joi.object(
        {
            name: Joi.string().required().min(5).max(25),
            children_name: Joi.string().required().min(5).max(25),
            gender: Joi.string().required().min(1),
            age: Joi.number().required(),
            drop: Joi.string().required().min(1),
            take: Joi.string().required().min(1),
            role: Joi.string().required().min(1),
            user: Joi.string().required().min(1)
        }
    )

 return   schema.validate(payload)
}

const profileSchemaValidation = (payload: TPayload)=>{
    let schema = Joi.object(
        {
            name: Joi.string().min(5).max(25),
            children_name: Joi.string().min(5).max(25),
            gender: Joi.string(),
            age: Joi.number(),
            drop: Joi.string(),
            take: Joi.string(),
            role: Joi.string(),
            user: Joi.string()
        }
    )

 return   schema.validate(payload)
}


export { schemaValidation, profileSchemaValidation}
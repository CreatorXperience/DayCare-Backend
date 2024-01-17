import express from "express"
import Joi from "joi"

const router = express.Router()
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
            gender: Joi.string().required(),
            age: Joi.number().required(),
            drop: Joi.string().required(),
            take: Joi.string().required(),
            role: Joi.string().required()
        }
    )

 return   schema.validate(payload)
}

router.post("/", (req,res)=> {
let {error}=  schemaValidation(req.body)
if(error){
    return  res.status(404).send({message: "Bad Payload"})
}
})

export default router
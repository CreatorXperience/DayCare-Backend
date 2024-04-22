import Joi from "joi";

const locateUserValidation = (payload: {long: number,lat: number})=> {
    let schema = Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required()
    })
    
    return schema.validate(payload)
    }
    
    
    type TPayload = {
        sortby: string,
        location: string,
       maxp: number;
       minp: number
    }
    
     
    const  filterChildCareValidation = (payload: TPayload)=>{
        let schema = Joi.object({
           location: Joi.string().required(),
           maxp: Joi.number().required(),
           minp: Joi.number().required()
            })
            
            return schema.validate(payload)
    }


    export {locateUserValidation, filterChildCareValidation}
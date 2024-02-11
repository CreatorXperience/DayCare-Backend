import Joi from "joi"
import { TMessagePayload } from "./type"

const schemaValidation = (payload: TMessagePayload)=> {
    let schema = Joi.object({
        message: Joi.string().required(),
        senderId: Joi.string().required(),
        chatId: Joi.string().required()
    })

    return schema.validate(payload)
}

export default schemaValidation
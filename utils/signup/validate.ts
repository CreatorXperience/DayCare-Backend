import Joi from "joi"
import complexPassword from "joi-password-complexity"

type TSignupPaylaod = {
    fullname: string,
    email: string,
    password: string
}
const validate_signup_payload = (payload: TSignupPaylaod)=>{


    let passwordOption = {
        min: 10,
        max: 20,
        lowerCase:1,
        upperCase:1,
        numeric:1,
        symbol: 1
    }
    
    let validation = Joi.object({
        fullname: Joi.string().required().max(25).min(5),
        email: Joi.string().required().min(5).max(255).email(),
        password: complexPassword(passwordOption).required()
    })
    
    return  validation.validate(payload)
    }

    export default validate_signup_payload
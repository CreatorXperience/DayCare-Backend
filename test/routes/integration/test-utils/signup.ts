import request from "supertest"
import { app } from "../../../.."

const signupUser = async (payload: {fullname: string, email:string,password: string})=> {
    let response = await request(app).post("/signup").send(payload)
    return response
}


export {
    signupUser
}
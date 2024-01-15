import request from "supertest"
import { app } from "../../../.."

const signInUser = async (payload: {email: string, password?: string})=>{
    let response = await request(app).post("/auth").send(payload)
    return response
}


export default signInUser
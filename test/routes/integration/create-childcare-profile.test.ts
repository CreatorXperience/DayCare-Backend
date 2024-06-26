import mongoose from "mongoose"
import request from "supertest"
import { app, server } from "../../.."
import _ from "lodash"
import { signupUser } from "./test-utils/signup"
import axios from "axios"
import userPayload from "./test-utils/signupPayload"
import profile_payload from "./test-utils/profilePayload"

let axiosMock = jest.mock("axios")
axios.get = jest.fn().mockResolvedValue({data: [{"latitude": 1.0, "longitude": 2.1}]})

describe("POST /profile", ()=>{
describe("POST  ", ()=> {
afterAll(async()=>{
	await mongoose.connection.dropDatabase()
	await mongoose.connection.close()
	await server.stop()
})



let token: string; 

beforeAll(async ()=>{
	 await signupUser(userPayload)
})

beforeEach(async()=>{
let response =  await request(app).post("/auth").send(_.pick(userPayload, ["email", "password"]))
token = response.header.authorization 
})




test("should return 200 response status if sent to /profile correct input",async ()=> {
    let response = await request(app).post("/create-childcare-profile").send(profile_payload).set("authorization", token)
    expect(response.status).toBe(200)
}) 

test("should return 404 error if a token is provided to /payload  but with bad payload",async ()=> {
	let bad_payload = {
    title:  "David's Daycare",
    amount: "50",
    perDuration: 2
}
    let response = await request(app).post("/create-childcare-profile").send(bad_payload).set("authorization", token)
    expect(response.status).toBe(404)
})

test("should return a 401 error if token is not provided to /profile",async ()=> {
    let response = await request(app).post("/create-childcare-profile").send(profile_payload)
    expect(response.status).toBe(401)
})

}
)})

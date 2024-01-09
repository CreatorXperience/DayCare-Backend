import mongoose from "mongoose"
import request from "supertest"
import { app, server } from "../../.."
import _ from "lodash"

describe("POST /profile", ()=>{
describe("POST  ", ()=> {
afterAll(async()=>{
	await mongoose.connection.dropDatabase()
	await mongoose.connection.close()
	await server.stop()
})


let newUserPayload = {
fullname: "Habeeb Muhydeen Ayinde",
email: "creatorXperience@example.com",
password: "1233455Ha#lll"
}

let token: string; 
let userId: string;

beforeAll(async ()=>{
	let response = await request(app).post("/signup").send(newUserPayload)
	console.log(response.body._id)
})

beforeEach(async()=>{
let response =  await request(app).post("/auth").send(_.pick(newUserPayload, ["email", "password"]))
token = response.header.authorization 
})


let profile_payload = {
    title:  "David's Daycare",
    amount: "50",
    perDuration: 2,
    rating: 5,
    description: "Am gonna do you well",
    owner: "Peter Parker", 
    phonenumber: "0099999999", 
    isOpen: "yes",
    image: "daycare.png",
    location: {type: "Point", coordinates: [3.005,2.0344]},
    userId: "659bdb0ad66c81e2ac3e5628"
}
test("send post request to /profile",async ()=> {
    let response = await request(app).post("/create-profile").send(profile_payload).set("authorization", token)
    expect(response.status).toBe(200)
}) 
test("should return 404 error if a token is provided to /payload  but with bad payload",async ()=> {
	let bad_payload = {
    title:  "David's Daycare",
    amount: "50",
    perDuration: 2
}
    let response = await request(app).post("/create-profile").send(bad_payload).set("authorization", token)
    expect(response.status).toBe(404)
    console.log(response.body.message)
})

test("should return a 401 error if token is not provided to /profile",async ()=> {
    let response = await request(app).post("/create-profile").send(profile_payload)
    expect(response.status).toBe(401)
})

}

)})

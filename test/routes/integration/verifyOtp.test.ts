import mongoose from "mongoose"
import {app, server} from "../../.."
import request from  "supertest"
import Otp_model from "../../../models/otp-model"
import bcrypt from "bcryptjs"

describe("sends request to /verify", ()=>{

afterAll(async ()=>{
await mongoose.connection.dropDatabase()
await mongoose.connection.close()
await server.stop()
})

let userId: string;
let hash: string;
beforeAll(async()=> {
	let user = {
	fullname: "peter parker",
	email: "peter@gmail.com",
	password: "12345678Ha$"	
	}
let response = await request(app).post("/signup").send(user)
userId = response.body.message._id

let getOtp = await Otp_model.findOne({owner: userId})
})

	describe("verify Otp", ()=> {

		test("should return 404 response if valid payload but wrong otp is sent to /verify ", async()=> {
		let response = await request(app).post("/verify-email").send({otp: "1234", ownerId: userId})
		expect(response.status).toBe(404)
		})

		test("should return 404 response if invalid payload is sent to /verify ", async()=> {
			let badPayload = {
			ownerId: 1
			}
		let response = await request(app).post("/verify-email").send(badPayload)
		expect(response.status).toBe(404)
		})
})
})

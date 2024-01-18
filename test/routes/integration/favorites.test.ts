import mongoose from "mongoose"
import { app, server } from "../../.."
import request from "supertest"
import { signupUser } from "./test-utils/signup"
import signInUser from "./test-utils/signin"
import _ from "lodash"
import axios from "axios"


let profile_payload = {
    title:  "David's Daycare",
    amount: "50",
    from: "2024-10-20",
    to: "2024-12-12",
    rating: 5,
    description: "Am gonna do you well",
    owner: "Peter Parker", 
    phonenumber: "0099999999", 
    isOpen: "yes",
    image: "daycare.png",
    location: "Abuja,Lagos",
}

let axiosMock = jest.mock("axios")
axios.get = jest.fn().mockResolvedValue({data: [{"latitude": 1.0, "longitude": 2.1}]})

describe("Send request to /favorite/:id", ()=>{
    let token: string;
    let daycare_id: string

    let userPayload = {
        fullname: "Samson Peter",
        email: "kel@gmail.com",
        password: "123456789@Hs"
    }

    afterAll(async()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        await server.stop()
    })

    beforeAll(async ()=>{
        let response = await signupUser(userPayload)

        let res = await signInUser(_.pick(userPayload, ["email", "password"]))
        token = res.header.authorization

    })

    beforeEach(async()=>{
        let profileRes = await request(app).post("/create-profile").send(profile_payload).set("authorization", token)
        daycare_id = profileRes.body._id.toString()
    })

    describe("POST /favorie/:id", ()=>{

        test("should return 200 response if token and valid daycareId is provided", async ()=>{
            let response = await request(app).post(`/favorite/${daycare_id}`).set("authorization", token)
            expect(response.status).toBe(200)        
        })

        test("should return 404 response if token and invalid daycareId is provided", async ()=>{
            let invalid_id = "65b69a99d990b09003990cdf"
            let response = await request(app).post(`/favorite/${invalid_id}`).set("authorization", token)
            expect(response.status).toBe(404)        
        })
    })

    describe("Delete /favorie/:id", ()=>{
        test("should return 200 response if token and valid daycareId is provided", async ()=>{
            let response = await request(app).delete(`/favorite/${daycare_id}`).set("authorization", token)
            expect(response.status).toBe(200)        
        })

        test("should return 404 response if token and invalid daycareId is provided", async ()=>{
            let invalid_id = "65b69a99d990b09003990cdf"
            let response = await request(app).delete(`/favorite/${invalid_id}`).set("authorization", token)
            expect(response.status).toBe(404)        
        })
    })
})




 	


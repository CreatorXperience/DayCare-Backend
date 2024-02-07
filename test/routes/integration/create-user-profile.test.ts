import mongoose from "mongoose"
import { app, server } from "../../.."
import request from "supertest"
import { signupUser } from "./test-utils/signup"
import signInUser from "./test-utils/signin"
import _ from "lodash"
import userPayload from "./test-utils/signupPayload"

describe("Send request to /favorite/:id", ()=>{
    let token: string;



    let user_profile_payload = {
        name: "hello tester",
        children_name: "Peter Parker",
        gender: "male",
        age: 5,
        drop: "13:00:00",
        take:  "13:00:00",
        role: "mother"
    }

    afterAll(async()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        await server.stop()
    })


    beforeAll(async ()=>{
         await signupUser(userPayload)

        let res = await signInUser(_.pick(userPayload, ["email", "password"]))
        token = res.header.authorization
    })

    describe("Post  /create-user-profile", ()=>{
        test("should return 200 response if token is provided", async()=>{
            let response = await request(app).post("/create-user-profile").send(user_profile_payload).set("authorization", token)
            expect(response.status).toBe(200)
        })

        test("should return 404 response if invalidPayload or incomplete is provided", async ()=>{
            let invalidPayload =  {}
            let response = await request(app).post("/create-user-profile").send(invalidPayload).set("authorization", token)
            expect(response.status).toBe(404)
        })
    })


})




 	


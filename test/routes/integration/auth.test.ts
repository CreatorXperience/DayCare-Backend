import mongoose from "mongoose"
import { app, server } from "../../.."
import request from "supertest"
import _ from "lodash"
import { signupUser } from "./test-utils/signup"
import signInUser from "./test-utils/signin"





describe("Send Request to  /auth", ()=>{
    afterAll(async()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        await server.stop()
     })

    describe("POST /auth", ()=>{
        let userPayload= {
            fullname: "Habeeb Muhydeen Ayinde",
            email: "allyearmustobey2@gmail.com",
            password: "12345678aB@0"
        }
        beforeAll(async ()=>{
            let response = await signupUser(userPayload)
            expect(response.status).toBe(200)
        })


        test("should return  200 response status if user sends the right paylaod with a an existing user", async ()=>{
            let response = await signInUser(_.pick(userPayload, ["email", "password"]))
            expect(response.status).toBe(200)
            expect(response.body.status).toMatch(/successfull/i)
        })




        test("should return 404 response status if payload is bad or incomplete", async()=>{
            let response = await signInUser(_.pick(userPayload, ["email"]))
            expect(response.status).toBe(404)
                expect(response.body.message).toMatch("\"password\" is required")
                expect(response.body.status).toMatch(/failed/i)
        })

        
        test("should return a 404 response status if we don't have the childcare owner in our database", async ()=>{
            let un_existing_user =  _.pick(userPayload, ["email", "password"])
            un_existing_user.email = "not_existing@gmail.com"
            let response =await  signInUser(un_existing_user)
            expect(response.status).toBe(404)
            expect(response.body.status).toMatch(/failed/i)
        })

        test("should return  404 response status if user sends the right paylaod but with wrong password", async ()=>{
            let existing_user =  _.pick(userPayload, ["email", "password"])
                existing_user.password = "wrongpass123@5W"
            let response = await request(app).post("/auth").send(existing_user)
            expect(response.status).toBe(404)
            expect(response.body.message).toMatch(/invalid email or password/i)
        })

    })
})

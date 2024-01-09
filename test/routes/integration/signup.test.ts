import mongoose from "mongoose"
import { app, server } from "../../.."
import request from "supertest"
import _ from "lodash"



describe("Send Request to  /Signup", ()=>{
    afterAll(async()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        await server.stop()
     })
    describe("POST  /signup", ()=>{
        let userPayload= {
            fullname: "Habeeb Muhydeen Ayinde",
            email: "allyearmustobey@gmail.com",
            password: "12345678aB@0"
        }
        
        test("should return 200 if  valid payload is provided to  /signup", async()=>{
            let response = await request(app).post("/signup").send(userPayload)
            expect(response.status).toBe(200)
            console.log(response.body)
            expect(response.body.message).toMatchObject( {fullname: userPayload.fullname,email: userPayload.email})
        })

        test("should return 200 if  valid payload is provided to  /signup", async()=>{
            let response = await request(app).post("/signup").send(userPayload)
            expect(response.status).toBe(404)
            expect(response.body.message).toMatch("user with this email already exist")
        })


          

        test("should return  404 if wrong payload is attached", async()=>{
            let response = await request(app).post("/signup").send({
                fullname: "perter",
                email: "fgh",
                password:  "saasdasdasdasdadad"
            })
            expect(response.status).toBe(404)
        })
    })
})

import mongoose from "mongoose"
import { app, server } from "../../.."
import { signupUser } from "./test-utils/signup"
import signInUser from "./test-utils/signin"
import _ from "lodash"
import userPayload from "./test-utils/signupPayload"
import request from "supertest"
import user_signup_model from "../../../models/user-account-model"

describe("GET /users", ()=>{
    afterAll(async()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        await server.stop()
     })

     let token: string
    describe("/users", ()=>{
        let id: string 
        beforeAll(async()=>{
           await signupUser(userPayload)
            let user  = await signInUser(_.omit(userPayload, "fullname"))
            id  = user.body.message._id
            token  = user.headers.authorization 
        })
        test("should return  all users", async  ()=>{
            let response = await request(app).get(`/users?id=${id}&chatId=${id}`).set("authorization", token)
            expect(response.status).toBe(200)
        })

        test("should return  404 if id is not a valid id", async  ()=>{
            let invalidId = "123456"
            let response = await request(app).get(`/users?id=${invalidId}&chatId=${id}`).set("authorization", token)
            expect(response.status).toBe(404)
        })

        test("should return no user with status 404", async  ()=>{
             await user_signup_model.deleteOne({_id: id})
            let response = await request(app).get(`/users?id=${id}&chatId=${id}`).set("authorization", token)
            expect(response.status).toBe(400)
        })
    })
})
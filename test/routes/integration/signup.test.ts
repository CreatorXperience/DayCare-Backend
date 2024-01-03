import mongoose from "mongoose"
import { app, server } from "../../.."
import request from "supertest"




describe("Send Request to  /Parent", ()=>{
    afterAll(async()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        await server.stop()
     })
    describe("POST /signup/", ()=>{
    test("post data to /signup", async()=>{
        let response = await request(app).post("/signup")
  expect(response.status).toBe(200)
    })
    })
})
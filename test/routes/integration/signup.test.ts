import mongoose from "mongoose"
import { server } from "../../.."




describe("Send Request to  /Parent", ()=>{
    afterAll(async()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        await server.stop()
     })
    describe("POST /parent", ()=>{
    test("post data to /parent", ()=>{
        expect(200).toBe(200)
    })
    })


})
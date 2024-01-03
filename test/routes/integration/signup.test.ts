import mongoose from "mongoose"
import { server } from "../../.."
// import { server } from "../../../startup/mongodb-connection"




describe("Send Request to  /Parent", ()=>{
    console.log(server)
    afterAll(async()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        console.log(server)
        await server.stop()
     })
    describe("POST /parent", ()=>{
    test("post data to /parent", ()=>{
        expect(200).toBe(200)
    })
    })


})
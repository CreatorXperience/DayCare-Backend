import mongoose from "mongoose"
import { app, server } from "../../.."
import { signupUser } from "./test-utils/signup"
import signInUser from "./test-utils/signin"
import request from "supertest"
import _ from "lodash"
import { TSignUpRes } from "./test-utils/chats.type"

describe("/messages", ()=> {
    afterAll(async()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        server.stop()
    })


    let firstUser = {
        fullname: "Tester One",
        email: "Tester@gmail.com",
        password: "`1234567890As@"
    }
    
    let secondUser = {
        fullname: "Tester Two",
        email: "Tester2@gmail.com",
        password: "`1234567890As@"
    }
    
    let firstUserRes: TSignUpRes;
    let secondUserRes: TSignUpRes
    let token:string;
    let chatId: string
    let chatPayload: {senderId: string, chatId: string,message:string}
    

    

    describe("POST /messages", ()=>{

        beforeAll( async ()=> {
            firstUserRes =  await signupUser(firstUser)
            secondUserRes = await signupUser(secondUser)


            let signInFirstUser = await signInUser(_.pick(firstUser, ["email", "password"]))
            token = signInFirstUser.headers.authorization
        
             let chat = await request(app).post(`/chat/${secondUserRes.body.message._id}`).set("authorization", token)
             chatId = chat.body.saved._id
             chatPayload = {
                senderId: secondUserRes.body.message._id,
                message: "Hello World",
                chatId
            }
            })

    
    test("should return 200 response if payload is valid ", async()=>{
    let response = await request(app).post("/message").send(chatPayload).set("authorization", token)
    expect(response.status).toBe(200)
    })

    test("should return 404 response if payload is invalid ", async ()=>{
        let response = await request(app).post("/message").send({}).set("authorization", token)
        expect(response.status).toBe(404)
        })  

    } )
})
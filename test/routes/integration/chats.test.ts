import mongoose from "mongoose"
import { app, server } from "../../.."
import request from  "supertest"
import { signupUser } from "./test-utils/signup"
import signInUser from "./test-utils/signin"
import _ from "lodash"


type TSignUpRes = {
body: {
    message: {
        _id: string
    }
}
}

describe("chats", ()=> {
afterAll(async()=> {
await mongoose.connection.dropDatabase()
await mongoose.connection.close()
await server.stop()
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

beforeAll( async ()=> {
firstUserRes =  await signupUser(firstUser)
secondUserRes = await signupUser(secondUser)
})


beforeEach(async()=> {
let signInFirstUser = await signInUser(_.pick(firstUser, ["email", "password"]))
token = signInFirstUser.headers.authorization
})

describe("POST /chats  - create a new chat",()=> {
test("Should return a 200 response and create a new chat if the specified user ID is not among the members of the user member", async ()=> {
let response  = await request(app).post(`/chat/${secondUserRes.body.message._id}`).set("authorization",  token)
expect(response.status).toBe(200)

expect(response.body.message).toBe("created new chat")
})


test("Should return a 200 response and return existing user if the specified user ID is among the members of the user member", async ()=> {
    let response  = await request(app).post(`/chat/${secondUserRes.body.message._id}`).set("authorization",  token)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("chat already exist")
    })
})



describe("GET user chat ", ()=>{
    test("should return all user chat", async()=> {
        let response =  await request(app).get("/chat/allchats").set("authorization", token)
        expect(response.status).toBe(200)
        expect(response.body.chat[0].members).toContain(firstUserRes.body.message._id)
        expect(response.body.chat[0].members).toContain(secondUserRes.body.message._id)
    })

    test("should return a chat", async()=> {
        let response =  await request(app).get(`/chat/single-chat/${secondUserRes.body.message._id}`).set("authorization", token)
        expect(response.status).toBe(200)
        expect(response.body.chat.members).toContain(secondUserRes.body.message._id)
        expect(response.body.chat.members).toContain(firstUserRes.body.message._id)
    })

    test("should return no chat if not chat between two user", async()=> {
        await mongoose.connection.dropCollection("chats")
        let response =  await request(app).get(`/chat/single-chat/${secondUserRes.body.message._id}`).set("authorization", token)
        expect(response.status).toBe(404)
        expect(response.body.body.message).toBe("chats not found")
    })
})
})
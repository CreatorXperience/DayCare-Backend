import mongoose from "mongoose"
import { server,app } from "../../.."
import request from "supertest"
import axios from "axios"
import { signupUser } from "./test-utils/signup"
import signInUser from "./test-utils/signin"


let axiosMock = jest.mock("axios")
axios.get = jest.fn().mockResolvedValue({data: [{"latitude": 1.0, "longitude": 2.1}]})


describe("POST /locate-childcares", ()=>{
    afterAll(async()=>{
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        await server.stop()
     })

     let profile_payload = {
        title:  "David's Daycare",
        amount: "50",
        perDuration: 2,
        rating: 5,
        description: "Am gonna do you well",
        owner: "Peter Parker", 
        phonenumber: "0099999999", 
        isOpen: "yes",
        image: "daycare.png",
        location: {type: "Point", coordinates: [3.005,2.0344]},
        userId: "659bdb0ad66c81e2ac3e5628"
    }

    let token: string;

     beforeAll(async()=>{
        let newuser = {
            fullname: "peterson samuell",
            email: "peterson@gmail.com",
            password: "1234567899As@"
        }
       await signupUser(newuser)
     })

     beforeEach(async()=>{
        let existing_user = {
            email: "peterson@gmail.com",
            password: "1234567899As@"
        }
        let response = await signInUser(existing_user)
   token = response.header.authorization
        await request(app).post("/create-profile").send(profile_payload).set("authorization", token)
     })


     describe("POST /locate-childcares",()=>{
      let locationPayload = {
        long: "10.00",
        lat: "5.3"
                }
                
    test("should return 200 response status if input is a valid payload", async ()=>{

      let response = await request(app).post("/locate-childcares").send(locationPayload).set("authorization", token)
     expect(response.status).toBe(200)
    })

    test("should return 401 error response if no token is provided but with valid payload", async()=>{

      let response = await request(app).post("/locate-childcares").send(locationPayload)
      expect(response.status).toBe(401)
    })

    test("should return 401 error response if no token is provided and with invalid payload", async()=>{
      let badPayload = {
                }
      let response = await request(app).post("/locate-childcares").send(badPayload)
      expect(response.status).toBe(401)
    })

    test("should return 404 response status if input is an  invalid payload", async ()=>{
      let badPayload = {
        long: ""
      }
      let response = await request(app).post("/locate-childcares").send(badPayload).set("authorization", token)
     expect(response.status).toBe(404)
    })
  })


  describe("POST /locate-childcares/filter",()=>{
    let locationPayload = {
        "sortby": "reviews",
        "location": "Abuja,Nigeria",
        "maxp": 100,
        "minp": 20
      }

  test("should return 200 response status if input is a valid payload", async ()=>{
    let response = await request(app).post("/locate-childcares/filter").send(locationPayload).set("authorization", token)
   expect(response.status).toBe(200)
  })


  test("should return 401 error response if no token is provided but with valid payload", async()=>{
    let response = await request(app).post("/locate-childcares").send(locationPayload)
    expect(response.status).toBe(401)
  })

  test("should return 401 error response if no token is provided but with invalid payload", async()=>{
    let badPayload = {}
    let response = await request(app).post("/locate-childcares").send(badPayload)
    expect(response.status).toBe(401)
  })


  test("should return 404 response status if input is a bad or incomplete payload", async ()=>{
    let badPayload = {}
    let response = await request(app).post("/locate-childcares/filter").send(badPayload).set("authorization", token)
   expect(response.status).toBe(404)
  })

  test("should return 404 response status if input is a bad or incomplete payload", async ()=>{
    axios.get = jest.fn().mockResolvedValue({data: null})
    let response = await request(app).post("/locate-childcares/filter").send(locationPayload).set("authorization", token)
   expect(response.status).toBe(500)
  })
})
})
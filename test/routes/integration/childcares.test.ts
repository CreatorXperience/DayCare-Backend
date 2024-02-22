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
        from: "2024-10-20",
        to: "2024-12-12",
        rating: 5,
        description: "Am gonna do you well",
        phonenumber: "0099999999", 
        isOpen: "yes",
        image: "daycare.png",
        location: "Abuja,Nigeria",
        userId: "659bdb0ad66c81e2ac3e5628"
    }

    let token: string;
    let daycareId: string

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
      let profileRes =   await request(app).post("/create-childcare-profile").send(profile_payload).set("authorization", token)
        daycareId = profileRes.body._id
   
     })


     describe("POST /locate-childcares",()=>{
      let locationPayload = {
        long: "10.00",
        lat: "5.3"
                }
                
    test("should return 200 response status if input is a valid payload", async ()=>{

      let response = await request(app).get(`/locate-childcares/${locationPayload.long}/${locationPayload.lat}`).set("authorization", token)
     expect(response.status).toBe(200)
    })

    test("should return 401 error response if no token is provided but with valid payload", async()=>{

      let response = await request(app).get(`/locate-childcares/${locationPayload.long}/${locationPayload.lat}`)
      expect(response.status).toBe(401)
    })
  })

  describe("GET /:daycareId",  ()=>{
test("should return  200  if daycare exist", async()=>{
  let response = await request(app).get(`/locate-childcares/${daycareId}`).set("authorization", token)
  console.log(response.status)
     expect(response.status).toBe(200)
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

describe("PATCH /locate-childcares", ()=>{


  test("should return 500 if axios failed to fetch location coordinates", async ()=>{
    let response = await request(app).patch("/locate-childcares").send(profile_payload).set("authorization", token)
    expect(response.status).toBe(500)
  })
  test("should return 200 if payload is valid and token is set", async ()=>{
    axios.get = jest.fn().mockResolvedValue({data: [{"latitude": 1.0, "longitude": 2.1}]})
    let response = await request(app).patch("/locate-childcares").send(profile_payload).set("authorization", token)
    expect(response.status).toBe(200)
  })

  test("should return 404 if payload is invalid and token is set", async ()=>{
    let response = await request(app).patch("/locate-childcares").send({testing: "123"}).set("authorization", token)
    expect(response.status).toBe(404)
  })
})
})
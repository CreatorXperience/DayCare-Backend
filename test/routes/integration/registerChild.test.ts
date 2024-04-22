import mongoose from "mongoose";
import { app, server } from "../../..";
import request from "supertest";
import { signupUser } from "./test-utils/signup";
import signInUser from "./test-utils/signin";
import _ from "lodash";
import userPayload from "./test-utils/signupPayload";
import axios from "axios";
import profile_payload from "./test-utils/profilePayload";

let axiosMock = jest.mock("axios")
axios.get = jest.fn().mockResolvedValue({data: [{"latitude": 1.0, "longitude": 2.1}]})

describe("Sends request to /create-article", () => {
  let token: string;
  let daycareId: string; 
  let userId: string



  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await server.stop();
  });

  beforeAll(async () => {
 await signupUser(userPayload);
    let res = await signInUser(_.pick(userPayload, ["email", "password"]));
    token = res.header.authorization;   
    let response = await request(app).post("/create-childcare-profile").send(profile_payload).set("authorization", token)
    daycareId = response.body._id
    userId = res.body.message._id
  });


  describe("POST /register", () => {
    test("should return 200 if daycareId and userId is provided", async() => {
        let response = await request(app).post(`/register/${daycareId}`).set("authorization", token)
        expect(response.status).toBe(200)
    });
  });


  describe("/registered/:id", ()=>{
    test("should return 200 if daycareId and userId is provided", async() => {
      let register = await request(app).post(`/register/${daycareId}`).set("authorization", token)
        let response = await request(app).get(`/register/registered/${daycareId}`).set("authorization", token)
        expect(response.status).toBe(200)
        expect(register.status).toBe(200)
    });
  })


  describe("/register/registerDaycares", ()=>{

    test("should return 200 if daycareId and userId is provided", async() => {
      let register = await request(app).post(`/register/${daycareId}`).set("authorization", token)
      let response = await request(app).get(`/register/registeredDaycares`).set("authorization", token)
      expect(register.status).toBe(200)
      expect(response.status).toBe(200)
      expect(response.body.registered.includes(userId)).toBeTruthy()
    });
  })
  
  test("should return 404 if user is not registered to any daycares", async() => {
      await mongoose.connection.dropCollection("registereds")
      let response = await request(app).get(`/register/registeredDaycares`).set("authorization", token)
      expect(response.status).toBe(404)
  });


});

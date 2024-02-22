import mongoose from "mongoose";
import { app, server } from "../../..";
import request from "supertest";
import { signupUser } from "./test-utils/signup";
import signInUser from "./test-utils/signin";
import _ from "lodash";
import userPayload from "./test-utils/signupPayload";
import axios from "axios";

let axiosMock = jest.mock("axios")
axios.get = jest.fn().mockResolvedValue({data: [{"latitude": 1.0, "longitude": 2.1}]})

describe("Sends request to /create-article", () => {
  let token: string;
  let daycareId: string; 
  let userId: string

let profile = {
    title:  "David's Daycare",
    amount: "50",
    from: "2024-10-20",
    to: "2024-12-12",
    rating: 5,
    description: "Am gonna do you well",
    phonenumber: "0099999999",
    isOpen: "yes",
    image: "daycare.png",
    location: "Abuja,Lagos"
}

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await server.stop();
  });

  beforeAll(async () => {
 await signupUser(userPayload);
    let res = await signInUser(_.pick(userPayload, ["email", "password"]));
    token = res.header.authorization;   
    let response = await request(app).post("/create-childcare-profile").send(profile).set("authorization", token)
    daycareId = response.body._id
    userId = res.body.message._id
  });


  describe("POST /register", () => {
    test("should return 200 if daycareId and userId is provided", async() => {
        let response = await request(app).post(`/register/${daycareId}`).set("authorization", token)
        expect(response.status).toBe(200)
    });
  });

  describe("GET /", ()=>{
    test("should return 200 if daycareId and userId is provided", async() => {
        let response = await request(app).get(`/register/registeredDaycares`).set("authorization", token)
        expect(response.status).toBe(200)
    });
  })
});

import mongoose from "mongoose";
import { app, server } from "../../..";
import request from "supertest";
import { signupUser } from "./test-utils/signup";
import signInUser from "./test-utils/signin";
import _ from "lodash";

describe("Sends request to /create-article", () => {
  let token: string;

  let userPayload = {
    fullname: "Samson Peter",
    email: "testerpeter@gmail.com",
    password: "123456789@Hs",
  };

  let article = {
    title: "hello testerizer",
    cover_image: "python.png",
    content:
      "npm, which stands for Node Package Manager, is a widely used package manager for the JavaScript programming language. It is the default package manager for Node.js, a runtime environment for executing JavaScript code outside of a web browser. npm facilitates the installation, management, and sharing of third-party libraries and tools that developers use in their JavaScript projects",
  };


  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await server.stop();
  });

  beforeAll(async () => {
 await signupUser(userPayload);
    let res = await signInUser(_.pick(userPayload, ["email", "password"]));
    token = res.header.authorization;
  });

  describe("POST  /create-article", () => {
    test("should return 200 response if valid  token and payload is provided", async () => {
      let response = await request(app).post("/article/create-article").send(article).set("authorization", token);
      expect(response.status).toBe(200)
    });

    test("should return 404 response if token and invalid pyaload is provided", async () => {
      let BadPayload = {}
      let response = await request(app).post("/article/create-article").send(BadPayload).set("authorization", token);
      expect(response.status).toBe(404)
    });
  });

  describe("GET  /articles", () => {
    let articleId: string;

    beforeAll(async()=>{
      let response = await request(app).post("/article/create-article").send(article).set("authorization", token);
      articleId =  response.body._id
    })
    test("should return 200 response if valid  token and payload is provided", async () => {
      let response = await request(app).get("/article/articles").set("authorization", token);
      expect(response.status).toBe(200)
    });

    test("should return 200 response if valid token and valid articleId  is provided", async () => {
      let response = await request(app).get(`/article/author/${articleId}`).set("authorization", token);
      expect(response.status).toBe(200)
    });
  });
});

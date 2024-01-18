"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("../../..");
const supertest_1 = __importDefault(require("supertest"));
const signup_1 = require("./test-utils/signup");
const signin_1 = __importDefault(require("./test-utils/signin"));
const lodash_1 = __importDefault(require("lodash"));
const signupPayload_1 = __importDefault(require("./test-utils/signupPayload"));
describe("Sends request to /create-article", () => {
    let token;
    ;
    let article = {
        title: "hello testerizer",
        cover_image: "python.png",
        content: "npm, which stands for Node Package Manager, is a widely used package manager for the JavaScript programming language. It is the default package manager for Node.js, a runtime environment for executing JavaScript code outside of a web browser. npm facilitates the installation, management, and sharing of third-party libraries and tools that developers use in their JavaScript projects",
    };
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield __1.server.stop();
    }));
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, signup_1.signupUser)(signupPayload_1.default);
        let res = yield (0, signin_1.default)(lodash_1.default.pick(signupPayload_1.default, ["email", "password"]));
        token = res.header.authorization;
    }));
    describe("POST  /create-article", () => {
        test("should return 200 response if valid  token and payload is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/article/create-article").send(article).set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return 404 response if token and invalid pyaload is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            let BadPayload = {};
            let response = yield (0, supertest_1.default)(__1.app).post("/article/create-article").send(BadPayload).set("authorization", token);
            expect(response.status).toBe(404);
        }));
    });
    describe("GET  /articles", () => {
        let articleId;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/article/create-article").send(article).set("authorization", token);
            articleId = response.body._id;
        }));
        test("should return 200 response if valid  token and payload is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).get("/article/articles").set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return 200 response if valid token and valid articleId  is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).get(`/article/author/${articleId}`).set("authorization", token);
            expect(response.status).toBe(200);
        }));
    });
});

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
describe("chats", () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield __1.server.stop();
    }));
    let firstUser = {
        fullname: "Tester One",
        email: "Tester@gmail.com",
        password: "`1234567890As@"
    };
    let secondUser = {
        fullname: "Tester Two",
        email: "Tester2@gmail.com",
        password: "`1234567890As@"
    };
    let firstUserRes;
    let secondUserRes;
    let token;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        firstUserRes = yield (0, signup_1.signupUser)(firstUser);
        secondUserRes = yield (0, signup_1.signupUser)(secondUser);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        let signInFirstUser = yield (0, signin_1.default)(lodash_1.default.pick(firstUser, ["email", "password"]));
        token = signInFirstUser.headers.authorization;
    }));
    describe("POST /chats  - create a new chat", () => {
        test("Should return a 200 response and create a new chat if the specified user ID is not among the members of the user member", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post(`/chat/${secondUserRes.body.message._id}`).set("authorization", token);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("created new chat");
        }));
        test("Should return a 200 response and return existing user if the specified user ID is among the members of the user member", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post(`/chat/${secondUserRes.body.message._id}`).set("authorization", token);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("chat already exist");
        }));
    });
    describe("GET user chat ", () => {
        test("should return all user chat", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).get("/chat/allchats").set("authorization", token);
            expect(response.status).toBe(200);
            expect(response.body.chat[0].members).toContain(firstUserRes.body.message._id);
            expect(response.body.chat[0].members).toContain(secondUserRes.body.message._id);
        }));
        test("should return a chat", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).get(`/chat/single-chat/${secondUserRes.body.message._id}`).set("authorization", token);
            expect(response.status).toBe(200);
            expect(response.body.chat.members).toContain(secondUserRes.body.message._id);
            expect(response.body.chat.members).toContain(firstUserRes.body.message._id);
        }));
        test("should return no chat if not chat between two user", () => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.connection.dropCollection("chats");
            let response = yield (0, supertest_1.default)(__1.app).get(`/chat/single-chat/${secondUserRes.body.message._id}`).set("authorization", token);
            expect(response.status).toBe(404);
            expect(response.body.body.message).toBe("chats not found");
        }));
    });
});

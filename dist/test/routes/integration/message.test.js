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
const signup_1 = require("./test-utils/signup");
const signin_1 = __importDefault(require("./test-utils/signin"));
const supertest_1 = __importDefault(require("supertest"));
const lodash_1 = __importDefault(require("lodash"));
describe("/messages", () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        __1.server.stop();
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
    let chatId;
    let chatPayload;
    describe("POST /messages", () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            firstUserRes = yield (0, signup_1.signupUser)(firstUser);
            secondUserRes = yield (0, signup_1.signupUser)(secondUser);
            let signInFirstUser = yield (0, signin_1.default)(lodash_1.default.pick(firstUser, ["email", "password"]));
            token = signInFirstUser.headers.authorization;
            let chat = yield (0, supertest_1.default)(__1.app).post(`/chat/${secondUserRes.body.message._id}`).set("authorization", token);
            chatId = chat.body.saved._id;
            chatPayload = {
                senderId: secondUserRes.body.message._id,
                message: "Hello World",
                chatId
            };
        }));
        test("should return 200 response if payload is valid ", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/message").send(chatPayload).set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return 404 response if payload is invalid ", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/message").send({}).set("authorization", token);
            expect(response.status).toBe(404);
        }));
    });
});

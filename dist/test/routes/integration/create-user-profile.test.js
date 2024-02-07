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
describe("Send request to /favorite/:id", () => {
    let token;
    let user_profile_payload = {
        name: "hello tester",
        children_name: "Peter Parker",
        gender: "male",
        age: 5,
        drop: "13:00:00",
        take: "13:00:00",
        role: "mother"
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
    describe("Post  /create-user-profile", () => {
        test("should return 200 response if token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/create-user-profile").send(user_profile_payload).set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return 404 response if invalidPayload or incomplete is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            let invalidPayload = {};
            let response = yield (0, supertest_1.default)(__1.app).post("/create-user-profile").send(invalidPayload).set("authorization", token);
            expect(response.status).toBe(404);
        }));
    });
});

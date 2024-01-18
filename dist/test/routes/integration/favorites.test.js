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
const axios_1 = __importDefault(require("axios"));
let profile_payload = {
    title: "David's Daycare",
    amount: "50",
    from: "2024-10-20",
    to: "2024-12-12",
    rating: 5,
    description: "Am gonna do you well",
    owner: "Peter Parker",
    phonenumber: "0099999999",
    isOpen: "yes",
    image: "daycare.png",
    location: "Abuja,Lagos",
};
let axiosMock = jest.mock("axios");
axios_1.default.get = jest.fn().mockResolvedValue({ data: [{ "latitude": 1.0, "longitude": 2.1 }] });
describe("Send request to /favorite/:id", () => {
    let token;
    let daycare_id;
    let userPayload = {
        fullname: "Samson Peter",
        email: "kel@gmail.com",
        password: "123456789@Hs"
    };
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield __1.server.stop();
    }));
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, signup_1.signupUser)(userPayload);
        let res = yield (0, signin_1.default)(lodash_1.default.pick(userPayload, ["email", "password"]));
        token = res.header.authorization;
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        let profileRes = yield (0, supertest_1.default)(__1.app).post("/create-profile").send(profile_payload).set("authorization", token);
        daycare_id = profileRes.body._id.toString();
    }));
    describe("POST /favorie/:id", () => {
        test("should return 200 response if token and valid daycareId is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post(`/favorite/${daycare_id}`).set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return 404 response if token and invalid daycareId is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            let invalid_id = "65b69a99d990b09003990cdf";
            let response = yield (0, supertest_1.default)(__1.app).post(`/favorite/${invalid_id}`).set("authorization", token);
            expect(response.status).toBe(404);
        }));
    });
    describe("Delete /favorie/:id", () => {
        test("should return 200 response if token and valid daycareId is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).delete(`/favorite/${daycare_id}`).set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return 404 response if token and invalid daycareId is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            let invalid_id = "65b69a99d990b09003990cdf";
            let response = yield (0, supertest_1.default)(__1.app).delete(`/favorite/${invalid_id}`).set("authorization", token);
            expect(response.status).toBe(404);
        }));
    });
});
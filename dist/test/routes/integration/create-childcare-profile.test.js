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
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("../../..");
const lodash_1 = __importDefault(require("lodash"));
const signup_1 = require("./test-utils/signup");
const axios_1 = __importDefault(require("axios"));
let axiosMock = jest.mock("axios");
axios_1.default.get = jest.fn().mockResolvedValue({ data: [{ "latitude": 1.0, "longitude": 2.1 }] });
describe("POST /profile", () => {
    describe("POST  ", () => {
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.connection.dropDatabase();
            yield mongoose_1.default.connection.close();
            yield __1.server.stop();
        }));
        let newUserPayload = {
            fullname: "Habeeb Muhydeen Ayinde",
            email: "creatorXperience@example.com",
            password: "1233455Ha#lll"
        };
        let token;
        let userId;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, signup_1.signupUser)(newUserPayload);
        }));
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/auth").send(lodash_1.default.pick(newUserPayload, ["email", "password"]));
            token = response.header.authorization;
        }));
        let profile_payload = {
            title: "David's Daycare",
            amount: "50",
            perDuration: 2,
            rating: 5,
            description: "Am gonna do you well",
            owner: "Peter Parker",
            phonenumber: "0099999999",
            isOpen: "yes",
            image: "daycare.png",
            location: "Abuja,Lagos",
        };
        test("should return 200 response status if sent to /profile correct input", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/create-profile").send(profile_payload).set("authorization", token);
            console.log(response.status);
            expect(response.status).toBe(200);
        }));
        test("should return 404 error if a token is provided to /payload  but with bad payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let bad_payload = {
                title: "David's Daycare",
                amount: "50",
                perDuration: 2
            };
            let response = yield (0, supertest_1.default)(__1.app).post("/create-profile").send(bad_payload).set("authorization", token);
            expect(response.status).toBe(404);
        }));
        test("should return a 401 error if token is not provided to /profile", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/create-profile").send(profile_payload);
            expect(response.status).toBe(401);
        }));
    });
});

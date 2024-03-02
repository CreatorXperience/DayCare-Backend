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
const axios_1 = __importDefault(require("axios"));
const signup_1 = require("./test-utils/signup");
const signin_1 = __importDefault(require("./test-utils/signin"));
const profilePayload_1 = __importDefault(require("./test-utils/profilePayload"));
let axiosMock = jest.mock("axios");
axios_1.default.get = jest.fn().mockResolvedValue({ data: [{ "latitude": 1.0, "longitude": 2.1 }] });
describe("POST /locate-childcares", () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield __1.server.stop();
    }));
    let token;
    let daycareId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        let newuser = {
            fullname: "peterson samuell",
            email: "peterson@gmail.com",
            password: "1234567899As@"
        };
        yield (0, signup_1.signupUser)(newuser);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        let existing_user = {
            email: "peterson@gmail.com",
            password: "1234567899As@"
        };
        let response = yield (0, signin_1.default)(existing_user);
        token = response.header.authorization;
        let profileRes = yield (0, supertest_1.default)(__1.app).post("/create-childcare-profile").send(profilePayload_1.default).set("authorization", token);
        daycareId = profileRes.body._id;
    }));
    describe("POST /locate-childcares", () => {
        let locationPayload = {
            long: "10.00",
            lat: "5.3"
        };
        test("should return 200 response status if input is a valid payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).get(`/locate-childcares/${locationPayload.long}/${locationPayload.lat}`).set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return 401 error response if no token is provided but with valid payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).get(`/locate-childcares/${locationPayload.long}/${locationPayload.lat}`);
            expect(response.status).toBe(401);
        }));
    });
    describe("GET /:daycareId", () => {
        test("should return  200  if daycare exist", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).get(`/locate-childcares/${daycareId}`).set("authorization", token);
            console.log(response.status);
            expect(response.status).toBe(200);
        }));
    });
    describe("POST /locate-childcares/filter", () => {
        let locationPayload = {
            "location": "Abuja,Nigeria",
            "maxp": 100,
            "minp": 20
        };
        test("should return 200 response status if input is a valid payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/locate-childcares/filter").send(locationPayload).set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return 404 response status if input is a bad or incomplete payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let badPayload = {};
            let response = yield (0, supertest_1.default)(__1.app).post("/locate-childcares/filter").send(badPayload).set("authorization", token);
            expect(response.status).toBe(404);
        }));
        test("should return 404 response status if input is a bad or incomplete payload", () => __awaiter(void 0, void 0, void 0, function* () {
            axios_1.default.get = jest.fn().mockResolvedValue({ data: null });
            let response = yield (0, supertest_1.default)(__1.app).post("/locate-childcares/filter").send(locationPayload).set("authorization", token);
            expect(response.status).toBe(500);
        }));
    });
    describe("PATCH /locate-childcares", () => {
        test("should return 500 if axios failed to fetch location coordinates", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).patch("/locate-childcares").send(profilePayload_1.default).set("authorization", token);
            expect(response.status).toBe(500);
        }));
        test("should return 200 if payload is valid and token is set", () => __awaiter(void 0, void 0, void 0, function* () {
            axios_1.default.get = jest.fn().mockResolvedValue({ data: [{ "latitude": 1.0, "longitude": 2.1 }] });
            let response = yield (0, supertest_1.default)(__1.app).patch("/locate-childcares").send(profilePayload_1.default).set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return 404 if payload is invalid and token is set", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).patch("/locate-childcares").send({ testing: "123" }).set("authorization", token);
            expect(response.status).toBe(404);
        }));
    });
});

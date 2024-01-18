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
let axiosMock = jest.mock("axios");
axios_1.default.get = jest.fn().mockResolvedValue({ data: [{ "latitude": 1.0, "longitude": 2.1 }] });
describe("POST /locate-childcares", () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield __1.server.stop();
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
        location: { type: "Point", coordinates: [3.005, 2.0344] },
        userId: "659bdb0ad66c81e2ac3e5628"
    };
    let token;
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
        yield (0, supertest_1.default)(__1.app).post("/create-childcare-profile").send(profile_payload).set("authorization", token);
    }));
    describe("POST /locate-childcares", () => {
        let locationPayload = {
            long: "10.00",
            lat: "5.3"
        };
        test("should return 200 response status if input is a valid payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/locate-childcares").send(locationPayload).set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return 401 error response if no token is provided but with valid payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/locate-childcares").send(locationPayload);
            expect(response.status).toBe(401);
        }));
        test("should return 401 error response if no token is provided and with invalid payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let badPayload = {};
            let response = yield (0, supertest_1.default)(__1.app).post("/locate-childcares").send(badPayload);
            expect(response.status).toBe(401);
        }));
        test("should return 404 response status if input is an  invalid payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let badPayload = {
                long: ""
            };
            let response = yield (0, supertest_1.default)(__1.app).post("/locate-childcares").send(badPayload).set("authorization", token);
            expect(response.status).toBe(404);
        }));
    });
    describe("POST /locate-childcares/filter", () => {
        let locationPayload = {
            "sortby": "reviews",
            "location": "Abuja,Nigeria",
            "maxp": 100,
            "minp": 20
        };
        test("should return 200 response status if input is a valid payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/locate-childcares/filter").send(locationPayload).set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return 401 error response if no token is provided but with valid payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/locate-childcares").send(locationPayload);
            expect(response.status).toBe(401);
        }));
        test("should return 401 error response if no token is provided but with invalid payload", () => __awaiter(void 0, void 0, void 0, function* () {
            let badPayload = {};
            let response = yield (0, supertest_1.default)(__1.app).post("/locate-childcares").send(badPayload);
            expect(response.status).toBe(401);
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
});

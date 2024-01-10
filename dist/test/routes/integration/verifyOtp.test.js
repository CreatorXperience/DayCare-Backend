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
const otp_model_1 = __importDefault(require("../../../models/otp-model"));
const signup_1 = require("./test-utils/signup");
describe("sends request to /verify", () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield __1.server.stop();
    }));
    let userId;
    let hash;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        let user = {
            fullname: "peter parker",
            email: "peter@gmail.com",
            password: "12345678Ha$"
        };
        let response = yield (0, signup_1.signupUser)(user);
        userId = response.body.message._id;
        let getOtp = yield otp_model_1.default.findOne({ owner: userId });
    }));
    describe("verify Otp", () => {
        test("should return 404 response if valid payload but wrong otp is sent to /verify ", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/verify-email").send({ otp: "1234", ownerId: userId });
            expect(response.status).toBe(404);
        }));
        test("should return 404 response if invalid payload is sent to /verify ", () => __awaiter(void 0, void 0, void 0, function* () {
            let badPayload = {
                ownerId: 1
            };
            let response = yield (0, supertest_1.default)(__1.app).post("/verify-email").send(badPayload);
            expect(response.status).toBe(404);
        }));
    });
});

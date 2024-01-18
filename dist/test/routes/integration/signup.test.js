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
const signupPayload_1 = __importDefault(require("./test-utils/signupPayload"));
describe("Send Request to  /Signup", () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield __1.server.stop();
    }));
    describe("POST  /signup", () => {
        test("should return 200 if  valid payload is provided to  /signup", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/signup").send(signupPayload_1.default);
            expect(response.status).toBe(200);
            expect(response.body.message).toMatchObject({ fullname: signupPayload_1.default.fullname, email: signupPayload_1.default.email });
        }));
        test("should return 200 if  valid payload is provided to  /signup", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/signup").send(signupPayload_1.default);
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch("user with this email already exist");
        }));
        test("should return  404 if wrong payload is attached", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/signup").send({
                fullname: "perter",
                email: "fgh",
                password: "saasdasdasdasdadad"
            });
            expect(response.status).toBe(404);
        }));
    });
});

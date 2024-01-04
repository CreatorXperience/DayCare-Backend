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
describe("Send Request to  /Parent", () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield __1.server.stop();
    }));
    describe("POST  /signup", () => {
        let userPayload = {
            fullname: "Habeeb Muhydeen Ayinde",
            email: "allyearmustobey@gmail.com",
            password: "12345678aB@0"
        };
        test("should return 200 if  valid payload is provided to  /signup", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/signup/daycare").send(userPayload);
            expect(response.status).toBe(200);
            expect(response.body.message).toMatchObject({ fullname: userPayload.fullname, email: userPayload.email });
        }));
        test("should return  404 if wrong payload is attached", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/signup/daycare").send({
                fullname: "perter",
                email: "fgh",
                password: "saasdasdasdasdadad"
            });
            expect(response.status).toBe(404);
        }));
    });
});

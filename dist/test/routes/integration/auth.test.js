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
const lodash_1 = __importDefault(require("lodash"));
describe("Send Request to  /auth", () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield __1.server.stop();
    }));
    describe("POST /auth", () => {
        let userPayload = {
            fullname: "Habeeb Muhydeen Ayinde",
            email: "allyearmustobey2@gmail.com",
            password: "12345678aB@0"
        };
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/signup").send(userPayload);
            expect(response.status).toBe(200);
        }));
        test("should return  200 response status if user sends the right paylaod with a an existing user", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/auth").send(lodash_1.default.pick(userPayload, ["email", "password"]));
            expect(response.status).toBe(200);
            expect(response.body.status).toMatch(/successfull/i);
        }));
        test("should return 404 response status if payload is bad or incomplete", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).post("/auth").send(lodash_1.default.pick(userPayload, ["email"]));
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch("\"password\" is required");
            expect(response.body.status).toMatch(/failed/i);
        }));
        test("should return a 404 response status if we don't have the childcare owner in our database", () => __awaiter(void 0, void 0, void 0, function* () {
            let un_existing_user = lodash_1.default.pick(userPayload, ["email", "password"]);
            un_existing_user.email = "not_existing@gmail.com";
            let response = yield (0, supertest_1.default)(__1.app).post("/auth").send(un_existing_user);
            expect(response.status).toBe(404);
            expect(response.body.status).toMatch(/failed/i);
        }));
        test("should return  404 response status if user sends the right paylaod but with wrong password", () => __awaiter(void 0, void 0, void 0, function* () {
            let existing_user = lodash_1.default.pick(userPayload, ["email", "password"]);
            existing_user.password = "wrongpass123@5W";
            let response = yield (0, supertest_1.default)(__1.app).post("/auth").send(existing_user);
            expect(response.status).toBe(404);
            expect(response.body.message).toMatch(/invalid email or password/i);
        }));
    });
});

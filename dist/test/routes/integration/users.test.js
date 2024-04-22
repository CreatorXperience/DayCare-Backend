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
const lodash_1 = __importDefault(require("lodash"));
const signupPayload_1 = __importDefault(require("./test-utils/signupPayload"));
const supertest_1 = __importDefault(require("supertest"));
const user_account_model_1 = __importDefault(require("../../../models/user-account-model"));
describe("GET /users", () => {
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        yield __1.server.stop();
    }));
    let token;
    describe("/users", () => {
        let id;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, signup_1.signupUser)(signupPayload_1.default);
            let user = yield (0, signin_1.default)(lodash_1.default.omit(signupPayload_1.default, "fullname"));
            id = user.body.message._id;
            token = user.headers.authorization;
        }));
        test("should return  all users", () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(__1.app).get(`/users?id=${id}&chatId=${id}`).set("authorization", token);
            expect(response.status).toBe(200);
        }));
        test("should return  404 if id is not a valid id", () => __awaiter(void 0, void 0, void 0, function* () {
            let invalidId = "123456";
            let response = yield (0, supertest_1.default)(__1.app).get(`/users?id=${invalidId}&chatId=${id}`).set("authorization", token);
            expect(response.status).toBe(404);
        }));
        test("should return no user with status 404", () => __awaiter(void 0, void 0, void 0, function* () {
            yield user_account_model_1.default.deleteOne({ _id: id });
            let response = yield (0, supertest_1.default)(__1.app).get(`/users?id=${id}&chatId=${id}`).set("authorization", token);
            expect(response.status).toBe(400);
        }));
    });
});

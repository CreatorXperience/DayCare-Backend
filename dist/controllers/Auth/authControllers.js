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
exports.loginUser = void 0;
const schema_1 = __importDefault(require("./schema"));
const user_account_model_1 = __importDefault(require("../../models/user-account-model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = (0, schema_1.default)(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message, status: "failed" });
    }
    let child_care = yield user_account_model_1.default.findOne({ email: req.body.email });
    if (!child_care) {
        return res.status(404).send({ message: "user with the specified email doesn't exist", status: "failed" });
    }
    let isPasswordEqual = yield bcryptjs_1.default.compare(req.body.password, child_care.password);
    if (!isPasswordEqual) {
        return res.status(404).send({ message: "Invalid email or Password" });
    }
    let token = child_care.generateAuthToken();
    res.setHeader("authorization", token).send({ message: "user logged in successfully", status: "successfull" });
});
exports.loginUser = loginUser;

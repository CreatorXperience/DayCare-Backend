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
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_account_model_1 = __importDefault(require("../models/user-account-model"));
const otp_model_1 = __importDefault(require("../models/otp-model"));
const router = express_1.default.Router();
let otpValidation = (otpPayload) => {
    let otpSchema = joi_1.default.object({
        otp: joi_1.default.string().required().min(6).max(6),
        ownerId: joi_1.default.string().required()
    });
    return otpSchema.validate(otpPayload);
};
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = otpValidation(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let getOtp = yield otp_model_1.default.findOne({ owner: req.body.ownerId });
    if (!getOtp) {
        return res.status(404).send({ message: "otp expired, request a new one" });
    }
    let isOtpEqual = yield bcryptjs_1.default.compare(req.body.otp, getOtp.otp);
    if (!isOtpEqual) {
        return res.status(404).send({ message: "wrong otp" });
    }
    let updateUser = yield user_account_model_1.default.updateOne({ _id: req.body.ownerId }, { $set: { is_verfied: true } });
    if (!updateUser) {
        return res.status(500).send({ message: "error occured while updating user" });
    }
    res.send({ message: "email verified successfully", status: "successfull" });
}));
exports.default = router;

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
const lodash_1 = __importDefault(require("lodash"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const childcare_signup_model_1 = __importDefault(require("../models/childcare-signup-model"));
const validate_1 = __importDefault(require("../utils/signup/validate"));
const otp_model_1 = __importDefault(require("../models/otp-model"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
let types = new mongoose_1.default.Types.ObjectId();
const sendOtp = (email, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        auth: { user: "allyearmustobey@gmail.com", pass: process.env.EMAIL_PASS },
    });
    let max = 999999;
    let min = 100000;
    let randomOtp = Math.floor(Math.random() * (max - min) + 1);
    let otp = new otp_model_1.default({
        otp: randomOtp,
        owner: new mongoose_1.default.Types.ObjectId(ownerId),
    });
    yield otp.save();
    let sender = transporter.sendMail({
        from: "allyearmustobey@gmail.com",
        to: email,
        subject: "verification otp",
        text: `Dont share this otp with anyone keep it safe  OTP: ${randomOtp} `
    }, (error, data) => {
        if (error) {
            return console.log("error sending verification pin");
        }
        return console.log("sent successfully");
    });
});
router.post("/daycare", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = (0, validate_1.default)(req.body);
    if (error) {
        return res.status(404).send({
            message: error.details[0].message,
            status: "Failed",
        });
    }
    let getChildCare = yield childcare_signup_model_1.default.findOne({ email: req.body.email });
    if (getChildCare) {
        return res.status(404).send({ message: "user with this email already exist" });
    }
    let child_care_payload = lodash_1.default.pick(req.body, ["fullname", "email", "password"]);
    let child_care = new childcare_signup_model_1.default(child_care_payload);
    let _salt = yield bcryptjs_1.default.genSalt(10);
    let _hash = yield bcryptjs_1.default.hash(child_care.password, _salt);
    child_care.password = _hash;
    let response = yield child_care.save();
    if (!response) {
        return res.status(404).send({ message: "couldn't save file to database" });
    }
    yield sendOtp(req.body.email, child_care._id);
    return res.send({
        message: lodash_1.default.pick(response, ["fullname", "email"]),
        status: " verification email send Succesfull"
    });
}));
exports.default = router;

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
const nodemailer_1 = __importDefault(require("nodemailer"));
const otp_model_1 = __importDefault(require("../../models/otp-model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let types = new mongoose_1.default.Types.ObjectId();
const sendOtp = (email, ownerId, template) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
    });
    let max = 999999;
    let min = 100000;
    let randomOtp = Math.floor(Math.random() * (max - min) + 1);
    let newOtp = new otp_model_1.default({
        otp: randomOtp,
        owner: new mongoose_1.default.Types.ObjectId(ownerId),
    });
    let salt = 10;
    let hash = yield bcryptjs_1.default.hash(randomOtp.toString(), salt);
    newOtp.otp = hash;
    yield newOtp.save();
    const relative = "../../views/index.html";
    let file = fs_1.default.readFileSync(path_1.default.join(__dirname, relative), "utf-8").toString();
    let compile = handlebars_1.default.compile(file);
    const replacement = {
        title: template.title,
        message: `${template.desc}: ${randomOtp}`
    };
    let htmlFile = compile(replacement);
    if (process.env.NODE_ENV !== "test")
        transporter.sendMail({
            from: "allyearmustobey@gmail.com",
            to: email,
            subject: template.title,
            html: htmlFile
        }, (error, data) => {
            if (error) {
                return console.log("error occured while send email");
            }
            console.log("sent successfully");
            return;
        });
});
exports.default = sendOtp;

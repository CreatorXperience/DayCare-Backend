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
const dotenv_1 = __importDefault(require("dotenv"));
const user_account_model_1 = __importDefault(require("../models/user-account-model"));
const validate_1 = __importDefault(require("../utils/signup/validate"));
const sendOtp_1 = __importDefault(require("../utils/signup/sendOtp"));
const otp_model_1 = __importDefault(require("../models/otp-model"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = (0, validate_1.default)(req.body);
    if (error) {
        return res.status(404).send({
            message: error.details[0].message,
            status: "Failed",
        });
    }
    let getChildCare = yield user_account_model_1.default.findOne({ email: req.body.email });
    if (getChildCare) {
        return res.status(404).send({ message: "user with this email already exist" });
    }
    let child_care_payload = lodash_1.default.pick(req.body, ["fullname", "email", "password"]);
    let user = new user_account_model_1.default(child_care_payload);
    let _salt = yield bcryptjs_1.default.genSalt(10);
    let _hash = yield bcryptjs_1.default.hash(user.password, _salt);
    user.password = _hash;
    let response = yield user.save();
    if (!response) {
        return res.status(500).send({ message: "couldn't save file to database" });
    }
    let removeOtp = yield otp_model_1.default.deleteMany({ owner: user.id });
    if (!removeOtp) {
        res.status(500).send({ message: "Internal Server Error" });
    }
    yield (0, sendOtp_1.default)(req.body.email, user._id);
    return res.send({
        message: lodash_1.default.pick(response, ["fullname", "email", "_id", "is_verified"]),
        status: " verification email sent succesfully"
    });
}));
exports.default = router;

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
const joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
const childcare_signup_model_1 = __importDefault(require("../models/childcare-signup-model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
const validateUserPayload = (userPayload) => {
    let passwordOption = {
        min: 10,
        max: 20,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1
    };
    const validation = joi_1.default.object({
        email: joi_1.default.string().required().min(5).max(255).email(),
        password: (0, joi_password_complexity_1.default)(passwordOption).required().min(5).max(30)
    });
    return validation.validate(userPayload);
};
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = validateUserPayload(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message, status: "Failed" });
    }
    let child_care = yield childcare_signup_model_1.default.findOne({ email: req.body.email });
    if (!child_care) {
        return res.status(404).send({ message: "child care with the specified email doesn't exist" });
    }
    let isPasswordEqual = yield bcryptjs_1.default.compare(req.body.password, child_care.password);
    if (!isPasswordEqual) {
        return res.status(404).send({ message: "Invalid email or Password" });
    }
    res.send(child_care.generateAuthToken);
    // res.send("")
}));
exports.default = router;
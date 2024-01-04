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
const lodash_1 = __importDefault(require("lodash"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
const validate_signup_payload = (payload) => {
    let passwordOption = {
        min: 10,
        max: 20,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1
    };
    let validation = joi_1.default.object({
        fullname: joi_1.default.string().required().max(25).min(5),
        email: joi_1.default.string().required().min(5).max(255).email(),
        password: (0, joi_password_complexity_1.default)(passwordOption)
    });
    return validation.validate(payload);
};
router.post("/daycare", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = validate_signup_payload(req.body);
    if (error) {
        return res.status(404).send({
            message: error.details[0].message,
            status: "Failed",
        });
    }
    let child_care_payload = lodash_1.default.pick(req.body, ["fullname", "email", "password"]);
    let child_care = new childcare_signup_model_1.default(child_care_payload);
    let _salt = yield bcryptjs_1.default.genSalt(10);
    let _hash = yield bcryptjs_1.default.hash(child_care.password, _salt);
    child_care.password = _hash;
    let response = yield child_care.save();
    if (response) {
        return res.send({
            message: lodash_1.default.pick(response, ["fullname", "email"]),
            status: "Succesfull"
        });
    }
    return res.status(404).send({ message: "couldn't save file to database" });
}));
exports.default = router;

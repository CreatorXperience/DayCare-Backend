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
const user_account_model_1 = __importDefault(require("../models/user-account-model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const lodash_1 = __importDefault(require("lodash"));
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
        return res.status(404).send({ message: error.details[0].message, status: "failed" });
    }
    let user = yield user_account_model_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send({ message: "user with the specified email doesn't exist", status: "failed" });
    }
    let isPasswordEqual = yield bcryptjs_1.default.compare(req.body.password, user.password);
    if (!isPasswordEqual) {
        return res.status(404).send({ message: "Invalid email or Password" });
    }
    let token = user.generateAuthToken();
    let responsePaylaod = { message: lodash_1.default.pick(user, ["_id", "is_verified", "day_care_owner", "favorite", "email"]), status: "successfull" };
    res.header("Access-Control-Allow-Headers", "Origin, authorization, X-Requested-With, Content-Type, Accept")
        .header("Access-Control-Allow-Methods", "GET, UPDATE, DELETE, POST, PATCH")
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Expose-Headers", "*")
        .setHeader("authorization", token).send(responsePaylaod);
}));
exports.default = router;

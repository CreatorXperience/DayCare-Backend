"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const router = express_1.default.Router();
const validate_signup_payload = (payload) => {
    let validation = joi_1.default.object({
        fullname: joi_1.default.string().required().max(25).min(5),
        email: joi_1.default.string().required().min(5).max(255).email(),
        password: joi_1.default.string().required().min(5).max(10)
    });
    return validation.validate(payload);
};
router.post("/", (req, res) => {
    let { parent } = req.query;
    if (!parent) {
        return res.status(404).send({
            message: "Query not provided",
            status: "Failed"
        });
    }
    let { error } = validate_signup_payload(req.body);
    if (error) {
        return res.status(404).send({
            message: error.details[0].message,
            status: "Failed",
        });
    }
    // let  user = 
});
exports.default = router;

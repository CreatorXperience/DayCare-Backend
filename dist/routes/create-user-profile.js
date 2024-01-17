"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const router = express_1.default.Router();
const schemaValidation = (payload) => {
    let schema = joi_1.default.object({
        name: joi_1.default.string().required().min(5).max(25),
        children_name: joi_1.default.string().required().min(5).max(25),
        gender: joi_1.default.string().required(),
        age: joi_1.default.number().required(),
        drop: joi_1.default.string().required(),
        take: joi_1.default.string().required(),
        role: joi_1.default.string().required()
    });
    return schema.validate(payload);
};
router.post("/", (req, res) => {
    let { error } = schemaValidation(req.body);
    if (error) {
        return res.status(404).send({ message: "Bad Payload" });
    }
});
exports.default = router;

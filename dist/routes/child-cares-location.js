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
const child_care_profile_1 = __importDefault(require("../models/child-care-profile"));
const joi_1 = __importDefault(require("joi"));
const router = express_1.default.Router();
const validation = (payload) => {
    let schema = joi_1.default.object({
        long: joi_1.default.number().required(),
        lat: joi_1.default.number().required()
    });
    return schema.validate(payload);
};
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = validation(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let child_care = yield child_care_profile_1.default.findOne({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [req.body.long, req.body.lat] } } } });
    if (!child_care) {
        return res.status(404).send({ message: "No child care is available at the specified location" });
    }
    res.send(child_care);
}));
exports.default = router;

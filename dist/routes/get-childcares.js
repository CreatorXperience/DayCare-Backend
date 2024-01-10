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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const validation = (payload) => {
    let schema = joi_1.default.object({
        long: joi_1.default.number().required(),
        lat: joi_1.default.number().required()
    });
    return schema.validate(payload);
};
const filterChildCareValidation = (payload) => {
    let schema = joi_1.default.object({
        sortby: joi_1.default.string().required(),
        location: joi_1.default.string().required(),
        maxp: joi_1.default.number().required(),
        minp: joi_1.default.number().required()
    });
    return schema.validate(payload);
};
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = validation(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let child_care = yield child_care_profile_1.default.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [req.body.long, req.body.lat] } } } });
    if (!child_care) {
        return res.status(404).send({ message: "No child care is available at the specified location" });
    }
    res.send(child_care);
}));
router.get("/filter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = filterChildCareValidation(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let [city, country] = req.body.location.split(",");
    // console.log(city,country)
    let get_location = yield axios_1.default.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`, {
        headers: {
            "X-Api-Key": process.env.API_KEY
        }
    });
    if (!get_location.data) {
        return res.status(500).send({ message: "error occured, couldn't get location" });
    }
    res.send(get_location.data);
}));
exports.default = router;

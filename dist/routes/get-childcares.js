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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const get_childcare_validation_1 = require("../utils/childcares/get-childcare-validation");
const profile_middleware_1 = __importDefault(require("../middlewares/profile-middleware"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = (0, get_childcare_validation_1.locateUserValidation)(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let child_care = yield child_care_profile_1.default.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [req.body.long, req.body.lat] } } } });
    if (!child_care) {
        return res.status(404).send({ message: "No child care is available at the specified location" });
    }
    res.send(child_care);
}));
router.post("/filter", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = (0, get_childcare_validation_1.filterChildCareValidation)(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let [city, country] = req.body.location.split(",");
    let get_location = yield axios_1.default.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`, {
        headers: {
            "X-Api-Key": process.env.API_KEY
        }
    });
    let location_data = get_location.data;
    if (!location_data) {
        return res.status(500).send({ message: "error occured, couldn't get location" });
    }
    let child_care = yield child_care_profile_1.default.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [location_data[0].longitude, location_data[0].latitude] } } }, amount: { $lt: req.body.maxp, $gt: req.body.minp } });
    if (!child_care) {
        return res.status(404).send({ message: "Couldn't get childcares at the specified location" });
    }
    res.send(child_care);
}));
exports.default = router;

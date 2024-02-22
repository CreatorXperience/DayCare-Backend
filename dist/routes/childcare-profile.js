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
const child_care_profile_1 = require("../models/child-care-profile");
const profile_middleware_1 = __importDefault(require("../middlewares/profile-middleware"));
const validation_1 = require("../utils/childcares/validation");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_account_model_1 = __importDefault(require("../models/user-account-model"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let requestPayload = Object.assign(Object.assign({}, req.body), { userId: req.user });
    let { error } = (0, validation_1.validation)(requestPayload);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let getProfile = yield child_care_profile_1.child_care_model.findOne({ userId: requestPayload.userId });
    if (getProfile) {
        return res.send(getProfile);
    }
    let [city, country] = requestPayload.location.split(",");
    let get_location = yield axios_1.default.get(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`, {
        headers: {
            "X-Api-Key": process.env.API_KEY
        }
    });
    let location_data = get_location.data;
    if (!location_data) {
        return res.status(500).send({ message: "error occured, couldn't get location" });
    }
    requestPayload.location = { type: "Point", coordinates: [location_data[0].longitude, location_data[0].latitude] };
    let newProfile = new child_care_profile_1.child_care_model(requestPayload);
    let saved = yield newProfile.save();
    let user = yield user_account_model_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(req.user) }, { $set: { day_care_owner: true } });
    if (!saved && !user) {
        return res.status(404).send({ message: "couldn't save profile to database", status: "successfull" });
    }
    return res.send(saved);
}));
exports.default = router;

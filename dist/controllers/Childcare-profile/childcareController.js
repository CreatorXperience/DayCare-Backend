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
exports.filterChildcare = exports.getChildCares = exports.createChildCareProfile = void 0;
const schema_1 = __importDefault(require("./schema"));
const axios_1 = __importDefault(require("axios"));
const child_care_profile_1 = require("../../models/child-care-profile");
const get_childcare_validation_1 = require("../../utils/childcares/get-childcare-validation");
const createChildCareProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let requestPayload = Object.assign(Object.assign({}, req.body), { userId: req.user });
    let { error } = (0, schema_1.default)(requestPayload);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
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
    if (!saved) {
        return res.status(404).send({ message: "couldn't save profile to database", status: "successfull" });
    }
    return res.send(saved);
});
exports.createChildCareProfile = createChildCareProfile;
const getChildCares = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { long, lat } = req.query;
    if (long && lat) {
        let child_care = yield child_care_profile_1.child_care_model.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [+long, +lat] } } } });
        if (!child_care) {
            return res.status(404).send({ message: "No child care is available at the specified location" });
        }
        res.send(child_care);
    }
    res.status(404).send({ message: "Long or Lat no provided" });
});
exports.getChildCares = getChildCares;
const filterChildcare = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    let child_care = yield child_care_profile_1.child_care_model.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [location_data[0].longitude, location_data[0].latitude] } } }, amount: { $lt: req.body.maxp, $gt: req.body.minp } });
    if (!child_care) {
        return res.status(404).send({ message: "Couldn't get childcares at the specified location" });
    }
    res.send(child_care);
});
exports.filterChildcare = filterChildcare;

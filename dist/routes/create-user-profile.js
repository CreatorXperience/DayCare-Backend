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
const profile_middleware_1 = __importDefault(require("../middlewares/profile-middleware"));
const userprofile_1 = __importDefault(require("../models/userprofile"));
const userProfileValidation_1 = require("../utils/userProfile/userProfileValidation");
const router = express_1.default.Router();
router.post("/", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = (0, userProfileValidation_1.schemaValidation)(req.body);
    if (error) {
        return res.status(404).send({ message: "Bad Payload" });
    }
    const userProfile = new userprofile_1.default(req.body);
    let saved = yield userProfile.save();
    if (!saved) {
        return res.status(404).send({ message: "error occurred while saving user" });
    }
    res.send(saved);
}));
router.get("/:id", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let getProfile = yield userprofile_1.default.findOne({ user: id });
    if (!getProfile) {
        return res.status(404).send({ message: "Profile not found" });
    }
    return res.send(getProfile);
}));
router.patch("/:id", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { error } = (0, userProfileValidation_1.profileSchemaValidation)(req.body);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let update = yield userprofile_1.default.updateOne({ user: id }, { $set: Object.assign({}, req.body) });
    if (!update) {
        return res.status(500).send({ message: "Couldn't update profile}" });
    }
    return res.send(update);
}));
exports.default = router;

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
const profile_middleware_1 = __importDefault(require("../middlewares/profile-middleware"));
const validation_1 = __importDefault(require("../utils/childcares/validation"));
const router = express_1.default.Router();
router.post("/", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let requestPayload = Object.assign(Object.assign({}, req.body), { userId: req.user });
    let { error } = (0, validation_1.default)(requestPayload);
    if (error) {
        return res.status(404).send({ message: error.details[0].message });
    }
    let newProfile = new child_care_profile_1.default(req.body);
    let saved = yield newProfile.save();
    if (!saved) {
        return res.status(404).send({ message: "couldn't save profile to database", status: "successfull" });
    }
    return res.send(saved);
}));
exports.default = router;

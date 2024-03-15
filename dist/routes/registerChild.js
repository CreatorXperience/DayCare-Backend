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
const mongoose_1 = __importDefault(require("mongoose"));
const profile_middleware_1 = __importDefault(require("../middlewares/profile-middleware"));
const registeredDaycares_1 = __importDefault(require("../models/registeredDaycares"));
const router = express_1.default.Router();
router.post("/:daycareId", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { daycareId } = req.params;
    if (!mongoose_1.default.isValidObjectId(daycareId) && !mongoose_1.default.isValidObjectId(req.user)) {
        return res.status(404).send({ message: "Invalid Object Id" });
    }
    let existingRegistration = yield registeredDaycares_1.default.findOne({ registered: { $all: [req.user, daycareId] } });
    if (existingRegistration) {
        return res.send(existingRegistration);
    }
    let newRegistration = new registeredDaycares_1.default({ registered: [req.user, daycareId] });
    let saved = yield newRegistration.save();
    if (!saved) {
        return res.status(500).send({ message: "couldn't register to the daycare" });
    }
    res.send(saved);
}));
router.get("/registeredDaycares", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = req.user;
    let user = yield registeredDaycares_1.default.findOne({ registered: { $in: [userId] } });
    if (!user) {
        return res.status(404).send({ message: "user is not registered" });
    }
    res.send(user);
}));
router.get("/registered/:daycareId", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { daycareId } = req.params;
    if (!daycareId) {
        return res.status(404).send({ message: "daycare id not provided" });
    }
    let registered = yield registeredDaycares_1.default.findOne({ registered: { $all: [req.user, daycareId] } });
    if (!registered) {
        return res.status(404).send({ message: "Not Registered" });
    }
    res.send(registered);
}));
exports.default = router;

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
const sendOtp_1 = __importDefault(require("../utils/signup/sendOtp"));
const mongoose_1 = __importDefault(require("mongoose"));
const otp_model_1 = __importDefault(require("../models/otp-model"));
const router = express_1.default.Router();
router.get("/:email/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, id } = req.params;
    if (!email || email === "undefined" || !mongoose_1.default.isValidObjectId(id)) {
        return res.status(404).send({ message: "Invalid email provided" });
    }
    let userId = new mongoose_1.default.Types.ObjectId(id);
    let removeOtp = yield otp_model_1.default.deleteMany({ owner: id });
    if (!removeOtp) {
        res.status(500).send({ message: "could not remove previous otp" });
    }
    yield (0, sendOtp_1.default)(email, userId);
}));
exports.default = router;

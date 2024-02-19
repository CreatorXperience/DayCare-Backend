"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const registeredDaycaresSchema = new mongoose_1.default.Schema({
    registered: [String]
});
const RegisteredDaycareModel = mongoose_1.default.model("registered", registeredDaycaresSchema);
exports.default = RegisteredDaycareModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const child_care_account_schema = new mongoose_1.default.Schema({
    fullname: { type: String, required: true, maxLength: 25, minLength: 5 },
    email: { type: String, required: true, minLength: 5, maxLength: 255, unique: true },
    password: { type: String, required: true, maxLength: 255 }
});
const child_care_login_model = mongoose_1.default.model("child-care-accounts", child_care_account_schema);
exports.default = child_care_login_model;

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
exports.createUserProfile = void 0;
const schema_1 = __importDefault(require("./schema"));
const userprofile_1 = __importDefault(require("../../models/userprofile"));
const createUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { error } = (0, schema_1.default)(req.body);
    if (error) {
        return res.status(404).send({ message: "Bad Payload" });
    }
    const userProfile = new userprofile_1.default(req.body);
    let saved = yield userProfile.save();
    if (!saved) {
        return res.status(404).send({ message: "error occurred while saving user" });
    }
    res.send(saved);
});
exports.createUserProfile = createUserProfile;

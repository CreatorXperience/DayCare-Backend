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
const user_account_model_1 = __importDefault(require("../models/user-account-model"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
router.post("/:id", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let { id } = req.params;
    let get_childcare = yield child_care_profile_1.child_care_model.findById(id);
    if (!get_childcare) {
        return res.status(404).send({ message: "no childcares with these id" });
    }
    let updateUser = yield user_account_model_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(user) }, { $push: { favorite: get_childcare } });
    if (!updateUser) {
        return res.status(500).send({ message: "Internal Serval error" });
    }
    return res.send({ message: "added to user's favorite" });
}));
router.delete("/:id", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let { id } = req.params;
    let get_childcare = yield child_care_profile_1.child_care_model.findById(id);
    if (!get_childcare) {
        return res.status(404).send({ message: "no childcares with these id" });
    }
    let removeUser = yield user_account_model_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(user) }, { $pull: { favorite: { _id: id } } }, { safe: true, multi: false });
    if (!removeUser) {
        return res.status(500).send({ message: "Couldn't favorite from user" });
    }
    return res.send(removeUser);
}));
exports.default = router;

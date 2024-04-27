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
const user_image_1 = __importDefault(require("../models/user-image"));
const profile_middleware_1 = __importDefault(require("../middlewares/profile-middleware"));
const router = express_1.default.Router();
router.get("/:id", profile_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    const getImage = yield user_image_1.default.findOne({ owner: id });
    if (!getImage) {
        return res.status(404).send({ message: "image not found" });
    }
    return res.send({ imageId: getImage.imageString });
}));
exports.default = router;

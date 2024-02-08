"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_middleware_1 = __importDefault(require("../middlewares/profile-middleware"));
const dotenv_1 = __importDefault(require("dotenv"));
const childcareController_1 = require("../controllers/Childcare-profile/childcareController");
dotenv_1.default.config();
const router = express_1.default.Router();
router.get("/getChildcares", profile_middleware_1.default, childcareController_1.getChildCares);
router.post("/create-childcare", profile_middleware_1.default, childcareController_1.createChildCareProfile);
router.post("/filter-childcare", profile_middleware_1.default, childcareController_1.filterChildcare);
exports.default = router;

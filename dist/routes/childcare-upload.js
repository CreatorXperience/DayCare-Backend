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
const stream_1 = require("stream");
const child_care_image_1 = __importDefault(require("../models/child-care-image"));
const __1 = require("..");
const router = express_1.default.Router();
let handleUploadChildCareProfile = (upload, bucket) => {
    __1.app.post("/childcare-upload", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { owner } = req.query;
        if (!owner) {
            return res.status(404).send({ message: "owner params is missing" });
        }
        let file = req.file;
        if (!file) {
            return res.status(404).send({ message: "file not attached" });
        }
        let { fieldname, originalname, mimetype, buffer, size } = file;
        let newProfileImage = new child_care_image_1.default({
            filename: originalname,
            size: size,
            type: mimetype,
            length: buffer.length
        });
        let read = new stream_1.Readable();
        read.push(buffer);
        read.push(null);
        let uploadStream = bucket.openUploadStream(fieldname);
        let pipeData = yield new Promise((resolve, reject) => {
            read.pipe(uploadStream).on("finish", () => {
                resolve("Data piped from readable");
            }).on("error", () => {
                reject("error occured while reading data");
            });
        });
        newProfileImage.imageString = uploadStream.id.toString();
        newProfileImage.owner = owner;
        let savedImage = yield newProfileImage.save();
        if (!savedImage) {
            return res.status(404).send({ message: "couldn't save image" });
        }
        res.send({ message: "image successfully uploaded", id: uploadStream.id });
    }));
    __1.app.get("/childcare-upload/:id", (req, res) => {
        let { id } = req.params;
        let downloadStream = bucket.openDownloadStream(new mongoose_1.default.Types.ObjectId(id));
        downloadStream.on("file", (file) => {
            res.set("Content-Type", file.type);
        });
        downloadStream.pipe(res);
    });
};
exports.default = handleUploadChildCareProfile;

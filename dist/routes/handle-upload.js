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
const mongoose_1 = __importDefault(require("mongoose"));
const stream_1 = require("stream");
const profile_middleware_1 = __importDefault(require("../middlewares/profile-middleware"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
let UploadImageRoutes = (options) => {
    let { collection, storage, bucket, path } = options;
    router.post(path, [profile_middleware_1.default, storage.single("file")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let user = req.user;
        let file = req.file;
        if (!file) {
            return res.status(404).send({ message: "file not attached" });
        }
        let imageId = "";
        try {
            let exsitingImage = yield collection.findOne({ owner: user });
            if (exsitingImage) {
                imageId = exsitingImage.imageString;
                bucket.delete(new mongoose_1.default.Types.ObjectId(imageId));
                yield collection.deleteOne({ owner: user });
            }
        }
        catch (e) {
            console.log(e);
        }
        let { fieldname, originalname, mimetype, buffer, size } = file;
        let newProfileImage = new collection({
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
        newProfileImage.owner = user;
        let savedImage = yield newProfileImage.save();
        if (imageId) {
            yield collection.updateOne({ image: imageId }, { $set: { image: uploadStream.id.toString() } });
        }
        else {
            yield collection.updateOne({ userId: user }, { $set: { image: uploadStream.id.toString() } });
        }
        if (!savedImage) {
            return res.status(404).send({ message: "couldn't save image" });
        }
        res.send({ message: "image successfully uploaded", id: uploadStream.id });
    }));
    router.get(`${path}/:id`, (req, res) => {
        let { id } = req.params;
        if (!id || id === "undefined" || id === undefined || !mongoose_1.default.isValidObjectId(id)) {
            return res.status(404).send({ message: "Invalid" });
        }
        let downloadStream = bucket.openDownloadStream(new mongoose_1.default.Types.ObjectId(id));
        downloadStream.on("file", (file) => {
            res.set("Content-Type", file.type);
        }).on("error", () => {
            return res.status(404).send({ message: "file not found" });
        });
        downloadStream.pipe(res);
    });
    return router;
};
exports.default = UploadImageRoutes;

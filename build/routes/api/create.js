"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/tmp/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // Unique file name
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
    }
};
const upload = multer_1.default({ storage: storage, fileFilter: fileFilter });
const router = express_1.default.Router();
/**
 * @route POST api/create
 * @desc Upload a tree
 * @access Private
 * */
router.post('/', passport_1.default.authenticate('jwt', { session: false }), upload.array('images'), (req, res) => {
    let promises = [];
    req.files.forEach((f) => {
        promises.push(fs_extra_1.default.move('./uploads/tmp/' + f.filename, `./uploads/${req.user.username}/` + f.filename));
    });
    Promise.all(promises)
        .then((result) => {
        res.status(200).send(Object.assign(Object.assign({}, req.body), { files: req.files }));
    })
        .catch((err) => {
        res.status(400).end();
    });
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
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
router.post('/', upload.array('images'), 
//   passport.authenticate('jwt', { session: false }),
(req, res) => {
    res.status(200).send(Object.assign(Object.assign({}, req.body), { files: req.files }));
});
exports.default = router;

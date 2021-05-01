"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const Tree_1 = require("../../models/Tree");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${process.env.UPLOAD_BASE_DIR}/uploads/tmp/`);
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
// If there are issues here, it is likely due to permissions on the files in the /efs/ directory on AWS
/**
 * @route POST api/create
 * @desc Upload a tree
 * @access Private
 * */
router.post('/', passport_1.default.authenticate('jwt', { session: false }), upload.array('images'), (req, res) => {
    // console.log(`${process.env.UPLOAD_BASE_DIR}/uploads/tmp/`);
    let promises = [];
    let photos = [];
    req.files.forEach((f) => {
        // TODO: Read EXIF data from photo and add dateFound and location here.
        photos.push({
            uri: `${process.env.UPLOAD_BASE_DIR}/uploads/${req.user.username}/${f.filename}`
        });
        promises.push(fs_extra_1.default.move(`${process.env.UPLOAD_BASE_DIR}/uploads/tmp/${f.filename}`, `${process.env.UPLOAD_BASE_DIR}/uploads/${req.user.username}/${f.filename}`));
    });
    // const body: TreeDocument & { files: any[] } = req.body;
    const body = JSON.parse(req.body.data);
    // console.log(body);
    body.photos = photos;
    // If there are issues then this is the likely suspect. The data is sent as form-data --> I may need to convert it to blobs and send as application/json formats but
    // I don't know if I want to commit to that just yet
    // body.characteristics = JSON.parse(body.characteristics as string);
    Promise.all(promises)
        .then(() => {
        // console.log(body);
        return Tree_1.Tree.findOne({ latinName: body.latinName }).then((tree) => {
            if (tree) {
                res.status(400).json({
                    errors: [
                        {
                            location: 'body',
                            msg: `Latin Name ${body.latinName}`,
                            param: 'latinName'
                        }
                    ]
                });
            }
            else {
                return Tree_1.Tree.create(body).then((tree) => {
                    // console.log(tree);
                    res.status(200).json(tree);
                });
            }
        });
    })
        .catch((err) => {
        res.status(400).json({
            errors: [
                {
                    location: 'body',
                    msg: `${err.toString()}`,
                    param: 'failedToSave'
                }
            ]
        });
    });
});
exports.default = router;

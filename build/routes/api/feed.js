"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const passport_1 = __importDefault(require("passport"));
const Tree_1 = require("../../models/Tree");
const router = express_1.default.Router();
class FeedData {
    static getImage() {
        const thumbnails = [
            'https://ichef.bbci.co.uk/images/ic/960x960/p08634k6.jpg',
            'https://www.thespruce.com/thmb/mh5-9gjw1Tzp5X7MHCin7znCunU=/1414x1414/smart/filters:no_upscale()/GettyImages-200443720-0011-59a2f08fd088c000111be4f4.jpg'
        ];
        let retVal = new Tree_1.Image();
        retVal.uri = thumbnails[this.r(2)];
        return retVal;
    }
    static getCharacteristics() {
        const strings = [
            'Awesome looking tree',
            'Seriously Super Stuff',
            'I wish I was at home',
            'Poor Covid Joe',
            'Okay, that was pretty cool.',
            'Okay, that was pretty rad.',
            'Okay, that was pretty awesome.',
            'Okay, that was pretty lame.'
        ];
        let retVal = new Tree_1.Characteristics();
        retVal.type = strings[this.r(8)];
        retVal.matureHeight = strings[this.r(8)];
        retVal.matureSpread = strings[this.r(8)];
        retVal.form = strings[this.r(8)];
        retVal.leafArrangement = strings[this.r(8)];
        retVal.budArrangement = strings[this.r(8)];
        retVal.flowersFruitCones = strings[this.r(8)];
        retVal.soilSunRequirements = strings[this.r(8)];
        retVal.use = strings[this.r(8)];
        retVal.limitations = strings[this.r(8)];
        return retVal;
    }
    static getBioticDistrubances() {
        const strings = [
            'Awesome looking tree',
            'Seriously Super Stuff',
            'I wish I was at home',
            'Poor Covid Joe',
            'Okay, that was pretty cool.',
            'Okay, that was pretty rad.',
            'Okay, that was pretty awesome.',
            'Okay, that was pretty lame.'
        ];
        let retVal = new Tree_1.BioticDisturbances();
        retVal.signs = strings[this.r(8)];
        retVal.symptoms = strings[this.r(8)];
        retVal.managmentStrategy = strings[this.r(8)];
        return retVal;
    }
    static getFeedData() {
        let retVal = Object.assign(new Tree_1.TreeDocument(), { _id: `${this._id++}` });
        retVal.latinName = `Latin Name${this._id}`;
        retVal.familyName = 'Family Name';
        retVal.commonName = 'Common Name';
        retVal.keyIdFeatures = ['super awesome', 'such wow!', 'much leaves'];
        retVal.characteristics = this.getCharacteristics();
        retVal.photos = [1, 2, 3, 4, 5].map((v) => this.getImage());
        retVal.bioticDisturbances = this.getBioticDistrubances();
        retVal.notes =
            'Now this is a super cool tree. Like super duper cool. 10/10 would tree again.';
        return retVal;
    }
}
FeedData._id = 1;
FeedData.r = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};
/**
 * @route GET api/feed/username
 * @desc Updates a users information
 * @access Private
 * */
router.get('/:username', passport_1.default.authenticate('jwt', { session: false }), (req, res) => {
    User_1.User.findOne({ email: req.user.email })
        .then((user) => {
        if (!user) {
            throw Error('User not found');
        }
        return Tree_1.Tree.find({ user: user.id });
    })
        .then((trees) => {
        // let dummyData: Array<FeedData> = [];
        // for (let i = 0; i < 10; i++) {
        //   dummyData.push(FeedData.getFeedData());
        // }
        // const next = `http://${req.headers.host}/api/feed/${
        //   req.params.username
        // }?page=${req.query.page ? parseInt(req.query.page as string) + 1 : 2}`;
        // res.json({ user: user, results: dummyData, next: next });
        const next = `http://${req.headers.host}/api/feed/${req.params.username}?page=${req.query.page ? parseInt(req.query.page) + 1 : 2}`;
        res.json({ results: trees, next: next });
    })
        .catch((err) => {
        res.status(400).json({
            errors: [
                {
                    location: 'body',
                    msg: err.toString(),
                    param: 'email'
                }
            ]
        });
    });
});
/**
 * @route GET api/feed/:username/:latinName
 * @desc Updates a users information
 * @access Private
 * */
router.get('/:username/:latinName', passport_1.default.authenticate('jwt', { session: false }), (req, res) => {
    let { latinName } = req.params;
    latinName = decodeURI(latinName);
    User_1.User.findOne({ email: req.user.email })
        .then((user) => {
        if (!user) {
            throw Error('User not found');
        }
        // get tree detail
    })
        .then((user) => {
        res.json({
            user: user,
            results: FeedData.getFeedData(),
            latinName: latinName
        });
    })
        .catch((err) => {
        res.status(400).json({
            errors: [
                {
                    location: 'body',
                    msg: err.toString(),
                    param: 'email'
                }
            ]
        });
    });
});
exports.default = router;

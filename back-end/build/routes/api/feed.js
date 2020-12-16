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
            'https://www.thespruce.com/thmb/mh5-9gjw1Tzp5X7MHCin7znCunU=/1414x1414/smart/filters:no_upscale()/GettyImages-200443720-0011-59a2f08fd088c000111be4f4.jpg',
            'https://static.wikia.nocookie.net/animalcrossing/images/c/c7/NH-Tree.png/revision/latest/top-crop/width/220/height/220?cb=20200415131758',
            'https://www.thebalancesmb.com/thmb/xjqT9R5rB_cU86QGT5ImpH-c9lk=/300x200/filters:no_upscale():max_bytes(150000):strip_icc():saturation(0.2):brightness(10):contrast(5):format(webp)/ResponsibleOverhangingTreeBranches-Tomekbudujedomek-Moment-GettyImages-5b0d6fa043a1030036e66122.jpg'
        ];
        let retVal = new Tree_1.Image();
        retVal.uri = thumbnails[this.r(4)];
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
        retVal.latinName = `latinName${this._id}`;
        retVal.familyName = 'familyName';
        retVal.commonName = 'commonName';
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
 * @route GET api/feed
 * @desc Updates a users information
 * @access Private
 * */
router.get('/:username', passport_1.default.authenticate('jwt', { session: false }), (req, res) => {
    User_1.User.findOne({ email: req.user.email })
        .then((user) => {
        if (!user) {
            throw Error('User not found');
        }
    })
        .then((user) => {
        let dummyData = [];
        for (let i = 0; i < 10; i++) {
            dummyData.push(FeedData.getFeedData());
        }
        const next = `${req.headers.host}/feed?page=2`;
        res.json({ user: user, results: dummyData, next: next });
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
 * @route GET api/feed/:latinName
 * @desc Updates a users information
 * @access Private
 * */
router.get('/:username/:latinName', passport_1.default.authenticate('jwt', { session: false }), (req, res) => {
    const { latinName } = req.params;
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

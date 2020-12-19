import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import express from 'express';
import { User, UserDocument, MutableUserProperties } from '../../models/User';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { SESSION_SECRET } from '../../util/secrets';
import * as crypto from 'crypto';
import passport from 'passport';
import {
  Tree,
  TreeDocument,
  Image,
  Characteristics,
  BioticDisturbances
} from '../../models/Tree';

const router = express.Router();

class FeedData {
  private static _id: number = 1;

  private static r = (max: number) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  private static getImage(): Image {
    const thumbnails = [
      'https://ichef.bbci.co.uk/images/ic/960x960/p08634k6.jpg',
      'https://www.thespruce.com/thmb/mh5-9gjw1Tzp5X7MHCin7znCunU=/1414x1414/smart/filters:no_upscale()/GettyImages-200443720-0011-59a2f08fd088c000111be4f4.jpg'
    ];

    let retVal: Image = new Image();
    retVal.uri = thumbnails[this.r(2)];
    return retVal;
  }

  private static getCharacteristics(): Characteristics {
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
    let retVal = new Characteristics();

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

  private static getBioticDistrubances(): BioticDisturbances {
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
    let retVal = new BioticDisturbances();

    retVal.signs = strings[this.r(8)];
    retVal.symptoms = strings[this.r(8)];
    retVal.managmentStrategy = strings[this.r(8)];
    return retVal;
  }

  public static getFeedData(): TreeDocument & { _id: string } {
    let retVal: TreeDocument & {
      _id: string;
    } = Object.assign(new TreeDocument(), { _id: `${this._id++}` });

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

/**
 * @route GET api/feed
 * @desc Updates a users information
 * @access Private
 * */
router.get(
  '/:username',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    User.findOne({ email: (req.user as UserDocument).email })
      .then((user) => {
        if (!user) {
          throw Error('User not found');
        }
      })
      .then((user) => {
        let dummyData: Array<FeedData> = [];
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
  }
);

/**
 * @route GET api/feed/:latinName
 * @desc Updates a users information
 * @access Private
 * */
router.get(
  '/:username/:latinName',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    let { latinName } = req.params;
    latinName = decodeURI(latinName);

    User.findOne({ email: (req.user as UserDocument).email })
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
  }
);

export default router;

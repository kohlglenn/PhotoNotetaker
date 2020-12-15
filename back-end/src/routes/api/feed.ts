import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import express from 'express';
import { User, UserDocument, MutableUserProperties } from '../../models/User';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { SESSION_SECRET } from '../../util/secrets';
import * as crypto from 'crypto';
import passport from 'passport';

const router = express.Router();

class FeedData {
  thumbnail!: string;
  title!: string;
  description!: string;
  id!: string;
  static _id: number = 1;

  public static getFeedData() {
    const thumbnails = [
      'https://ichef.bbci.co.uk/images/ic/960x960/p08634k6.jpg',
      'https://www.thespruce.com/thmb/mh5-9gjw1Tzp5X7MHCin7znCunU=/1414x1414/smart/filters:no_upscale()/GettyImages-200443720-0011-59a2f08fd088c000111be4f4.jpg',
      'https://static.wikia.nocookie.net/animalcrossing/images/c/c7/NH-Tree.png/revision/latest/top-crop/width/220/height/220?cb=20200415131758',
      'https://www.thebalancesmb.com/thmb/xjqT9R5rB_cU86QGT5ImpH-c9lk=/300x200/filters:no_upscale():max_bytes(150000):strip_icc():saturation(0.2):brightness(10):contrast(5):format(webp)/ResponsibleOverhangingTreeBranches-Tomekbudujedomek-Moment-GettyImages-5b0d6fa043a1030036e66122.jpg'
    ];
    const titles = [
      'Awesome looking tree',
      'Seriously Super Stuff',
      'I wish I was at home',
      'Poor Covid Joe'
    ];
    const descriptions = [
      'Okay, that was pretty cool.',
      'Okay, that was pretty rad.',
      'Okay, that was pretty awesome.',
      'Okay, that was pretty lame.'
    ];

    const r = (max: number) => {
      return Math.floor(Math.random() * Math.floor(max));
    };

    let retVal: FeedData = {
      thumbnail: thumbnails[r(4)],
      title: titles[r(4)],
      description: descriptions[r(4)],
      id: `${this._id++}`
    };
    return retVal;
  }
}

/**
 * @route GET api/feed
 * @desc Updates a users information
 * @access Private
 * */
router.get(
  '/',
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

export default router;

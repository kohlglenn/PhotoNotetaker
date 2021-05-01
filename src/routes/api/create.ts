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
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.env.UPLOAD_BASE_DIR}/uploads/tmp/`);
  },

  filename: function (req: any, file: any, cb: any) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = express.Router();

// If there are issues here, it is likely due to permissions on the files in the /efs/ directory on AWS
/**
 * @route POST api/create
 * @desc Upload a tree
 * @access Private
 * */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.array('images'),
  (req: Request, res: Response) => {
    // console.log(`${process.env.UPLOAD_BASE_DIR}/uploads/tmp/`);

    let promises: Promise<void>[] = [];
    let photos: Image[] = [];

    (req.files as any[]).forEach((f) => {
      // TODO: Read EXIF data from photo and add dateFound and location here.
      photos.push({
        uri: `${process.env.UPLOAD_BASE_DIR}/uploads/${
          (req.user as UserDocument).username
        }/${f.filename}`
      });

      promises.push(
        fs.move(
          `${process.env.UPLOAD_BASE_DIR}/uploads/tmp/${f.filename}`,
          `${process.env.UPLOAD_BASE_DIR}/uploads/${
            (req.user as UserDocument).username
          }/${f.filename}`
        )
      );
    });

    // const body: TreeDocument & { files: any[] } = req.body;
    const body: TreeDocument = JSON.parse(req.body.data);
    // console.log(body);
    body.photos = photos;
    // If there are issues then this is the likely suspect. The data is sent as form-data --> I may need to convert it to blobs and send as application/json formats but
    // I don't know if I want to commit to that just yet
    // body.characteristics = JSON.parse(body.characteristics as string);

    Promise.all(promises)
      .then(() => {
        // console.log(body);
        return Tree.findOne({ latinName: body.latinName }).then((tree) => {
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
          } else {
            return Tree.create(body).then((tree) => {
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
  }
);

export default router;

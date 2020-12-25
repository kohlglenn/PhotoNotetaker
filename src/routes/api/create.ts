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
    cb(null, './uploads/tmp/');
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
    let promises: Promise<void>[] = [];
    req.files.forEach((f) => {
      promises.push(
        fs.move(
          './uploads/tmp/' + f.filename,
          `./uploads/${req.user.username}/` + f.filename
        )
      );
    });
    Promise.all(promises)
      .then((result) => {
        res.status(200).send({ ...req.body, files: req.files });
      })
      .catch((err) => {
        res.status(400).end();
      });
  }
);

export default router;

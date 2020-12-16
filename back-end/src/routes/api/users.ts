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

/**
 * @route POST api/users/signup
 * @desc Creates a new User and adds it to the database
 * @access Public
 * */
router.post(
  '/signup',
  [
    // username must be an email
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 })
  ],
  (req: Request, res: Response) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }]
    })
      .then((user) => {
        if (user) {
          return res.status(400).json({
            errors: [
              {
                location: 'body',
                msg: 'Email or username already exists',
                param: 'email'
              }
            ]
          });
        } else {
          return User.create({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordResetToken: '',
            passwordResetExpires: Date.now()
          }).then((user) => res.json(user));
        }
      })
      .catch((err) => console.log(err));
  }
);

/**
 * @route POST api/users/login
 * @desc Login user and return JWT token
 * @access Public
 * */
router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 5 })],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then((user) => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({
          errors: [
            {
              location: 'body',
              msg: 'Email not found',
              param: 'email'
            }
          ]
        });
      }
      user.comparePassword(password, (err, isMatch) => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            email: user.email,
            username: user.username
          };
          // Sign token
          jwt.sign(
            payload,
            SESSION_SECRET as string,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            }
          );
        } else {
          res.status(400).json({
            errors: [
              {
                location: 'body',
                msg: 'Password is incorrect',
                param: 'password'
              }
            ]
          });
        }
      });
    });
  }
);

/**
 * @route POST api/users/forgot
 * @desc Sends a new forgot password email and generates a new token
 * @access Public
 * */
router.post(
  '/forgot',
  [body('email').isEmail()],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // create random token
    const token = crypto.randomBytes(16).toString('hex');

    // set random token to User with duration of 1 hour
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          throw Error('User not found');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        return user.save();
      })
      .then((user) => {
        // send email to user email
        const transporter = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASSWORD
          }
        });
        const mailOptions = {
          to: user.email,
          from: process.env.SENGRID_SENDER_IDENTITY,
          subject: 'Reset your password on Starter',
          text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${process.env.FRONT_END_URL}/forgot/${user.passwordResetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        return transporter.sendMail(mailOptions).then(() => {
          res.status(200).end();
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

/**
 * @route PATCH api/users/forgot/:token
 * @desc Updates a users password from a reset token
 * @access Public
 * */
router.patch(
  '/forgot/:token',
  [body('email').isEmail(), body('password').isLength({ min: 5 })],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.params;
    const { email, password } = req.body;

    User.findOne({ email: email })
      .then((user) => {
        // res.json(user);
        if (!user) {
          throw Error('User not found');
        }
        if (
          !user.passwordResetExpires ||
          !user.passwordResetToken ||
          user.passwordResetToken !== token ||
          user.passwordResetExpires <= Date.now()
        ) {
          throw Error('Password reset token is invalid');
        }
        user.password = password;
        return user.save();
      })
      .then((user) => res.json(user))
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
 * @route PATCH api/users/update
 * @desc Updates a users information
 * @access Private
 * */
router.patch(
  '/update',
  passport.authenticate('jwt', { session: false }),
  [body('email').isEmail(), body('password').isLength({ min: 5 })],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.findOne({ email: (req.user as UserDocument).email })
      .then((user) => {
        if (!user) {
          throw Error('User not found');
        }

        for (let key in req.body) {
          if (MutableUserProperties.has(key)) {
            (user as any)[key] = req.body[key];
          }
        }
        return user.save();
      })
      .then((user) => res.json(user))
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

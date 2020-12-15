"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const express_validator_1 = require("express-validator");
const secrets_1 = require("../../util/secrets");
const crypto = __importStar(require("crypto"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
/**
 * @route POST api/users/signup
 * @desc Creates a new User and adds it to the database
 * @access Public
 * */
router.post('/signup', [
    // username must be an email
    express_validator_1.body('email').isEmail(),
    // password must be at least 5 chars long
    express_validator_1.body('password').isLength({ min: 5 })
], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User_1.User.findOne({ email: req.body.email })
        .then((user) => {
        if (user) {
            return res.status(400).json({
                errors: [
                    {
                        location: 'body',
                        msg: 'Email already exists',
                        param: 'email'
                    }
                ]
            });
        }
        else {
            return User_1.User.create({
                email: req.body.email,
                password: req.body.password,
                passwordResetToken: '',
                passwordResetExpires: Date.now()
            }).then((user) => res.json(user));
        }
    })
        .catch((err) => console.log(err));
});
/**
 * @route POST api/users/login
 * @desc Login user and return JWT token
 * @access Public
 * */
router.post('/login', [express_validator_1.body('email').isEmail(), express_validator_1.body('password').isLength({ min: 5 })], (req, res) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User_1.User.findOne({ email }).then((user) => {
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
                    name: user.email
                };
                // Sign token
                jsonwebtoken_1.default.sign(payload, secrets_1.SESSION_SECRET, {
                    expiresIn: 31556926 // 1 year in seconds
                }, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                });
            }
            else {
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
});
/**
 * @route POST api/users/forgot
 * @desc Sends a new forgot password email and generates a new token
 * @access Public
 * */
router.post('/forgot', [express_validator_1.body('email').isEmail()], (req, res) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // create random token
    const token = crypto.randomBytes(16).toString('hex');
    // set random token to User with duration of 1 hour
    User_1.User.findOne({ email: req.body.email })
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
        const transporter = nodemailer_1.default.createTransport({
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
});
/**
 * @route PATCH api/users/forgot/:token
 * @desc Updates a users password from a reset token
 * @access Public
 * */
router.patch('/forgot/:token', [express_validator_1.body('email').isEmail(), express_validator_1.body('password').isLength({ min: 5 })], (req, res) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { token } = req.params;
    const { email, password } = req.body;
    User_1.User.findOne({ email: email })
        .then((user) => {
        // res.json(user);
        if (!user) {
            throw Error('User not found');
        }
        if (!user.passwordResetExpires ||
            !user.passwordResetToken ||
            user.passwordResetToken !== token ||
            user.passwordResetExpires <= Date.now()) {
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
});
/**
 * @route PATCH api/users/update
 * @desc Updates a users information
 * @access Private
 * */
router.patch('/update', passport_1.default.authenticate('jwt', { session: false }), [express_validator_1.body('email').isEmail(), express_validator_1.body('password').isLength({ min: 5 })], (req, res) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User_1.User.findOne({ email: req.user.email })
        .then((user) => {
        if (!user) {
            throw Error('User not found');
        }
        for (let key in req.body) {
            if (User_1.MutableUserProperties.has(key)) {
                user[key] = req.body[key];
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
});
exports.default = router;

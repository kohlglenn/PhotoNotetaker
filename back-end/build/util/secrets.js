"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGODB_URI = exports.SESSION_SECRET = exports.ENVIRONMENT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENVIRONMENT = process.env.NODE_ENV;
const prod = exports.ENVIRONMENT === 'production'; // Anything else is treated as 'dev'
exports.SESSION_SECRET = process.env['SESSION_SECRET'];
exports.MONGODB_URI = prod
    ? process.env['MONGODB_URI']
    : process.env['MONGODB_URI_LOCAL'];

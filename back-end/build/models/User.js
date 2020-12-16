"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.MutableUserProperties = exports.UserDocument = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
let UserDocument = class UserDocument {
    comparePassword(candidatePassword, cb) {
        bcrypt_1.default.compare(candidatePassword, this.password, (err, isMatch) => {
            cb(err, isMatch);
        });
    }
};
__decorate([
    typegoose_1.prop({ unique: true }),
    __metadata("design:type", String)
], UserDocument.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ unique: true }),
    __metadata("design:type", String)
], UserDocument.prototype, "username", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], UserDocument.prototype, "password", void 0);
__decorate([
    typegoose_1.prop({ default: '' }),
    __metadata("design:type", String)
], UserDocument.prototype, "passwordResetToken", void 0);
__decorate([
    typegoose_1.prop({ default: Date.now() }),
    __metadata("design:type", Number)
], UserDocument.prototype, "passwordResetExpires", void 0);
UserDocument = __decorate([
    typegoose_1.pre('save', function () {
        const user = this;
        if (user.isModified('password')) {
            return bcrypt_1.default
                .genSalt(10)
                .then((salt) => {
                return bcrypt_1.default.hash(user.password, salt);
            })
                .then((hash) => {
                user.password = hash;
            });
        }
        return Promise.resolve();
    })
], UserDocument);
exports.UserDocument = UserDocument;
// contains a list of properties mutable by the user
exports.MutableUserProperties = new Set(['password']);
exports.User = typegoose_1.getModelForClass(UserDocument);

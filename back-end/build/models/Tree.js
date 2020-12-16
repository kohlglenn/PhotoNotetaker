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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = exports.TreeDocument = exports.BioticDisturbances = exports.Characteristics = exports.Image = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const VANCOUVER_LAT_LON = [49.28273, -123.120735];
class Image {
    constructor() {
        this.dateFound = new Date();
        this.location = VANCOUVER_LAT_LON;
    }
}
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Image.prototype, "uri", void 0);
__decorate([
    typegoose_1.prop({ default: new Date() }),
    __metadata("design:type", Date)
], Image.prototype, "dateFound", void 0);
__decorate([
    typegoose_1.prop({ default: VANCOUVER_LAT_LON }),
    __metadata("design:type", Array)
], Image.prototype, "location", void 0);
exports.Image = Image;
class Characteristics {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Characteristics.prototype, "type", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Characteristics.prototype, "matureHeight", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Characteristics.prototype, "matureSpread", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Characteristics.prototype, "form", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Characteristics.prototype, "leafArrangement", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Characteristics.prototype, "budArrangement", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Characteristics.prototype, "flowersFruitCones", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Characteristics.prototype, "soilSunRequirements", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Characteristics.prototype, "use", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Characteristics.prototype, "limitations", void 0);
exports.Characteristics = Characteristics;
class BioticDisturbances {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], BioticDisturbances.prototype, "signs", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], BioticDisturbances.prototype, "symptoms", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], BioticDisturbances.prototype, "managmentStrategy", void 0);
exports.BioticDisturbances = BioticDisturbances;
class TreeDocument {
}
__decorate([
    typegoose_1.prop({ unique: true, required: true }),
    __metadata("design:type", String)
], TreeDocument.prototype, "latinName", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], TreeDocument.prototype, "familyName", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], TreeDocument.prototype, "commonName", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Array)
], TreeDocument.prototype, "keyIdFeatures", void 0);
__decorate([
    typegoose_1.prop({ required: true, ref: () => Characteristics }),
    __metadata("design:type", Object)
], TreeDocument.prototype, "characteristics", void 0);
__decorate([
    typegoose_1.prop({ ref: () => Image }),
    __metadata("design:type", Array)
], TreeDocument.prototype, "photos", void 0);
__decorate([
    typegoose_1.prop({ ref: () => Characteristics }),
    __metadata("design:type", Object)
], TreeDocument.prototype, "bioticDisturbances", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], TreeDocument.prototype, "notes", void 0);
exports.TreeDocument = TreeDocument;
exports.Tree = typegoose_1.getModelForClass(TreeDocument);

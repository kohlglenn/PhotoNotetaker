import { getModelForClass, prop, pre, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';

const VANCOUVER_LAT_LON: [number, number] = [49.28273, -123.120735];

export class Image {
  @prop({ required: true })
  uri!: string;

  @prop({ default: new Date() })
  dateFound?: Date = new Date();

  @prop({ type: Number, default: VANCOUVER_LAT_LON })
  location?: [number, number] = VANCOUVER_LAT_LON;
}

export class Characteristics {
  @prop()
  type?: string;

  @prop()
  matureHeight?: string;

  @prop()
  matureSpread?: string;

  @prop()
  form?: string;

  @prop()
  leafArrangement?: string;

  @prop()
  budArrangement?: string;

  @prop()
  flowersFruitCones?: string;

  @prop()
  soilSunRequirements?: string;

  @prop()
  use?: string;

  @prop()
  limitations?: string;
}

export class BioticDisturbances {
  @prop()
  signs?: string;

  @prop()
  symptoms?: string;

  @prop()
  managmentStrategy?: string;
}

// export class TreeDocument {
//   @prop({ unique: true, required: true })
//   latinName!: string;

//   @prop({ required: true })
//   familyName!: string;

//   @prop({ required: true })
//   commonName!: string;

//   @prop({ required: true, type: String })
//   keyIdFeatures!: Array<string>;

//   @prop({ required: true, ref: () => Characteristics })
//   characteristics!: Ref<Characteristics>;

//   @prop({ ref: () => Image })
//   photos?: Ref<Image>[];

//   @prop({ ref: () => BioticDisturbances })
//   bioticDisturbances?: Ref<BioticDisturbances>;

//   @prop()
//   notes?: string;
// }

// Not sure if I like characteristics and biotic disturbances modeled in this way... They are weak entities so should be absorbed by the parent I think?
export class TreeDocument {
  @prop({ ref: 'User', required: true }) // User id
  user!: string;

  @prop({ required: true })
  latinName!: string;

  @prop({ required: true })
  familyName!: string;

  @prop({ required: true })
  commonName!: string;

  @prop({ required: true, type: String })
  keyIdFeatures!: Array<string>;

  @prop({ required: true, type: Characteristics })
  characteristics!: Characteristics;

  @prop({ type: Image })
  photos?: Image[];

  @prop({ type: BioticDisturbances })
  bioticDisturbances?: BioticDisturbances;

  @prop()
  notes?: string;
}

export const Tree = getModelForClass(TreeDocument);

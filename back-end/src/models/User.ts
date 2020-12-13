import { getModelForClass, prop, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

@pre<UserDocument>('save', function () {
  const user = this;
  if (user.isModified('password')) {
    return bcrypt
      .genSalt(10)
      .then((salt) => {
        return bcrypt.hash(user.password, salt);
      })
      .then((hash) => {
        user.password = hash;
      });
  }
  return Promise.resolve();
})
export class UserDocument {
  @prop({ unique: true })
  email?: string;

  @prop()
  password?: string;

  @prop({ default: '' })
  passwordResetToken?: string;

  @prop({ default: Date.now() })
  passwordResetExpires?: number;

  public comparePassword(
    this: UserDocument,
    candidatePassword: string,
    cb: (err: any, isMatch: any) => void
  ) {
    bcrypt.compare(
      candidatePassword,
      this.password as string,
      (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
      }
    );
  }
}

// contains a list of properties mutable by the user
export const MutableUserProperties = new Set(['password']);

export const User = getModelForClass(UserDocument);

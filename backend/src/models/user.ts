/* eslint-disable import/no-extraneous-dependencies */
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: Array<{ token: string }>;
  checkPassword: (password: string) => Promise<boolean>;
}

function hashPassword(this: IUser, next: mongoose.CallbackWithoutResultAndOptionalError): void {
  if (!this.isModified('password')) {
    next();
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
}

function checkPasswordFunction(this: IUser, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    default: 'É-moe',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Некорректный формат email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    minlength: [6, 'Минимальная длина поля "password" - 6'],
    select: false,
  },
  tokens: {
    type: [{ token: { type: String } }],
    default: [],
    select: false,
  },
});

userSchema.pre('save', hashPassword);
userSchema.methods.checkPassword = checkPasswordFunction;

export default mongoose.model<IUser>('User', userSchema);

import { body } from 'express-validator';
import { ValidationMsg } from '../../types/validation';

export const emailValidation = body('email')
  .isEmail()
  .withMessage(ValidationMsg.invalidEmail);

export const passwordSignupValidation = body('password')
  .trim()
  .isLength({ min: 4, max: 20 })
  .withMessage(ValidationMsg.invalidSignupPassword);

export const passwordLoginValidation = body('password')
  .trim()
  .isLength({ min: 4, max: 20 })
  .withMessage(ValidationMsg.invalidLoginPassword);

export const usernameValidation = body('username')
  .trim()
  .isString()
  .isLength({ min: 3 })
  .withMessage(ValidationMsg.invalidUsername);

export const signupValidation = [
  emailValidation,
  passwordSignupValidation,
  usernameValidation,
];

export const loginValidation = [emailValidation, passwordLoginValidation];

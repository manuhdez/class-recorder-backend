import { body } from 'express-validator';

export const emailValidation = body('email')
  .isEmail()
  .withMessage('Please enter a valid email address.');

export const passwordValidation = body('password')
  .trim()
  .isLength({ min: 4, max: 20 })
  .withMessage('Password must be between 4 and 20 characters long.');

export const usernameValidation = body('username')
  .trim()
  .isString()
  .isLength({ min: 3 })
  .withMessage('Please enter a valid username with at least 3 characters.');

export const signupValidation = [
  emailValidation,
  passwordValidation,
  usernameValidation,
];

export const loginValidation = [emailValidation, passwordValidation];

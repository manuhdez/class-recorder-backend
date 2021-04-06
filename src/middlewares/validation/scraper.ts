import { body } from 'express-validator';
import { ValidationMsg } from '../../types/validation';

const urlValidation = body('url').isURL().withMessage(ValidationMsg.invalidUrl);

export const screenshotValidation = [urlValidation];

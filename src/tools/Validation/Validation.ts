import { Request } from 'express';
import { validationResult } from 'express-validator';

export default class Validation {
  static handleBodyValidation(req: Request): void {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const [error] = validationErrors.array();
      throw new Error(error.msg);
    }
  }
}

import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { ValidationMsg } from '../../types/validation';

export default class Password {
  static generateHash = (password: string, saltRounds = 10): string => {
    const salt = genSaltSync(saltRounds);
    const hashedPassword = hashSync(password, salt);
    return hashedPassword;
  };

  static verify = (password: string, hashedPassword: string): void => {
    const isValidPassword = compareSync(password, hashedPassword);
    if (!isValidPassword) throw new Error(ValidationMsg.invalidLogin);
  };
}

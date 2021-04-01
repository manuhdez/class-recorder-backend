import jwt from 'jsonwebtoken';

interface TokenSignData {
  id: string;
  username: string;
}

export default class Token {
  jwt = jwt;

  secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET as string;
  }

  generateToken = ({ id, username }: TokenSignData): string => {
    const token = this.jwt.sign({ id, username }, this.secretKey, {
      expiresIn: '7d',
    });
    return token;
  };

  validateToken = (token: string): boolean => {
    try {
      this.jwt.verify(token, this.secretKey);
      return true;
    } catch (e) {
      return false;
    }
  };
}

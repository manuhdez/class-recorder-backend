import jwt from 'jsonwebtoken';

interface TokenSignData {
  id: string;
  username: string;
}

type DecodedToken = { [key: string]: string };

interface DecodedUserData {
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

  decodeToken = (token: string): DecodedUserData | null => {
    try {
      const decoded = this.jwt.decode(token) as DecodedToken;
      const data = this.getDataFromDecodedToken(decoded);
      return data;
    } catch (err) {
      return null;
    }
  };

  getDataFromDecodedToken = (token: DecodedToken): DecodedUserData => {
    return {
      id: token.id as string,
      username: token.username as string,
    };
  };
}

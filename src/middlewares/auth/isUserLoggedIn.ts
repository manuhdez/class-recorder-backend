import { NextFunction, Request, Response } from 'express';
import Token from '../../tools/Token/Token';

export function isUserLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { authorization } = req.headers;
  if (!authorization) {
    return next('User is not logged in.');
  }

  const JWT = new Token();
  const token = authorization.substr(7);

  const isValidSession = JWT.validateToken(token);
  if (!isValidSession) {
    return next('Token is not valid or is expired.');
  }

  const userData = JWT.decodeToken(token);
  if (!userData) {
    return next('Token is not valid.');
  }

  req.userId = userData?.id;
  next();
}

import express, { Router } from 'express';
import { urlencoded, json } from 'body-parser';

export const getTestableRoute = (baseUrl: string = '/', router: Router) => {
  const testApp = express();
  testApp.use(urlencoded({ extended: false }));
  testApp.use(json());
  testApp.use(baseUrl, router);
  return testApp;
};

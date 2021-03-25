import express, { Router, Express } from 'express';
import { urlencoded, json } from 'body-parser';

export const getTestableRoute = (baseUrl = '/', router: Router): Express => {
  const testApp = express();
  testApp.use(urlencoded({ extended: false }));
  testApp.use(json());
  testApp.use(baseUrl, router);
  return testApp;
};

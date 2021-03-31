import express, { Router, Express } from 'express';
import { urlencoded, json } from 'body-parser';
import MongoDb from '../context/Database/MongoDatabase';

export const getTestableRoute = (baseUrl = '/', router: Router): Express => {
  const testApp = express();
  testApp.use(urlencoded({ extended: false }));
  testApp.use(json());
  testApp.use(baseUrl, router);
  return testApp;
};

const testDatabase = new MongoDb('mongodb://127.0.0.1:27017/test');

export const connectDB = async (): Promise<void> => {
  await testDatabase.connect();
};

export const disconnectTestDB = async (): Promise<void> => {
  await testDatabase.disconnect();
};

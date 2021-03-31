import Express from 'express';
import { config } from 'dotenv';
import { urlencoded, json } from 'body-parser';
import mainRouter from './router/main';
import Database from './context/Database/MongoDatabase';

// load environment variables
config();

const app = Express();

// request body parsing middleware
app.use(urlencoded({ extended: false }));
app.use(json());

app.use(mainRouter);

const dbConnectionUri = 'mongodb://127.0.0.1:27017/app';

const database = new Database(dbConnectionUri);

database.connect();

const port = process.env.APP_PORT || 5000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

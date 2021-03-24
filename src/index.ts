import Express from 'express';
import { config } from 'dotenv';
import { urlencoded, json } from 'body-parser';
import mainRouter from './router/main';

// load environment variables
config();

const app = Express();

// request body parsing middleware
app.use(urlencoded({ extended: false }));
app.use(json());

app.use(mainRouter);

const port = process.env.APP_PORT || 5000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

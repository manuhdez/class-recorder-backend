import mongoose, { ConnectOptions } from 'mongoose';
import { Database } from './index';

export default class MongoDatabase implements Database {
  connectionUri: string;
  connectionOptions: ConnectOptions;

  constructor(connectionUri: string, connectionOptions?: ConnectOptions) {
    this.connectionUri = connectionUri;
    this.connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      ...connectionOptions,
    };
  }

  connect = (): void => {
    mongoose
      .connect(this.connectionUri, this.connectionOptions)
      .then(() => {
        console.log('Database successfully connected!');
      })
      .catch((err) => {
        console.log('There was a connection error with the database.');
        console.log(`Error: ${err}`);
      });
  };

  disconnect = (): void => {
    mongoose.disconnect();
  };
}

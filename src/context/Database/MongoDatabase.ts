import mongoose, { ConnectOptions } from 'mongoose';
import { Database } from './index';

export default class MongoDatabase implements Database {
  connectionUri: string;
  connectionOptions: ConnectOptions;

  constructor(connectionUri?: string, connectionOptions?: ConnectOptions) {
    this.connectionUri = connectionUri || 'mongodb://127.0.0.1:27017';
    this.connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      ...connectionOptions,
    };
  }

  connect = async (): Promise<void> => {
    try {
      await mongoose.connect(this.connectionUri, this.connectionOptions);
    } catch (err) {
      console.log('Error connecting to database');
      console.log(`Error: ${err}`);
    }
  };

  disconnect = async (): Promise<void> => {
    try {
      await mongoose.disconnect();
    } catch (err) {
      console.error('Error disconnecting database');
      console.error(`Error: ${err}`);
    }
  };
}

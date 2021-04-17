import { Document, Schema, Model, model } from 'mongoose';
import { Record } from 'types/record';

export interface RecordDocument extends Document, Record {}

const RecordSchema = new Schema<RecordDocument, Model<RecordDocument>>({
  title: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  url: String,
  start_date: Date,
  duration: Number,
  // finish_date: Date,
  is_recorded: {
    type: Boolean,
    default: false,
  },
  resource_url: {
    type: String,
  },
  credentials: {
    email: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
});

RecordSchema.set('toJSON', {
  transform: (_: never, recording: RecordDocument) => {
    recording.id = recording._id;
    delete recording._id;
    delete recording.__v;
    delete recording.credentials;
  },
});

const RecordModel = model<RecordDocument>('Record', RecordSchema);

export default RecordModel;

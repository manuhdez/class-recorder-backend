import { Document, Schema, Model, model } from 'mongoose';
import { User } from 'types/user';

interface UserDocument extends User, Document {}

const UserSchema = new Schema<UserDocument, Model<UserDocument>>({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.set('toJSON', {
  transform: (_: never, returnedObject: UserDocument) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

const UserModel = model<UserDocument>('User', UserSchema);

export default UserModel;

import UserModel, { UserDocument } from '../../models/user';
import { User } from '../../types/user';

export default class UserRepository {
  private model = UserModel;

  public createUser = async (userData: User): Promise<UserDocument> => {
    const newUser = await this.model.create(userData);
    return newUser;
  };

  public findUserById = async (
    userId: string
  ): Promise<UserDocument | null> => {
    const user = await this.model.findById(userId);
    return user;
  };

  public findUserByEmail = async (
    email: string
  ): Promise<UserDocument | null> => {
    const user = this.model.findOne({ email });
    return user;
  };
}

import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneByUsername(username: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ username });
  }

  async findById(id: string): Promise<UserDocument | undefined> {
    return this.userModel.findById(id);
  }

  async create(user: User): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }
}

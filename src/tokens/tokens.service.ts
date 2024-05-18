import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from './schemas/token.schema';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class TokensService {
  constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {}

  findOneByRefreshToken(
    refreshToken: string,
  ): Promise<TokenDocument | undefined> {
    return this.tokenModel.findOne({ refreshToken });
  }

  async findById(id: string): Promise<TokenDocument | undefined> {
    return this.tokenModel.findById(id);
  }

  async create(
    refreshToken: string,
    user: UserDocument,
  ): Promise<TokenDocument> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const newToken = new this.tokenModel({ refreshToken, user, expiresAt });
    return newToken.save();
  }
}

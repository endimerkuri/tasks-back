import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserDocument } from 'src/users/schemas/user.schema';
import { TokensService } from 'src/tokens/tokens.service';
import { TokenDocument } from 'src/tokens/schemas/token.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserDocument> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) return null;

    const correctPassword = await bcrypt.compare(pass, user.password);
    if (!correctPassword) return null;

    return user;
  }

  async login(user: UserDocument) {
    const refreshToken = 'refresh';
    const token = await this.tokensService.create(refreshToken, user);
    const payload = { username: user.username, sub: user._id, jti: token._id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(user: any) {
    const existingUser = await this.usersService.findOneByUsername(user.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const saltOrRounds = 10;
    const password = await bcrypt.hash(user.password, saltOrRounds);

    const newUser = {
      fullName: user.fullName,
      username: user.username,
      password,
      refreshTokens: [],
    };
    return this.usersService.create(newUser);
  }

  async logout(token: TokenDocument) {
    await token.deleteOne();
  }
}
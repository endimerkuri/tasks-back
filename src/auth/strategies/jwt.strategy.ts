import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { TokensService } from '../../tokens/tokens.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: { sub: string; jti: string }) {
    const token = await this.tokensService.findById(payload.jti);
    const now = new Date();
    if (!token) return null;

    if (token.expiresAt < now) {
      token.deleteOne();
      return null;
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) return null;
    return { user, token };
  }
}

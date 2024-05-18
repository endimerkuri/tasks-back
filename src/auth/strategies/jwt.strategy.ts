import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
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

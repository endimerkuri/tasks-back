import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { normalizeResponse } from 'src/util/helpers/response.helpers';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const authentication = await this.authService.login(req.user);
    return normalizeResponse({
      authentication,
      _message: 'Logged in successfully!',
    });
  }

  @Post('register')
  async register(@Request() req) {
    const user = await this.authService.register(req.body);
    return normalizeResponse({ user, _message: 'Registered successfully!' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    const { token } = req.user;
    await this.authService.logout(token);
    return normalizeResponse({ _message: 'Logged out successfully!' });
  }

  @Post('refresh')
  async refresh(@Body() payload: { refreshToken: string }) {
    const authentication = await this.authService.refresh(payload.refreshToken);

    return normalizeResponse({
      authentication,
      _message: 'Refreshed token successfully!',
    });
  }
}

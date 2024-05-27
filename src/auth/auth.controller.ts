import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { normalizeResponse } from '../util/helpers/response.helpers';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { firstName, username, lastName, email, _id: id, role } = req.user;
    const authentication = await this.authService.login(req.user);
    const user = { firstName, lastName, email, username, id, role };
    return normalizeResponse({
      user,
      authentication,
      _message: 'Logged in successfully!',
    });
  }

  @Post('register')
  async register(
    @Request() req,
    @Body()
    payload: {
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      email: string;
    },
  ) {
    const user = await this.authService.register(payload);
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

import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { normalizeResponse } from 'src/util/helpers/response.helpers';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserMe(@Request() req) {
    const { user } = req.user;
    return normalizeResponse({ user });
  }
}

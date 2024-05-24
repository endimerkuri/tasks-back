import { Controller, Get, UseGuards, Request, Put, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { normalizeResponse } from 'src/util/helpers/response.helpers';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserMe(@Request() req) {
    const { user } = req.user;
    return normalizeResponse({
      user,
      _message: 'User retrieved successfully!',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateUser(
    @Request() req,
    @Body()
    payload: {
      username?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: string;
    },
  ) {
    const { user } = req.user;
    user.username = payload.username || user.username;
    user.firstName = payload.firstName || user.firstName;
    user.lastName = payload.lastName || user.lastName;
    user.email = payload.email || user.email;
    user.role = payload.role || user.role;

    user.save();
    return normalizeResponse({ user, _message: 'User updated successfully!' });
  }
}

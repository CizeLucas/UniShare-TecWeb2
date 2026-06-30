import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { type AuthUser } from '../auth/types/auth-user.type';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users/me
   * Returns the authenticated user's profile.
   */
  @Get('me')
  async getMe(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.usersService.getMe(user.id);
  }

  /**
   * PATCH /users/me
   * Partially updates the authenticated user's name and/or PIX key.
   */
  @Patch('me')
  async updateMe(@Req() req: Request, @Body() body: UpdateUserDto) {
    const user = req.user as AuthUser;
    return this.usersService.updateMe(user.id, body);
  }
}

import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { type Request as ExpressRequest } from 'express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { type AuthUser } from './auth/types/auth-user.type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user as AuthUser;
  }
}

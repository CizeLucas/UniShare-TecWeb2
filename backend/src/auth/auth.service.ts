import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { type User } from '../domain/users/user.entity';
import { type RegisterDto } from './dto/register.dto';
import { type AuthUser } from './types/auth-user.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<AuthUser | null> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }

    const isValid = await this.usersService.verifyPassword(user, pass);
    if (!isValid) {
      return null;
    }

    return this.toAuthUser(user);
  }

  async register(input: RegisterDto): Promise<{
    access_token: string;
    user: AuthUser;
  }> {
    const created = await this.usersService.createUser(input);
    const authUser: AuthUser = {
      userId: created.userId,
      username: created.username,
      email: created.email,
    };

    return this.login(authUser);
  }

  async login(user: AuthUser): Promise<{
    access_token: string;
    user: AuthUser;
  }> {
    const payload = {
      sub: user.userId,
      username: user.username,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  private toAuthUser(user: User): AuthUser {
    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
    };
  }
}

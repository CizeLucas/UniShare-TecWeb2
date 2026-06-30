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

  /**
   * Called by LocalStrategy: validates credentials by email.
   */
  async validateUser(email: string, pass: string): Promise<AuthUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await this.usersService.verifyPassword(user, pass);
    if (!isValid) {
      return null;
    }

    return this.toAuthUser(user);
  }

  /**
   * POST /auth/register
   * Creates a new user and returns their public profile (no token).
   * The client must then call POST /auth/login to obtain a token.
   */
  async register(
    input: RegisterDto,
  ): Promise<{ id: string; name: string; email: string }> {
    const created = await this.usersService.createUser(input);
    return {
      id: created.id,
      name: created.name,
      email: created.email,
    };
  }

  /**
   * POST /auth/login
   * Issues a signed JWT for an already-validated user.
   * Returns only the access_token, as per the contract.
   */
  async login(user: AuthUser): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

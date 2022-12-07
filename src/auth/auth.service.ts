import { Injectable } from '@nestjs/common';
import { UserService } from '../user/service/user.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateToken(user: UserEntity) {
    const payload = {
      sub: user.id,
      username: user.username,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: 60 * 60 * 24 * 7 }),
    ]);
    return { accessToken, refreshToken };
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findUser(username);
    if (await verify(user.passwordHash, password)) {
      return user;
    }
    return null;
  }
  async login(user: any) {
    return this.generateToken(user);
  }
}

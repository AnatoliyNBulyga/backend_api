import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      await this.verifyPassword(password, user.hashedPassword);
      const secureUser = {
        ...user,
        hashedPassword: 'secure',
        hashedRefreshToken: 'secure',
      };
      return secureUser;
    } catch (e) {
      console.log(e, 'e');
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  public getCookieWithJwtAccessToken(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
    });
    const accessTokenCookie = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`;
    return { accessToken, accessTokenCookie };
  }
  public getCookieWithJwtRefreshToken(payload: TokenPayload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
    });
    const refreshTokenCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;
    return {
      refreshTokenCookie,
      refreshToken,
    };
  }
  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
  public async registration(user) {
    try {
      return await this.usersService.createUser(user);
    } catch (e) {
      console.log(e, 'e');
      throw new HttpException('Internal server error', HttpStatus.BAD_REQUEST);
    }
  }
}

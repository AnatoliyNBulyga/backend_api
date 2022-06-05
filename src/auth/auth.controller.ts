import { Controller, HttpCode, Post, Req } from "@nestjs/common";
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(200)
  @Post('log-in')
  async logIn(@Req() request) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.email,
    );
    const { refreshTokenCookie, refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.email);
    await this.usersService.setCurrentRefreshToken(refreshToken, user.email);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
  }
}

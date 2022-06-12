import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req, Res,
  UseGuards
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './guards/jwt-refresh-token.guard';
import LocalAuthGuard from "./guards/local-auth.guard";
import JwtAccessTokenGuard from "./guards/jwt-access-token.guard";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
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

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.email,
    );
    const { refreshTokenCookie } =
      this.authService.getCookieWithJwtRefreshToken(request.email);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return request.user;
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('logout')
  @HttpCode(200)
  async logOut(@Req() request, @Res() response) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    return response.sendStatus(200);
  }

  @Post('registration')
  async registration(@Body() user) {
    return this.authService.registration(user)
  }
}

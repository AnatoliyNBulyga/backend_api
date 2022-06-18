import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './guards/jwt-refresh-token.guard';
import LocalAuthGuard from './guards/local-auth.guard';
import JwtAccessTokenGuard from './guards/jwt-access-token.guard';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { GetUser } from './decorators/get-user.decorator';
import { IUser } from '../interfaces/user.interface';
import { IRequestWithUser } from '../interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() request: IRequestWithUser, @GetUser() user: IUser) {
    const payload: TokenPayload = {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    };
    const { accessToken, accessTokenCookie } =
      this.authService.getCookieWithJwtAccessToken(payload);
    const { refreshTokenCookie, refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(payload);
    await this.usersService.setCurrentRefreshToken(refreshToken, user.email);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return { accessToken, user };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: IRequestWithUser, @GetUser() user: IUser) {
    const payload: TokenPayload = {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    };
    const { accessTokenCookie } =
      this.authService.getCookieWithJwtAccessToken(payload);
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return user;
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
    return this.authService.registration(user);
  }
}

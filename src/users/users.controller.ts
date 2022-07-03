import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import JwtAccessTokenGuard from '../auth/guards/jwt-access-token.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }

  @UseGuards(JwtAccessTokenGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async createUser(@Body() user: UserDto) {
    return await this.userService.createUser(user);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Put()
  async updateUser(@Body() user: UserDto) {
    return await this.userService.updateUser(user);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Delete()
  async deleteUser(@Param() email: string) {
    return await this.userService.deleteUser(email);
  }
}

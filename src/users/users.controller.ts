import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers() {
    try {
      return await this.userService.getUsers();
    } catch (e) {
      console.log(e);
      return new HttpException('Internal server error', 500);
    }
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async createUser(@Body() user: UserDto) {
    try {
      return await this.userService.createUser(user);
    } catch (e) {
      console.log(e);
      return new HttpException('Internal server error', 500);
    }
  }
}

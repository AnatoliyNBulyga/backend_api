import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
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

  @Put()
  async updateUser(@Body() user: UserDto) {
    try {
      return await this.userService.updateUser(user);
    } catch (e) {
      console.log(e);
      return new HttpException('Internal server error', 500);
    }
  }

  @Delete()
  async deleteUser(@Param() email: string) {
    try {
      return await this.userService.deleteUser(email);
    } catch (e) {
      console.log(e);
      return new HttpException('Internal server error', 500);
    }
  }
}

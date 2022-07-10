import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaError } from '../utils/prisma-error';
import { UserNotFoundException } from './excaptions/user-not-found.excaption';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUsers() {
    try {
      const users = await this.prismaService.user.findMany();
      return users.map((user) => ({
        ...user,
        hashedRefreshToken: 'secure',
        hashedPassword: 'secure',
      }));
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Get user ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(user) {
    console.log('user passed in service ', user);
    try {
      const hashedPassword = await bcrypt.hash(user.password, 8);
      const created = await this.prismaService.user.create({
        data: {
          ...user,
          role: user.role ?? 'USER',
          hashedPassword,
          address: {
            create: user.address,
          },
          include: {
            address: true,
          },
        },
      });
      return { ...created, hashedPassword: 'secure' };
    } catch (err) {
      console.log(err, 'err in create user');
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === PrismaError.RecordDoesNotExist
      ) {
        throw new UserNotFoundException(user.email);
      }
      throw err;
    }
  }

  async updateUser(user) {
    console.log('user passed in service ', user);
    try {
      const hashedPassword = await bcrypt.hash(user.password, 8);
      const updated = await this.prismaService.user.update({
        where: {
          email: user.email,
        },
        data: {
          ...user,
          role: user.role ?? 'USER',
          hashedPassword,
        },
      });
      return { ...updated, hashedPassword: 'secure' };
    } catch (err) {
      console.log(err, 'err in update user');
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === PrismaError.RecordDoesNotExist
      ) {
        throw new UserNotFoundException(user.email);
      }
      throw err;
    }
  }

  async deleteUser(email) {
    console.log('user passed in service ', email);
    try {
      const deleted = await this.prismaService.user.delete({
        where: {
          email,
        },
      });
      return deleted;
    } catch (err) {
      console.log(err, 'err in delete user');
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === PrismaError.RecordDoesNotExist
      ) {
        throw new UserNotFoundException(email);
      }
      throw err;
    }
  }

  async setCurrentRefreshToken(refreshToken: string, email: string) {
    try {
      const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 8);
      await this.prismaService.user.update({
        where: {
          email,
        },
        data: {
          hashedRefreshToken: currentHashedRefreshToken,
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Set Refresh Token ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UserNotFoundException(email);
    }
    return user;
  }

  async getUserWithRefreshToken(refreshToken: string, email: string) {
    try {
      const user = await this.getUserByEmail(email);
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );
      if (!isRefreshTokenMatching) {
        throw new HttpException('Invalid refresh token', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (e) {
      console.log(e);
      return new HttpException(
        'An unknown error occured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeRefreshToken(email: string) {
    try {
      const remove = await this.prismaService.user.update({
        where: {
          email,
        },
        data: {
          hashedRefreshToken: null,
        },
      });
      return remove;
    } catch (e) {
      console.log(e);
      return new HttpException(
        'An unknown error occured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

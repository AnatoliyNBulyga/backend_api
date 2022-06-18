import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
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
      const candidate = await this.prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });
      if (candidate) {
        throw new HttpException(
          'User with this email is already exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashedPassword = await bcrypt.hash(user.password, 8);
      const created = await this.prisma.user.create({
        data: {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role ?? 'USER',
          hashedPassword,
        },
      });
      return created;
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Create user ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(user) {
    console.log('user passed in service ', user);
    try {
      const hashedPassword = await bcrypt.hash(user.password, 8);
      const updated = await this.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role ?? 'USER',
          hashedPassword,
        },
      });
      return updated;
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Update user ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(email) {
    console.log('user passed in service ', email);
    try {
      const candidateDelete = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (!candidateDelete) {
        throw new HttpException(
          'User with this email is not exist',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const deleted = await this.prisma.user.delete({
        where: {
          email,
        },
      });
      return deleted;
    } catch (e) {
      console.log(e);
      return new HttpException(
        'Delete user ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setCurrentRefreshToken(refreshToken: string, email: string) {
    try {
      const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 8);
      await this.prisma.user.update({
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
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
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
      const remove = await this.prisma.user.update({
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

import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async getUsers() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (e) {
      console.log(e);
      return new HttpException('Get user ERROR', 500);
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
        await this.prisma.user.delete({
          where: {
            email: user.email,
          },
        });
      }
      const created = await this.prisma.user.create({
        data: {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role || 'USER',
        },
      });
      return created;
    } catch (e) {
      console.log(e);
      return new HttpException('Create user ERROR', 500);
    }
  }
}

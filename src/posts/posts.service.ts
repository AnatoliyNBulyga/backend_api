import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaError } from '../utils/prisma-error';
import { PostNotFoundException } from './excaptions/post-not-found.excaption';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  async getPosts() {
    return this.prismaService.post.findMany();
  }
  async createPost(post: CreatePostDto, user: User) {
    const categories = post.categoryIds?.map((category) => ({
      id: category
    }))
    return this.prismaService.post.create({
      data: {
        ...post,
        author: {
          connect: {
            id: user.id,
          },
        },
        categories: {
          connect: categories,
        },
      },
      include: {
        categories: true,
      },
    });
  }
  async updatePost(id: number, post: UpdatePostDto) {
    try {
      return await this.prismaService.post.update({
        data: {
          ...post,
          id: undefined,
        },
        where: {
          id,
        },
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === PrismaError.RecordDoesNotExist
      ) {
        throw new PostNotFoundException(id);
      }
      throw err;
    }
  }

  async deletePost(id: number) {
    try {
      return await this.prismaService.post.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === PrismaError.RecordDoesNotExist
      ) {
        throw new PostNotFoundException(id);
      }
      throw err;
    }
  }
}

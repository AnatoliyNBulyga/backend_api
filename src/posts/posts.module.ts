import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { PostsController } from './posts.controller';

@Module({
  providers: [PostsService, PrismaService],
  controllers: [PostsController],
})
export class PostsModule {}

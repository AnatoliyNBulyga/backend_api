import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import JwtAccessTokenGuard from '../auth/guards/jwt-access-token.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { IUser } from '../interfaces/user.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Get()
  async getPosts() {
    return await this.postsService.getPosts();
  }

  @UseGuards(JwtAccessTokenGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async createPost(@GetUser() user: IUser, @Body() post: CreatePostDto) {
    return await this.postsService.createPost(post, user);
  }

  @UseGuards(JwtAccessTokenGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':id')
  async updatePost(@Body() post: UpdatePostDto, @Param('id') id: number) {
    return await this.postsService.updatePost(id, post);
  }

  @UseGuards(JwtAccessTokenGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    return await this.postsService.deletePost(id);
  }
}

import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  private posts: Post[] = [];

  findAll(): Post[] {
    return this.posts;
  }

  create(createPostDto: CreatePostDto): Post {
    const newPost: Post = {
      id: Date.now(),
      ...createPostDto,
    };

    this.posts.push(newPost);
    return newPost;
  }
}

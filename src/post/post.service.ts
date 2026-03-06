import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prima.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

// post.service.ts

async create(createPostDto: CreatePostDto, authorId: string) {
  return this.prisma.post.create({
    data: {
      title: createPostDto.title,
      content: createPostDto.content,
      // Se você ainda não tem a coluna authorId no banco, 
      // adicione no schema.prisma primeiro!
      authorId: authorId, 
    },
  });
}
}

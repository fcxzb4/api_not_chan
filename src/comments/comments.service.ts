import { Injectable, NotFoundException , } from '@nestjs/common';
import { PrismaService } from '../prisma/prima.service'; // Ajuste o caminho se necessário
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPost(postId: number) {
    return await this.prisma.comment.findMany({
      where: { 
        // Aqui garantimos que seja um número
        postId: Number(postId) 
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(createCommentDto: CreateCommentDto) {
    const { content, postId } = createCommentDto;

    return await this.prisma.comment.create({
      data: {
        content: content,
        // Converte para Number antes de enviar ao Prisma
        postId: Number(postId), 
      },
    });
  }
}
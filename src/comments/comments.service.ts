import { Injectable, NotFoundException ,BadRequestException,InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prima.service'; // Ajuste o caminho se necessário
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPost(postId: number) {
  // Se o postId não for um número válido, o NestJS pode quebrar
  if (isNaN(postId)) {
    throw new BadRequestException('ID do post inválido');
  }

  try {
    return await this.prisma.comment.findMany({
      where: { 
        postId: postId // Aqui deve ser exatamente o nome da coluna no seu schema.prisma
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Erro no Prisma:', error);
    throw new InternalServerErrorException('Erro ao buscar comentários no banco');
  }
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
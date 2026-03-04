import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts') // Alterado para 'posts' para coincidir com a chamada do Front-end
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Atende a: GET /posts/:postId/comments
   */
  @Get(':postId/comments')
  findByPost(@Param('postId') postId: string) {
    // Usando Number(postId) pois o seu service espera um número
    return this.commentsService.findByPost(Number(postId));
  }

  /**
   * Atende a: POST /posts/comments (ou ajuste conforme seu DTO)
   * Se o seu Front-end envia para /comments, use @Controller('comments') e remova o 'posts' acima.
   * Mas para manter o padrão REST:
   */
  @Post('comments')
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }
}
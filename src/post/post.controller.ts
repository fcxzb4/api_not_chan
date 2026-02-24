import { Controller, Get, Post, Body, HttpCode, HttpStatus,UnauthorizedException,Headers } from '@nestjs/common';
import { PostsService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

 @Post('webhook')
  async handleWebhook(
    @Body() data: any,
    @Headers('x-api-key') apiKey: string // Captura o cabeçalho específico
  ) {
    // Validação de Segurança Simples
    if (apiKey !== 'uma-senha-secreta-123') {
      throw new UnauthorizedException('Chave de API inválida');
    }

      console.log('Dados validados e recebidos:', data);
      return this.postsService.create(data);
    }
}
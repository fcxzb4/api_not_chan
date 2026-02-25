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
  @Body() body: any, // Renomeie para body para facilitar
  @Headers('x-api-key') apiKey: string
) {
  if (apiKey !== 'uma-senha-secreta-123') {
    throw new UnauthorizedException('Chave de API inválida');
  }

  // Se o JSON do Activepieces vier com { data: { title: ... } }
  // Nós pegamos apenas o que está dentro de data
  const postData = body.data ? body.data : body;

  console.log('Dados processados:', postData);
  return this.postsService.create(postData);
}
}
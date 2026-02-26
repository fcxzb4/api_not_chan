import { Controller, Get, Post, Body, HttpCode, HttpStatus,UnauthorizedException,Headers, Req} from '@nestjs/common';
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
  @Req() request: Request, // Captura o objeto bruto da requisição
  @Headers('x-api-key') apiKey: string
) {
  console.log('Headers recebidos:', request.headers);
  console.log('Body bruto recebido:', request.body); // Veja se aparece algo aqui

  if (apiKey !== 'uma-senha-secreta-123') {
    throw new UnauthorizedException();
  }

  // Se o body chegar vazio aqui, o Activepieces não está enviando o payload no formato correto
  return this.postsService.create(request.body);
 }
}
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UnauthorizedException, 
  Headers, 
  Req, 
  UseGuards 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Importe o Guard
import { PostsService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import type  { Request as ExpressRequest } from 'express'; // Tipagem do Express

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // ROTA PROTEGIDA: Apenas usuários logados podem criar posts
  @Post()
  @UseGuards(AuthGuard('supabase')) 
  create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    // O 'userId' vem do método 'validate' da sua SupabaseStrategy
    const userId = req.user.userId;

    // Passamos o DTO e o ID do autor para o Service
    return this.postsService.create(createPostDto, userId);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() request: ExpressRequest,
    @Headers('x-api-key') apiKey: string
  ) {
    if (apiKey !== 'uma-senha-secreta-123') {
      throw new UnauthorizedException();
    }

    // Webhooks geralmente não passam pelo Guard do Supabase, 
    // pois vêm de serviços externos (Activepieces)
    return this.postsService.create(request.body as any, 'SYSTEM_WEBHOOK');
  }
}
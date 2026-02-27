import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UseGuards, 
  Req, 
  Get 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.strategy';
import { RolesGuard } from './guards/role-guards'; // Importe o Guard de Roles
import { Roles } from './decorators/roles.decorators'; // Importe o Decorador
import { AuthDto } from './DTO/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: AuthDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: AuthDto) {
    return this.authService.register(body.email, body.password);
  }

  /**
   * Rota para verificar se o token é válido e retornar os dados do usuário
   * Agora retorna o objeto user completo (com o campo 'role')
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('check-status')
  checkAuthStatus(@Req() req: any) {
    // O req.user é preenchido pelo seu Strategy/AuthService
    return req.user; 
  }

  /**
   * EXEMPLO: Rota que apenas Administradores podem acessar
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin-only')
  getAdminData() {
    return { message: 'Bem-vindo, soberano Administrador!' };
  }
}
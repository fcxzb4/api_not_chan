import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './DTO/auth.dto'; // Importe o DTO que criamos

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Login geralmente retorna 200 OK, não 201 Created
  async login(@Body() body: AuthDto) {
    // Ajustado para chamar o método 'login' do seu AuthService
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: AuthDto) {
    // Ajustado para chamar o método 'register' do seu AuthService
    return this.authService.register(body.email, body.password);
  }
}
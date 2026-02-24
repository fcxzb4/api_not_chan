import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  // Puxando as variáveis de ambiente
  private readonly supabaseUrl = process.env.SUPABASE_URL ?? ' ';
  private readonly supabaseKey = process.env.SUPABASE_KEY ?? '';

  /**
   * Valida se um token JWT do Supabase ainda é válido.
   * Útil para rotas protegidas.
   */
  async validateUser(token: string) {
    const response = await fetch(`${this.supabaseUrl}/auth/v1/user`, {
      headers: {
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException('Sessão expirada ou usuário inválido');
    }

    return await response.json();
  }

  /**
   * Realiza o Login batendo direto na API do Supabase
   */
  async login(email: string, pass: string) {
    const response = await fetch(`${this.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': this.supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password: pass }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new UnauthorizedException(data.error_description || 'Falha na autenticação');
    }

    return data; // Retorna o user e o access_token para o front
  }

  /**
   * Realiza o Cadastro
   */
  async register(email: string, pass: string) {
    const response = await fetch(`${this.supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': this.supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password: pass }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(data.msg || 'Erro ao criar conta');
    }

    return data;
  }
}
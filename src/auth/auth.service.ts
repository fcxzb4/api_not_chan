import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prima.service'; // Ajuste o caminho conforme seu projeto

@Injectable()
export class AuthService {
  private readonly supabaseUrl = process.env.SUPABASE_URL ?? '';
  private readonly supabaseKey = process.env.SUPABASE_KEY ?? '';

  constructor(private readonly prisma: PrismaService) {}

  async validateUserById(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * Valida o token e anexa o cargo (Role) do banco de dados
   */
  async validateUser(token: string) {
    const response = await fetch(`${this.supabaseUrl}/auth/v1/user`, {
      headers: {
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${token}`,
      } as Record<string, string>,
    });

    const supabaseUser = await response.json();

    if (!response.ok || !supabaseUser.id) {
      throw new UnauthorizedException('Sessão expirada ou usuário inválido');
    }

    // Busca o usuário no seu banco para pegar o campo 'role'
    const userWithRole = await this.prisma.user.findUnique({
      where: { id: supabaseUser.id },
    });

    // Se o usuário existe no Supabase mas não no seu banco (raro, mas acontece), 
    // você pode criá-lo aqui ou retornar o básico.
    return userWithRole || supabaseUser;
  }

  async login(email: string, pass: string) {
    const response = await fetch(`${this.supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': this.supabaseKey,
        'Content-Type': 'application/json',
      } as Record<string, string>,
      body: JSON.stringify({ email: email.trim(), password: pass }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new UnauthorizedException(data.error_description || 'Falha na autenticação');
    }

    return data;
  }

  /**
   * Cadastro: Cria no Supabase e depois salva no Prisma com Role default (USER)
   */
  async register(email: string, pass: string) {
    const response = await fetch(`${this.supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': this.supabaseKey,
        'Content-Type': 'application/json',
      } as Record<string, string>,
      body: JSON.stringify({ email: email.trim(), password: pass }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new BadRequestException(data.msg || data.message || 'Erro ao criar conta');
    }

    // IMPORTANTE: Salva o novo usuário no seu banco local para gerenciar Roles
    if (data.id || (data.user && data.user.id)) {
      const userId = data.id || data.user.id;
      
      await this.prisma.user.create({
        data: {
          id: userId,
          email: email.trim(),
          role: 'USER', // Todo novo usuário começa como USER
        },
      });
    }

    return data;
  }
}
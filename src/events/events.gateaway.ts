import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service'; // Importe seu AuthService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // Extrai o JWT do cookie 'access_token'
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['access_token'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'SEU_SEGREDO_SUPER_SECRETO_E_LONGO_123456',
    });
  }

  async validate(payload: any) {
    // O Gateway usa payload.email e payload.name, então mantemos a consistência
    if (!payload) {
      throw new UnauthorizedException();
    }

    // Buscamos o usuário no banco (Prisma) para incluir o Role
    // Isso garante que @Roles() funcione tanto em HTTP quanto no futuro do WS
    const user = await this.authService.validateUserById(payload.sub);

    return { 
      id: payload.sub, 
      email: payload.email, 
      name: payload.name,
      role: user?.role || 'USER' 
    };
  }
}
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/role-guards';
import { SupabaseStrategy } from './supabase/supabase.strategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService,SupabaseStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}

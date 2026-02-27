import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  // Conecta ao banco de dados quando o módulo inicia
  async onModuleInit() {
    await this.$connect();
  }

  // Fecha a conexão quando o módulo é destruído (evita vazamento de conexões)
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
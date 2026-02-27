import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookieParser())
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Recomendado: Adicionar pipes de validação global
  app.useGlobalPipes(new ValidationPipe());

  // Importante para Vercel: Se houver um prefixo global (ex: /api)
  // app.setGlobalPrefix('api');

  // Na Vercel, o 'listen' é necessário para local, 
  // mas o entry point precisa estar pronto.
  await app.listen(process.env.PORT || 3000);
}

// Inicializa o bootstrap
bootstrap();
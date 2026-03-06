import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CONFIGURAÇÃO DO CORS
  app.enableCors({
    origin: [
      'https://front-end-not-chan-kzq7gqe30-steezus-projects.vercel.app', // Seu domínio atual do Vercel
      'http://localhost:5173', // Para você conseguir testar localmente também
      /\.vercel\.app$/ // Isso permite qualquer subdomínio da vercel.app (útil para deploys de teste)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
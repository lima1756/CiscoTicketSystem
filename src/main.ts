import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { AuthenticationMiddleware } from './common/authentication.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new AuthenticationMiddleware().use)
  await app.listen(3000);
}
bootstrap();

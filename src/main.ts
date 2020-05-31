import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthenticationMiddleware } from './common/authentication.middleware';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(new AuthenticationMiddleware().use)
  await app.listen(process.env.PORT || 5001);
}
bootstrap();

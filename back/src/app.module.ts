import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { AuthenticationMiddleware } from 'src/common/authentication.middleware';

@Module({
  imports: [SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

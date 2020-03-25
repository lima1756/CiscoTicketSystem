import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { AuthenticationMiddleware } from 'src/common/authentication.middleware';


@Module({
  // imports: [
  //   Moongo
  // ]
  controllers: [SearchController],
  providers: [SearchService]
})

export class SearchModule {}

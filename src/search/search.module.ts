import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { AuthenticationMiddleware } from 'src/common/authentication.middleware';
import { TicketModule } from 'src/ticket/ticket.module';



@Module({
  imports: [
    TicketModule
  ],
  controllers: [SearchController],
  providers: [SearchService]
})

export class SearchModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(AuthenticationMiddleware)
    .forRoutes(SearchController)
  }
}

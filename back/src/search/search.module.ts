import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationMiddleware } from 'src/common/authentication.middleware';
import { TicketSchema } from 'src/ticket/ticket.schema';
import { TicketModule } from 'src/ticket/ticket.module';


@Module({
  imports: [
    TicketModule
  ],
  controllers: [SearchController],
  providers: [SearchService]
})

export class SearchModule {}

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchModule } from './search/search.module';
import { TicketModule } from './ticket/ticket.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost/cisco', { useNewUrlParse: true}),
    SearchModule, TicketModule, CompanyModule, UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public')
    })]
})
export class AppModule {}

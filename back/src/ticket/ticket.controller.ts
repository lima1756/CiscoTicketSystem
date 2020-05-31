import { Controller, Get, Param } from '@nestjs/common';
import { TicketService } from './ticket.service';
import {TicketDTO, Ticket} from './ticket.schema'
import { SharedController } from 'src/shared/Shared.controller';

@Controller('ticket')
export class TicketController extends SharedController<TicketDTO, Ticket, TicketService> {

    constructor(private ticketService: TicketService){
        super(ticketService);
    }

    @Get('/user/:user')
    async getUserTickets(@Param('user') user) {
        return await this.ticketService.getUserTickets(user);
    }
}

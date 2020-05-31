import { Injectable } from '@nestjs/common';
import {TicketDTO, Ticket} from './ticket.schema'
import { Model } from 'mongoose';
import { SharedService } from 'src/shared/Shared.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TicketService extends SharedService<Ticket, TicketDTO>{
    constructor(@InjectModel('Ticket') private readonly ticketModel: Model<Ticket>) {
        super(ticketModel);
    }

    async getUserTickets(user): Promise<Ticket[]> {
        return await this.ticketModel.find({"user":user}).exec();
    }
}

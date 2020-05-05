import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Fuse from 'fuse.js';
import { Ticket } from 'src/ticket/ticket.schema';
import { Model } from 'mongoose';
import { TicketService } from 'src/ticket/ticket.service';

@Injectable()
export class SearchService {

    constructor(private readonly ticketService: TicketService){}

    async search(input: string){
        // TODO: change mock to real data
        
        const data = (await this.ticketService.get()).map( s => {return this.combineAllKeyValues(s, null)});
        const fuzeOptions = {
            shouldSort: true,
            threshold: 0.6,
            isCaseSensitive: false,
            keys: [
                "_id",
                "title",
                "description",
                "all"
              ]
        }
        const fuse = new Fuse(data, fuzeOptions);
        return fuse.search(input);
    }

    private combineAllKeyValues( obj: Ticket, separator: string )
    {
        separator = separator || " ";
        let d = {...JSON.parse(JSON.stringify(obj)), ...{"all":Object.keys(JSON.parse(JSON.stringify(obj))).map(s => obj[s]).join( separator )}};
        return d;
    }
    
}

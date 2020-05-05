import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    a(){
        return "Hola"
    }

    @Get(':input')
    search(@Param() params: {input:string}) {
        return this.searchService.search(params.input);
    }
}

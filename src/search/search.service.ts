import { Injectable } from '@nestjs/common';
import mock_problems from '../../mocks/search_data.json';
import Fuse from 'fuse.js';

@Injectable()
export class SearchService {
    search(input: string){
        // TODO: change mock to real data

        const data = mock_problems.map( s => this.combineAllKeyValues(s, null));
        const fuzeOptions = {
            shouldSort: true,
            includeScore: true,
            threshold: 0.6,
            includeMatches: true,

            keys: [
                {
                    name: "id", 
                    weight: .3
                },
                {
                    name: "problem_title",
                    weight: .3
                    
                },
                {
                    name:"problem_description",
                    weight:.3
                },
                {
                    name: "file", 
                    weight: .3
                },
                {
                    name:"user", 
                    weight:.3
                },
                {
                    name:"company", 
                    weight:.3
                },
                {
                    name: "all", 
                    weight:.3
                }
            ]
        }
        return new Fuse(data, fuzeOptions).search(input);
    }

    private combineAllKeyValues( obj: any, separator: string )
    {
        separator = separator || " ";
        obj.all = Object.keys(obj).map(s=> obj[s]).join( separator );
        return obj;
    }
    
}

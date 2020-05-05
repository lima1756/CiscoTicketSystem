import { Controller } from '@nestjs/common';
import { SharedController } from 'src/shared/Shared.controller';
import { CompanyDTO, Company } from './company.schema';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController extends SharedController<CompanyDTO, Company, CompanyService>{
    constructor(private companyService: CompanyService){
        super(companyService);
    }
}

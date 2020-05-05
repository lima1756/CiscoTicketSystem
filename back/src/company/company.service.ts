import { Injectable } from '@nestjs/common';
import { Company, CompanyDTO } from './company.schema';
import { Model } from 'mongoose';
import { SharedService } from 'src/shared/Shared.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CompanyService extends SharedService<Company, CompanyDTO>{
    constructor(@InjectModel('Company') private readonly companyModel: Model<Company>) {
        super(companyModel);
    }
}

import { Injectable } from '@nestjs/common';
import { SharedService } from 'src/shared/Shared.service';
import { Model } from 'mongoose';
import { User, UserDTO } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService extends SharedService<User, UserDTO>{
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {
        super(userModel);
    }

    async findByauth0(id){
        const obj = await this.userModel.find({"authOId":id}).exec();
        return obj[0];
    }
    
}

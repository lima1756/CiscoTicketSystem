import { Injectable, Logger } from '@nestjs/common';
import { Model, Document } from 'mongoose';

@Injectable()
export class SharedService<Type extends Document, DTO> {
    
    constructor(private readonly objModel: Model<Type>) {
    }

    async add(materialDTO: DTO): Promise<Type> {
        const obj = new this.objModel(materialDTO);
        return await obj.save();
    }

    async getOne(id): Promise<Type> {
        const obj = await this.objModel.findById(id).exec();
        return obj;
    }

    async getByName(name): Promise<Type> {
        const obj = await this.objModel.find({"name":name}).exec();
        return obj[0];
    }

    async get(): Promise<Type[]> {
        const obj = await this.objModel.find().exec();
        return obj;
    }

    async edit(id, materialDTO: DTO): Promise<Type> {
        const obj = await this.objModel.findByIdAndUpdate(id, materialDTO, {new: true});
        return obj;
    }

    async delete(id): Promise<Type> {
        const obj = await this.objModel.findByIdAndDelete(id);
        return obj;
    }
}

import { Post, Body, Get, Param, NotFoundException, Put, Delete,Logger } from '@nestjs/common';
import { SharedService } from './Shared.service';
import { Document } from 'mongoose';

export class SharedController <DTO, Type extends Document, Service extends SharedService<Type, DTO>> {
    
    constructor(private service: Service){}

    @Post()
    async add(@Body() dto: DTO){
        return await this.service.add(dto);
    }

    @Get()
    async get(){
        return await this.service.get();
    }

    @Get(":id")
    async getOne(@Param('id') id) {
        const material = await this.service.getOne(id);
        if (!material) {
            throw new NotFoundException('Object does not exist!');
        }
        return material;
    }

    @Put(":id")
    async edit(@Param('id' ) id, @Body() dto: DTO){
        const editedMaterial = await this.service.edit(id, dto);
        if (!editedMaterial) {
            throw new NotFoundException('Object does not exist!');
        }
        return editedMaterial;
    }

    @Delete(":id")
    async delete(@Param('id') id){
        const deletedMaterial = await this.service.delete(id);
        if (!deletedMaterial) {
            throw new NotFoundException('Object does not exist!');
        }
        return deletedMaterial;
    }
}

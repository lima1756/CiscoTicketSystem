import { Controller, Param, Get, NotFoundException } from '@nestjs/common';
import { SharedController } from 'src/shared/Shared.controller';
import { UserDTO, User } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController extends SharedController<UserDTO, User, UserService> {

    constructor(private userService: UserService){
        super(userService);
    }

    @Get("auth/:id")
    async getByAuth0(@Param('id') id) {
        const user = await this.userService.findByauth0(id);
        if (!user) {
            throw new NotFoundException('Object does not exist!');
        }
        return user;
    }

}

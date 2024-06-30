
import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UserService } from 'src/packages/services/user.service';
import { CreateUserDto} from '../../dto/user/create.user.dto';
import { UpdateUserDto } from 'src/packages/dto/user/update.user.dto';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto) {
        try {
            const user = await this.userService.createUser(createUserDto);
            return { message: 'User created successfully', user };
        } catch (error) {
            return { error: 'Internal server error' };
        }
    }

    @Get('getAll')
    async getAllUsers() {
        try {
            const users = await this.userService.getAllUsers();
            return { users };
        } catch (error) {
            return { error: 'Internal server error' };
        }
    }

    @Get('read/:id')
    async getUserById(@Param('id') id: string) {
        try {
            const user = await this.userService.getUserById(id);
            return { user };
        } catch (error) {
            return { error: 'Internal server error' };
        }
    }

    @Put('update/:id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        try {
            const user = await this.userService.updateUser(id, updateUserDto);
            return { message: 'User updated successfully', user };
        } catch (error) {
            return { error: 'Internal server error' };
        }
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id') id: string) {
        try {
            await this.userService.deleteUser(id);
            return { message: 'User deleted successfully' };
        } catch (error) {
            return { error: 'Internal server error' };
        }
    }
}
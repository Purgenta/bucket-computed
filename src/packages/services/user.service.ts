import { Injectable } from '@nestjs/common';
import { User } from '../entities/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(user: Partial<User>): Promise<User> {
        try {
            const newUser = new this.userModel(user);
            return await newUser.save();
        } catch (error) {
            throw new Error(`Failed to create user: ${error}`);
        }
    }
    async getAllUsers(): Promise<User[]> {
        try {
            return await this.userModel.find();
        } catch (error) {
            throw new Error(`Failed to get users: ${error}`);
        }
    }
    async getUserById(id: string): Promise<User> {
        try {
            return await this.userModel.findById(id);
        } catch (error) {
            throw new Error(`Failed to get user: ${error}`);
        }
    }
    async updateUser(id: string, user: Partial<User>): Promise<User> {
        try {
            return await this.userModel.findByIdAndUpdate(id, user, { new: true });
        } catch (error) {
            throw new Error(`Failed to update user: ${error}`);
        }
    }
    async deleteUser(id: string): Promise<void> {
        try {
            await this.userModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Failed to delete user: ${error}`);
        }
    }
    async dropUsers(): Promise<void> {
        try {
            await this.userModel.deleteMany({});
        } catch (error) {
            throw new Error(`Failed to delete users: ${error}`);
        }
    }


}
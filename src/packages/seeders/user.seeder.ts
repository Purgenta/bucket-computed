import { Seeder } from 'nestjs-seeder';
import { Injectable } from '@nestjs/common';
import {faker as Faker } from '@faker-js/faker';
import { UserService } from '../services/user.service';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(private readonly userService: UserService) {

  }
  // generate hundred users
  async seed(): Promise<any> {
    for (let i = 0; i < 1000; i++) {
      const createUserDto = {
        name: Faker.person.firstName(),
        email: Faker.internet.email(),
        password: Faker.internet.password(),
      };
      await this.userService.createUser(createUserDto);
    }
  }
 async drop(): Promise<any> {
    // Drop all users
    await this.userService.dropUsers();
 }
}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../services/user.service';
import { UserController } from '../api/controllers/user.controller';
import { User,UserSchema } from '../entities/user/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema}])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
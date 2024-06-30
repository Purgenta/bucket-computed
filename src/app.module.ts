import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import {SensorModule} from "./packages/modules/sensor.module";
import { UserModule } from './packages/modules/user.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/iotpattern'),SensorModule,UserModule],
})
export class AppModule {}

import { seeder } from "nestjs-seeder";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSeeder } from "./packages/seeders/user.seeder";
import { SensorModule } from "./packages/modules/sensor.module";
import { UserModule } from "./packages/modules/user.module";
import { SensorSeeder } from "./packages/seeders/sensor.seeder";

seeder({
  imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/iotpattern"),
    UserModule,SensorModule,
  ],
}).run([UserSeeder,SensorSeeder]);
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorController } from '../api/controllers/sensor.controller';
import { SensorService } from '../services/sensor.service';
import { SensorReadingsSchema,SensorReadings } from '../entities/optimized/sensor.readings.schema'
import { SensorReading,SensorReadingSchema } from '../entities/unoptimized/sensor.reading.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SensorReadings.name, schema: SensorReadingsSchema},{name: SensorReading.name,schema: SensorReadingSchema}])],
  controllers: [SensorController],
  providers: [SensorService],
  exports: [SensorService]
})
export class SensorModule {}
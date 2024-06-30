import { Seeder } from 'nestjs-seeder';
import { Injectable } from '@nestjs/common';
import {faker as Faker } from '@faker-js/faker';
import { SensorService } from '../services/sensor.service';
import { SensorReadings } from '../entities/optimized/sensor.readings.schema';
import { SensorReading } from '../entities/unoptimized/sensor.reading.schema';

@Injectable()
export class SensorSeeder implements Seeder {
  constructor(private readonly sensorService: SensorService) {

  }
  // generate sensorReadings
  async seed(): Promise<any> {
    // generate ten thousand sensor readings
    for(let i = 0; i < 5; i++) {
      const sensorId = Faker.database.mongodbObjectId();
      const days = Faker.date.betweens({from: new Date(2024, 1, 1), to: new Date(2024, 12, 31),count: 365});
      const data: SensorReadings[] = [];
      const unoptimizedData: SensorReading[] = [];  
      days.forEach(async (day) => {
        for(let j = 1; j <= 24; j++) {
        
            const interval = `${j}hour`;
            const readingValues = [];     
            const previousDate = new Date(day).setHours(j - 1);
            const nextDate = new Date(day).setHours(j + 1);
            for(let k = 0; k < 15; k++) {
              readingValues.push({value : Faker.number.float({min: 20,max: 30}), date: Faker.date.between({from: previousDate, to: nextDate})});
              const unoptimizedReading: SensorReading = {sensorId, value: Faker.number.float({min: 20,max: 30}), date: Faker.date.between({from: previousDate, to: nextDate}), location: Faker.location.city(), sensorType: "temperature", unit: 'Celsius', description: Faker.lorem.sentence()};
              unoptimizedData.push(unoptimizedReading);
            }
            const createdSensorReadings: SensorReadings = {
              sensorId,
              description: Faker.lorem.sentence(),
              location: Faker.location.city(),
              sensorType: "temperature",
              unit: 'Celsius',
              date: day,
              interval,
              avg: readingValues.reduce((acc,curr) => acc + curr.value,0) / readingValues.length,
              values: readingValues
            };
            data.push(createdSensorReadings);
        }
      })
      await this.sensorService.createUnoptimizedSensorReading(unoptimizedData);
      await this.sensorService.createSensorReadings(data);
    }

}
 async drop(): Promise<any> {
    // Drop all sensor readings
    await this.sensorService.dropSensorReadings();
    await this.sensorService.dropUnoptimizedSensorReadings();
 }
}
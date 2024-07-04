import { Injectable } from '@nestjs/common';
import { SensorReadings as SensorReadingModel, SensorReadings } from '../entities/optimized/sensor.readings.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { CreateSensorReadingDto } from '../dto/create.sensor.reading.dto';
import { SensorReading } from '../entities/unoptimized/sensor.reading.schema';
import {  faker as Faker } from '@faker-js/faker';
@Injectable()
export class SensorService {
    
    constructor(@InjectModel(SensorReadings.name) private sensorModel: Model<SensorReadings>,@InjectConnection() private connection: Connection,@InjectModel(SensorReading.name) private sensorUnoptimizedModel: Model<SensorReading>) {}
    async createSensorReadingOptimized(sensorReadingData: CreateSensorReadingDto) {
        const interval = `${new Date(sensorReadingData.date).getHours().toString()}hours`;
        try {
            const startTime = Date.now();
            const reading = await this.sensorModel.findOneAndUpdate(
                { sensorId: sensorReadingData.sensorId, interval },
                { $push: { values: sensorReadingData }, $inc: { avg: sensorReadingData.value }},
                { upsert: true }
            );
            const endTime = Date.now();
            return {time: endTime - startTime}
            return reading;
        } catch (error) {
            throw new Error(`Failed to create sensor reading: ${error}`);
        }
    }

    async getSensorReadings(sensorId: string,interval: number) {
        try {
            const startTime = Date.now();
            await this.sensorModel.find({sensorId,interval: `${interval}hour`}).exec();
            const endTime = Date.now();
            console.log(`Time taken to get sensor readings: ${endTime - startTime}ms`);
            return {time: endTime - startTime}
        } catch (error) {
            throw new Error(`Failed to get sensor readings: ${error}`);
        }
    }


    async deleteReadingsByIntervalOptimized(interval: number,sensorId: string) {
        try {
            const startTime = Date.now();
            const deleted = await this.sensorModel.deleteMany({ interval: `${interval}hour`,sensorId });
            const endTime = Date.now();
            return {time: endTime - startTime,deleted}
        } catch (error) {
            throw new Error(`Failed to delete sensor readings: ${error}`);
        }
    }
    async deleteReadingsByIntervalUnoptimized(interval: number,sensorId: string) {
        try {
            const startTime = Date.now();
            const deleted = await this.sensorUnoptimizedModel.deleteMany({ $where: (obj) => `${obj.date.getHours()}` == String(interval),sensorId });
            const endTime = Date.now();
            console.log(`Time taken to delete sensor readings: ${endTime - startTime}ms`);
            return {time: endTime - startTime,deleted}
        } catch (error) {
            throw new Error(`Failed to delete sensor readings: ${error}`);
        }
    }
    async createSensorReadings(sensorReadings: SensorReadings[]) {
        try {
            const newSensorReadings = await this.sensorModel.create(sensorReadings);
            return newSensorReadings
        } catch (error) {
            throw new Error(`Failed to create sensor readings: ${error}`);
        }
    }
    async dropSensorReadings(): Promise<void> {
        try {
            await this.sensorModel.deleteMany({});
        } catch (error) {
            throw new Error(`Failed to delete sensor readings: ${error}`);
        }
    }
    async getCollectionSize() {
        try {
            const sensorReadingIndexes = await this.connection.collection('sensorreadings').getIndexes();
            return sensorReadingIndexes;
        } catch (error) {
            throw new Error(`Failed to get collection size: ${error}`);
        }
    }
    async createUnoptimizedSensorReading(sensorReadingData: SensorReading[]) {
        try {
            const startTime = Date.now();
            const sensorReading = await this.sensorUnoptimizedModel.create(sensorReadingData);
            const endTime = Date.now();
            console.log(`Time taken to create sensor readings: ${endTime - startTime}ms`);
            return sensorReading;
        } catch (error) {
            throw new Error(`Failed to create sensor reading: ${error}`);
        }
    }
    async getUnoptimizedSensorReadings(): Promise<SensorReadingModel[]> {
        try {
            return await this.sensorUnoptimizedModel.find();
        } catch (error) {
            throw new Error(`Failed to get sensor readings: ${error}`);
        }
    }
    async dropUnoptimizedSensorReadings(): Promise<void> {
        try {
            await this.sensorUnoptimizedModel.deleteMany({});
        } catch (error) {
            throw new Error(`Failed to delete sensor readings: ${error}`);
        }
    }
    async getUnoptimizedCollectionSize() {
        try {
            const sensorReadingIndexes = await this.connection.collection('sensorreading').getIndexes();
            return sensorReadingIndexes;
        } catch (error) {
            throw new Error(`Failed to get collection size: ${error}`);
        }
    }
    async getAverageSensorUnoptimizedReadings(id: string){
        try {
            const startTime = Date.now();
            const averageSensorReadings = await this.sensorUnoptimizedModel.aggregate([
                { $match: { sensorId: id } },
                { $group: { _id: "$sensorId", averageValue: { $avg: "$value" } } }
            ]).exec();
            const endTime = Date.now();
            console.log(`Time taken to get average sensor readings: ${endTime - startTime}ms`);
            return {time: endTime - startTime,averageSensorReadings}
        } catch (error) {
            throw new Error(`Failed to get average sensor readings: ${error}`);
        }
    }
    async createDummyOptimizedAndUnoptimizedSensorReadings() {

    }
    async getUnoptimizedSensorReadingByInterval(id: string,interval: number){
        try {
            const startTime = Date.now();
            await this.sensorUnoptimizedModel.find({sensorId: id,$where:  (obj) => obj.date.getHours() === interval}).exec();
            const endTime = Date.now();
            console.log(`Time taken to get sensor readings: ${endTime - startTime}ms`);
            return {time: endTime - startTime}
        } catch (error) {
            throw new Error(`Failed to get average sensor readings: ${error}`);
        }
    }
    async seedBenchmark() {
            // generate one hundred sensor readings
            for(let i = 0; i < 10; i++) {
              const sensorId = Faker.database.mongodbObjectId();
              const days = Faker.date.betweens({from: new Date(2024, 1, 1), to: new Date(2024, 12, 31),count: 365});
              const data: SensorReadings[] = [];
              const unoptimizedData: SensorReading[] = [];  
              for(let j = 1; j <= 10; j++) {
                const interval = `${j}hour`;
                const readingValues = [];     
                const previousDate = new Date(days[i]).setHours(j - 1);
                const nextDate = new Date(days[i]).setHours(j + 1);
                for(let k = 0; k < 10; k++) {
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
                  date: days[i],
                  interval,
                  avg: readingValues.reduce((acc,curr) => acc + curr.value,0) / readingValues.length,
                  values: readingValues
                };
                data.push(createdSensorReadings);
              }
              const startUnoptimizedTime = Date.now();
              await this.createUnoptimizedSensorReading(unoptimizedData);
              const endUnoptimizedTime = Date.now();
              const startOptimizedTime = Date.now();
              await this.createSensorReadings(data);
              const endOptimizedTime = Date.now();
              return {timeOptimized: endOptimizedTime - startOptimizedTime,timeUnoptimized: endUnoptimizedTime - startUnoptimizedTime}
            }
    }
    async getAverageOptimizedSensorReadings(id: string){
        try {
            const startTime = Date.now();
            const averageSensorReadings = await this.sensorModel.aggregate([
                { $match: { sensorId: id } },
                { $group: { _id: "$sensorId", averageValue: { $avg: "$avg" } } }
            ]).exec();
            const endTime = Date.now();
            console.log(`Time taken to get average sensor readings: ${endTime - startTime}ms`);
            return {time: endTime - startTime,averageSensorReadings}
        } catch (error) {
            throw new Error(`Failed to get average sensor readings: ${error}`);
        }
    }
    async getUniqueSensorOptimized(){
        try {
            const startTime = Date.now();
            const uniqueSensorReadings = await this.sensorModel.distinct('sensorId').exec();
            const endTime = Date.now();
            console.log(`Time taken to get unique sensor readings: ${endTime - startTime}ms`);
            return {time: endTime - startTime,uniqueSensorReadings}
        } catch (error) {
            throw new Error(`Failed to get unique sensor readings: ${error}`);
        }
    }
    async getUniqueSensorUnoptimized(){
        try {
            const startTime = Date.now();
            const uniqueSensorReadings = await this.sensorUnoptimizedModel.distinct('sensorId').exec();
            const endTime = Date.now();
            console.log(`Time taken to get unique sensor readings: ${endTime - startTime}ms`);
            return {time: endTime - startTime,uniqueSensorReadings}
        } catch (error) {
            throw new Error(`Failed to get unique sensor readings: ${error}`);
        }
    }
    async getUnoptimizedCollectionStats(){
        try {
            
            const sensorReadingStats = await this.sensorUnoptimizedModel.aggregate( [ {
                $collStats:
                  {
                    // Kb=>scale=1024,...
                    storageStats: { scale: 1024}, 
                  }
               }])

            return {sensorReadingStats}
        } catch (error) {
            throw new Error(`Failed to get collection stats: ${error}`);
        }
    }
    async getOptimizedCollectionStats(){
        try {
            const sensorReadingStats = await this.sensorModel.aggregate( [{
                $collStats:
                  {
                    // Kb=>scale=1024,...
                    storageStats: { scale: 1024}, 
                  }
               }])
            return {sensorReadingStats}
        } catch (error) {
            throw new Error(`Failed to get collection stats: ${error}`);
        }
    }

    
}
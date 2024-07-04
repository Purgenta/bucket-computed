
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SensorService } from '../../services/sensor.service';
import { CreateSensorReadingDto } from 'src/packages/dto/create.sensor.reading.dto';
import { ReadSensorRouteParams } from 'src/packages/dto/read.sensor.reading.dto';
import { SensorReading } from 'src/packages/entities/unoptimized/sensor.reading.schema';
import { DeleteSensorReadingDto } from 'src/packages/dto/delete.sensor.reading.dto';


@Controller('sensor')
export class SensorController {
    constructor(private readonly sensorService: SensorService) {}

    @Post('create')
    async createSensorData (@Body() data: CreateSensorReadingDto) {
        return await this.sensorService.createSensorReadingOptimized(data);
    }
    @Post('createUnoptimized')
    async createUnoptimizedSensorData (@Body() data: CreateSensorReadingDto) {
        const sensorReading: SensorReading = {sensorId: data.sensorId, value: data.value.value, date: data.date, location: data.location, sensorType: data.sensorType, unit: data.unit, description: data.description};
        return await this.sensorService.createUnoptimizedSensorReading([sensorReading]);
    }
    @Get('readOptimized/:sensorId/:interval')
    async getSensorData(@Param() params: ReadSensorRouteParams) {
        return await this.sensorService.getSensorReadings(params.sensorId,params.interval);
    }
    @Get('readUnoptimized/:sensorId/:interval')
    async getUnoptimizedSensorData(@Param() params: ReadSensorRouteParams) {
        return await this.sensorService.getUnoptimizedSensorReadingByInterval(params.sensorId,params.interval);
    }
    @Get('averageUnoptimized/:sensorId')
    async getSensorAverage(@Param('sensorId') sensorId: string) {
        return await this.sensorService.getAverageSensorUnoptimizedReadings(sensorId);
    }
    @Get('averageOptimized/:sensorId')
    async getSensorAverageOptimized(@Param('sensorId') sensorId: string) {
        return await this.sensorService.getAverageOptimizedSensorReadings(sensorId);
    }
    @Get('readUniqueSensor')
    async getUniqueSensorIdsOptimized() {
        return await this.sensorService.getUniqueSensorOptimized();
    }
    @Get('optimizedCollectionStats')
    async getOptimizedCollectionStats() {
        return await this.sensorService.getOptimizedCollectionStats();
    }
    @Get('unoptimizedCollectionStats')
    async getUnoptimizedCollectionStats() {
        return await this.sensorService.getUnoptimizedCollectionStats();
    }
    @Delete('deleteOptimized/:sensorId/:interval')
    async deleteSensorData(@Param() params: DeleteSensorReadingDto) {
        return await this.sensorService.deleteReadingsByIntervalOptimized(params.interval,params.sensorId);
    }
    @Delete('deleteUnoptimized/:sensorId/:interval')
    async deleteSensorDataUnoptimized(@Param() params: DeleteSensorReadingDto) {
        return await this.sensorService.deleteReadingsByIntervalUnoptimized(params.interval,params.sensorId);
    }
    @Get('benchmarkWrite')
    async benchmarkWrite() {
        return await this.sensorService.seedBenchmark();
    }
    
}
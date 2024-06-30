import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SensorReading } from './sensor.reading.schema';

export type SensorReadingsDocument = HydratedDocument<SensorReadings>;

@Schema({collection: 'sensorreadings'})
export class SensorReadings {
@Prop({ required: true, index: true})
sensorId: string;
@Prop({ required: true,index: true})
interval: string
@Prop({ required: true })
location: string;
@Prop({ required: true })
sensorType: string;
@Prop({ required: true })
unit: string;
@Prop({ required: true })
description: string;
// bucket pattern
@Prop({ required: true })
values:SensorReading[];
// computed pattern
@Prop({ required: true })
avg : number;
@Prop({ required: true })
date: Date;
}

export const SensorReadingsSchema = SchemaFactory.createForClass(SensorReadings);
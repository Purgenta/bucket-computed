import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SensorReadingDocument = HydratedDocument<SensorReading>;

@Schema({collection: 'sensorreading'})
export class SensorReading {
@Prop({ required: true, index: true})
sensorId: string;
@Prop({ required: true })
location: string;
@Prop({ required: true })
sensorType: string;
@Prop({ required: true })
unit: string;
@Prop({ required: true })
description: string;
@Prop({ required: true })
value: number;
@Prop({ required: true })
date: Date;
}

export const SensorReadingSchema = SchemaFactory.createForClass(SensorReading);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SensorReadingDocument = HydratedDocument<SensorReading>;

@Schema()
export class SensorReading {
@Prop()
date: Date;
@Prop()
value: number;

}


export const SensorReadingSchema = SchemaFactory.createForClass(SensorReading);
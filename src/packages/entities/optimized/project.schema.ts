import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
export type ProjectDocument = HydratedDocument<Project>;
@Schema()
export class Project {
    @Prop({ required: true })
    name: string;
    @Prop({required: true})
    description: string;
    @Prop({required: true})
    owner: string;
    @Prop({required: false, default: Date.now})
    createdAt: Date;
    @Prop({required: false, default: Date.now})
    updated: Date;
    @Prop({required: false, default: []})
    sensors: Sensor[];

}
export const ProjectSchema = SchemaFactory.createForClass(Project);
class Sensor {
    sensorId: string;
    sensorType: string;
    name: string;
}
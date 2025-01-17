import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
@Schema()
export class User  {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: Date.now })
    createdAt: Date;
    @Prop({default: [], type: [{name: String, id: String}]})
    projects: EmbeddedProject[]
}
export class EmbeddedProject {
    name: string;
    id: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
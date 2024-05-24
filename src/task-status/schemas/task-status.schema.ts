import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskStatusDocument = HydratedDocument<TaskStatus>;

@Schema()
export class TaskStatus {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  rank: number;
}

export const TaskStatusSchema = SchemaFactory.createForClass(TaskStatus);

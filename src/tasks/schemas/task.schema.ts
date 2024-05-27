import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TaskStatus } from '../../task-status/schemas/task-status.schema';
import { User } from '../../users/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  due: Date;

  @Prop({ required: false })
  pictureUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskStatus',
    required: true,
  })
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

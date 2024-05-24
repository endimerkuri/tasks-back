import { Module } from '@nestjs/common';
import { TaskStatusService } from './task-status.service';

@Module({
  providers: [TaskStatusService],
})
export class TaskStatusModule {}

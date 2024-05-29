import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { TaskStatus } from '../task-status/schemas/task-status.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<Task>,

    @InjectModel(TaskStatus.name)
    private taskStatusModel: Model<TaskStatus>,
  ) {}

  async create(payload: {
    title: string;
    due: Date;
    statusId: string;
    description?: string;
    pictureUrl?: string;
    user: User;
    label?: string;
    labelColor?: string;
  }): Promise<Task> {
    const status = await this.taskStatusModel.findById(payload.statusId);
    if (!status) {
      throw new NotFoundException('Status not found');
    }

    const newTask = new this.taskModel({
      ...payload,
      status,
    });
    await newTask.save();

    return newTask;
  }

  async edit(
    id: string,
    payload: {
      title?: string;
      due?: Date;
      statusId?: string;
      description?: string;
      pictureUrl?: string;
      label?: string;
      labelColor?: string;
      user: User;
    },
  ): Promise<Task> {
    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    let status = await this.taskStatusModel.findById(task.status);

    if (payload.statusId) {
      status = await this.taskStatusModel.findById(payload.statusId);
    }

    if (!status) {
      throw new NotFoundException('Status not found');
    }

    task.title = payload.title || task.title;
    task.due = payload.due || task.due;
    task.status = status;
    task.description = payload.description || task.description;
    task.pictureUrl = payload.pictureUrl ?? task.pictureUrl;
    task.label = payload.label || task.label;
    task.labelColor = payload.labelColor || task.labelColor;

    await task.save();
    return task;
  }

  async delete(id: string): Promise<void> {
    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.taskModel.deleteOne({ _id: id });
  }

  async findGrouped(): Promise<any> {
    const tasksStatuses = (await this.taskStatusModel
      .find()
      .sort({ rank: 1 })
      .lean()) as any;

    for (const status of tasksStatuses) {
      const task = await this.taskModel
        .find({ status: status._id })
        .sort({ _id: -1 })
        .lean();
      status.tasks = task;
    }

    return tasksStatuses;
  }
}

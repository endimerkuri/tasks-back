import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { normalizeResponse } from 'src/util/helpers/response.helpers';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Request() req) {
    const groupedTasks = await this.tasksService.findGrouped();
    return normalizeResponse({
      groupedTasks,
      _message: 'Tasks retrieved successfully!',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body()
    payload: {
      title: string;
      description: string;
      due: Date;
      statusId: string;
      pictureUrl?: string;
    },
  ) {
    const { user } = req.user;
    const task = await this.tasksService.create({ ...payload, user });
    return normalizeResponse({ task, _message: 'Task created successfully!' });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async edit(
    @Request() req,
    @Body()
    payload: {
      title?: string;
      description?: string;
      due?: Date;
      statusId?: string;
      pictureUrl?: string;
    },
    @Param('id')
    id: string,
  ) {
    const { user } = req.user;
    const task = await this.tasksService.edit(id, { ...payload, user });
    return normalizeResponse({ task, _message: 'Task updated successfully!' });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    await this.tasksService.delete(id);
    return normalizeResponse({ _message: 'Task deleted successfully!' });
  }
}
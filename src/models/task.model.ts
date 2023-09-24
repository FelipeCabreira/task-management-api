import mongoose from 'mongoose';
import { ITask, TaskModel } from '../types/database/task.type.js';
import { Model } from '../types/utils.type.js';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: [100, 'task title is too long'],
  },
  description: {
    type: String,
    maxlength: [500, 'task description is too long'],
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Model.Board,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Model.User,
  },
  assignees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Model.User,
    },
  ],
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Model.Tag,
    },
  ],
});

export const taskModel = mongoose.model<ITask, TaskModel>(Model.Task, taskSchema);

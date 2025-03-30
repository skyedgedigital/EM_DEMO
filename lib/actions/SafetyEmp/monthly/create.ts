'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import MonthlyTask, {
  IMonthlyTask,
} from '@/lib/models/safetyPanel/emp/monthlyTask.model';
import mongoose from 'mongoose';

export interface IAddMonthlyTaskResponse extends IMonthlyTask {
  _id: mongoose.Types.ObjectId;
  _createdAt: Date;
  _updatedAt: Date;
}
const createMonthlyTask = async (
  monthlyTask: IMonthlyTask
): Promise<ApiResponse<IAddMonthlyTaskResponse>> => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;

  try {
    if (
      !monthlyTask.eventDate ||
      !monthlyTask.assignedTo ||
      !monthlyTask.eventName
    ) {
      throw new Error('Insufficient data to create new monthly task');
    }
    const docObj = new MonthlyTask(monthlyTask);
    const result = await docObj.save();
    console.log('NEW CREATED MONTHLY TASK', result);
    if (!result) {
      throw new Error('Failed to Create new monthly task');
    }
    return {
      success: true,
      status: 200,
      message: 'Monthly task created successfully',
      data: JSON.parse(JSON.stringify(result)),
      error: null,
    };
  } catch (err) {
    return {
      status: 500,
      message: 'Internal Server Error',
      error: JSON.stringify(err),
      success: false,
      data: null,
    };
  }
};

export { createMonthlyTask };

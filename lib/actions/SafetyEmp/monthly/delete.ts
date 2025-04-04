'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import MonthlyTask from '@/lib/models/safetyPanel/emp/monthlyTask.model';

const deleteMonthlyTask = async (eventId: any): Promise<ApiResponse<any>> => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const result = await MonthlyTask.deleteOne({ _id: eventId });
    if (!result) {
      throw new Error('Failed to delete task');
    }
    return {
      success: true,
      status: 200,
      message: 'Task Deleted',
      error: null,
      data: null,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      status: 500,
      message: 'Internal Server Error',
      error: JSON.stringify(err),
      data: null,
    };
  }
};
export { deleteMonthlyTask };

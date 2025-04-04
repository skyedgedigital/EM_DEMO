'use server';

import handleDBConnection from '@/lib/database';
import MonthlyTask, {
  EventStatusTypes,
} from '@/lib/models/safetyPanel/emp/monthlyTask.model';
import { EventStatusNames } from '../../../models/safetyPanel/emp/monthlyTask.model';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import { IMonthlyTaskResponse } from './fetch';

const updateMonthlyTask = async (eventId: any, dataString: string) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const dataObj = JSON.parse(dataString);
    const [day, month, year] = dataObj.date.split('-');
    const result = await MonthlyTask.findOneAndUpdate(
      {
        _id: eventId,
      },
      {
        day: day,
        month: month,
        year: year,
        event: dataObj.event,
      },
      {
        new: true,
      }
    );
    return {
      success: true,
      status: 200,
      message: 'Event Updated',
      data: JSON.stringify(result),
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      status: 500,
      message: 'Internal Server Error',
      err: JSON.stringify(err),
    };
  }
};
const updateMonthlyTaskStatusById = async (
  taskId: string,
  status: EventStatusTypes
): Promise<ApiResponse<IMonthlyTaskResponse>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!status || !EventStatusNames.includes(status)) {
      throw new Error('Noa a valid status to update');
    }

    const updated = await MonthlyTask.findByIdAndUpdate(
      taskId,
      {
        status,
      },
      {
        new: true,
      }
    );

    console.log('UPDATED TaSK status', updated);

    if (!updated) {
      throw new Error('Failed to upload task status, Please try later');
    }

    return {
      error: null,
      status: 201,
      message: 'Status updated successfully',
      success: true,
      data: JSON.parse(JSON.stringify(updated)),
    };
  } catch (error) {
    return {
      error: JSON.parse(JSON.stringify(error)),
      status: 201,
      message: 'Status updated successfully',
      success: true,
      data: null,
    };
  }
};
export { updateMonthlyTask, updateMonthlyTaskStatusById };

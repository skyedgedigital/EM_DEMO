'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import MonthlyTask, {
  IMonthlyTask,
} from '@/lib/models/safetyPanel/emp/monthlyTask.model';

export interface IMonthlyTaskResponse extends IMonthlyTask {
  _id: string;
}
const fetchMonthlyTask = async (): Promise<
  ApiResponse<IMonthlyTaskResponse[]>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const result = await MonthlyTask.find({});
    console.log('ALL MONTHLY TASK', result);
    return {
      success: true,
      status: 200,
      message: 'Events Fetched',
      data: await JSON.parse(JSON.stringify(result)),
      error: null,
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

const fetchMonthlyTaskOnSpecificDate = async (
  specifiedDate: string
): Promise<ApiResponse<IMonthlyTaskResponse[]>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const date = new Date(specifiedDate);
    const tasks = await MonthlyTask.find({
      eventDate: date,
    }).sort({ eventDate: -1 });
    console.log('All tasks', tasks);
    if (!tasks) {
      throw new Error('Failed to fetch tasks for this date, Please try later');
    }
    return {
      success: true,
      status: 200,
      message: 'All tasks fetched successfully',
      data: await JSON.parse(JSON.stringify(tasks)),
      error: null,
    };
  } catch (error) {
    console.log('TASK FETCH FAILED', error);
    return {
      success: false,
      status: 200,
      message: 'All tasks fetched successfully',
      data: null,
      error: error,
    };
  }
};
export { fetchMonthlyTask, fetchMonthlyTaskOnSpecificDate };

'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import { IEmployeeData } from '@/interfaces/HR/EmployeeData.interface';
import handleDBConnection from '@/lib/database';
import EmployeeData from '@/lib/models/HR/EmployeeData.model';
import MonthlyTask, {
  IMonthlyTask,
} from '@/lib/models/safetyPanel/emp/monthlyTask.model';
import mongoose from 'mongoose';

export interface IMonthlyTaskResponse {
  eventDate: IMonthlyTask['eventDate'];
  eventName: IMonthlyTask['eventName'];
  status: IMonthlyTask['status'];
  eventDescription: IMonthlyTask['eventDescription'];
  _id: string;
  assignedTo: Partial<IEmployeeData>;
}
const fetchMonthlyTask = async (): Promise<
  ApiResponse<IMonthlyTaskResponse[]>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const result = await MonthlyTask.find({});
    // console.log('ALL MONTHLY TASK', result);
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
    })
      .populate('assignedTo', 'name code')
      .sort({ eventDate: -1 });
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
      error: JSON.parse(JSON.stringify(error)),
    };
  }
};
export { fetchMonthlyTask, fetchMonthlyTaskOnSpecificDate };

'use server';

import handleDBConnection from '@/lib/database';
import MonthlyTask from '@/lib/models/safetyPanel/emp/monthlyTask.model';

const deleteMonthlyTask = async (eventId: any) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const result = await MonthlyTask.deleteOne({ _id: eventId });
    return {
      success: true,
      status: 200,
      message: 'Event Deleted',
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
export { deleteMonthlyTask };

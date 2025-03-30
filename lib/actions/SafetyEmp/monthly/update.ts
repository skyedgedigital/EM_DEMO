'use server';

import handleDBConnection from '@/lib/database';
import MonthlyTask from '@/lib/models/safetyPanel/emp/monthlyTask.model';

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
export { updateMonthlyTask };

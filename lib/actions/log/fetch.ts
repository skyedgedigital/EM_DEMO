'use server';
import handleDBConnection from '@/lib/database';
import LogModel from '@/lib/models/log/log.model';

export const fetchLogs = async (page: number = 1, limit: number = 10) => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const skip = (page - 1) * limit;

    const [logs, totalCount] = await Promise.all([
      LogModel.find({}).sort({ date: -1 }).skip(skip).limit(limit),
      LogModel.countDocuments({}),
    ]);

    if (!logs) {
      throw new Error('Logs not found');
    }

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: `logs fetched successfully`,
        data: {
          logs,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
        },
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 500,
        message:
          error instanceof Error ? error.message : 'Something went wrong',
        error,
        data: null,
      })
    );
  }
};

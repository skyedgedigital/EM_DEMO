'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import LogModel, { actionTypeNames, ILogs } from '@/lib/models/log/log.model';

interface IFetchLogs {
  panel: ILogs['panel'];
  actionType: ILogs['actionType'];
  message: ILogs['message'];
  date: ILogs['date']; // Date as ISO string
  actionBy: string;
  collection: ILogs['collection'];
  documentId: string;
  _id: string;
}
export interface IFetchLogsResponse {
  logs: IFetchLogs[];
  totalPages: number;
  currentPage: number;
}
export const fetchLogs = async (
  page: number = 1,
  limit: number = 10,
  query: {
    actionType?: ILogs['actionType'];
    panel?: ILogs['panel'];
    dateRange?: { from?: Date; to?: Date };
  } = {}
): Promise<ApiResponse<IFetchLogsResponse>> => {
  try {
    console.log('QUERY', query);
    console.log('PAGE', page);
    console.log('LIMIT', limit);

    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const skip = (page - 1) * limit;

    const { actionType, panel, dateRange } = query;

    const query_build: {
      actionType?: string;
      panel?: ILogs['panel'];
      date?: { $gte: Date; $lte: Date };
    } = {};
    if (
      actionType &&
      actionType ===
        (actionTypeNames[0] || actionTypeNames[1] || actionTypeNames[2])
    ) {
      query_build.actionType = actionType;
    }
    if (panel) {
      query_build.panel = panel;
    }
    if (dateRange && dateRange.from && dateRange.to) {
      query_build.date = { $gte: dateRange.from, $lte: dateRange.to };
    }

    const [logs, totalCount] = await Promise.all([
      LogModel.find({ ...query_build })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
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

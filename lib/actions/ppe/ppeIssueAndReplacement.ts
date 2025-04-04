'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import PpeIssueAndReplacement from '@/lib/models/safetyPanel/ppe/ppeIssueAndReplacement.model';

const genPpeIssueAndReplacement = async (dataString: string) => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const data = JSON.parse(dataString);
    const docObj = new PpeIssueAndReplacement({
      ...data,
    });
    const resp = await docObj.save();
    return {
      success: true,
      status: 200,
      message: 'House Keeping Audit Created Successfully',
      data: JSON.stringify(resp),
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: 'An Error Occurred',
    };
  }
};

const deletePpeIssueAndReplacement = async (id: any) => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const resp = await PpeIssueAndReplacement.findByIdAndDelete(id);
    return {
      success: true,
      status: 200,
      message: 'House Keeping Audit Deleted Successfully',
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: 'An Error Occurred',
    };
  }
};

const fetchPpeIssueAndReplacement = async () => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const resp = await PpeIssueAndReplacement.find().sort({
      createdAt: -1,
    });
    return {
      success: true,
      status: 200,
      message: 'House Keeping Audit Fetched Successfully',
      data: JSON.stringify(resp),
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: 'An Error Occurred',
    };
  }
};

const fetchNextRevNoByDocumentNumber = async (
  docNo: string
): Promise<ApiResponse<{ nextRevNo: number }>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    if (!docNo || docNo.trim().length === 0) {
      // throw new Error('invalid docNo');
      return {
        success: true,
        status: 200,
        message: 'Successfully fetched next rev no',
        data: await JSON.parse(JSON.stringify({ nextRevNo: 1 })),
        error: null,
      };
    }

    const currentRevNo = await PpeIssueAndReplacement.countDocuments({
      docNo,
    });

    return {
      success: true,
      status: 200,
      message: 'Successfully fetched next rev no',
      data: await JSON.parse(JSON.stringify({ nextRevNo: currentRevNo + 1 })),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: error instanceof Error ? error.message : 'An Error Occurred',
      data: null,
      error: error,
    };
  }
};

export {
  genPpeIssueAndReplacement,
  deletePpeIssueAndReplacement,
  fetchPpeIssueAndReplacement,
  fetchNextRevNoByDocumentNumber,
};

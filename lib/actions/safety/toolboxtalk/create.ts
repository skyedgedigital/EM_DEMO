'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import ToolboxTalkModel, {
  IToolboxTalk,
  IToolboxTalkVersion,
  IToolboxTalkVersionWithRevNo,
} from '@/lib/models/Safety/toolboxtalk.model';
import mongoose from 'mongoose';

interface Response {
  documentNo: string;
  currentVersion: number;
  programName?: string;
}

export const createToolboxTalk = async (
  params: IToolboxTalk & IToolboxTalkVersion
): Promise<ApiResponse<Response>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    // Validate work order ID format and uploadedBy format
    if (
      !mongoose.Types.ObjectId.isValid(params.workOrderNo) ||
      !mongoose.Types.ObjectId.isValid(params.uploadedBy)
    ) {
      throw new Error('Invalid MongoID');
    }

    // Check for existing document
    const existingDocument = await ToolboxTalkModel.findOne({
      documentNo: params.documentNo,
      vendorCode: params.vendorCode,
    });

    const newVersion: IToolboxTalkVersionWithRevNo = {
      attendance: {
        attendanceFileURL: params.attendance.attendanceFileURL,
        permitNo: params.attendance?.permitNo || '',
        remarks: params.attendance?.remarks || '',
      },
      points: params.points,
      questions: params.questions,
      records: params.records,
      revNo: 1,
      supervisor: params.supervisor,
      workOrderNo: new mongoose.Types.ObjectId(params.workOrderNo),
      feedback: params.feedback,
      siteFileURL: params?.siteFileURL || '',
      suggestion: params?.suggestion || '',
      totalEmployees: params?.totalEmployees || 0,
      totalManPower: params?.totalManPower || 0,
      totalSafety: params?.totalSafety || 0,
      totalWorkers: params?.totalWorkers || 0,
      uploadDate: params?.uploadDate || new Date(),
      uploadedBy: new mongoose.Types.ObjectId(params.uploadedBy),
    };

    // let result;
    let responseData: Response;

    if (existingDocument) {
      // Add new version to existing document
      newVersion.revNo = existingDocument.currentVersion + 1;
      const result = await ToolboxTalkModel.findByIdAndUpdate(
        existingDocument._id,
        {
          $push: { versions: newVersion },
          $inc: { currentVersion: 1 },
          $set: { effectiveDate: params.effectiveDate },
        },
        { new: true }
      );
      if (!result) {
        throw new Error('Failed to create/update toolbox talk');
      }
      responseData = {
        documentNo: result.documentNo,
        currentVersion: result.currentVersion,
        programName: result.programName,
      };
    } else {
      // Create new document
      const result = await ToolboxTalkModel.create({
        documentNo: params.documentNo,
        contractorRepresentative: params?.contractorRepresentative || '',
        effectiveDate: params.effectiveDate,
        programName: params?.programName || '',
        safetyRepresentative: params?.safetyRepresentative || '',
        vendorCode: params.vendorCode,
        currentVersion: 1,
        versions: [newVersion],
      });
      if (!result) {
        throw new Error('Failed to create/update toolbox talk');
      }
      responseData = {
        documentNo: result.documentNo,
        currentVersion: result.currentVersion,
        programName: result.programName,
      };
    }

    return {
      success: true,
      status: 201,
      message: existingDocument
        ? 'Version updated successfully'
        : 'New toolbox talk created',
      data: responseData,
      error: null,
    };
  } catch (error) {
    console.error('Toolbox Talk Error:', error);
    return {
      success: false,
      status: 500,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    };
  }
};

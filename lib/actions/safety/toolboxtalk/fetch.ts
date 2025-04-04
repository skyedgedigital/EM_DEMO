'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import ToolboxTalkModel, {
  IToolboxTalk,
  IToolboxTalkVersion,
} from '@/lib/models/Safety/toolboxtalk.model';

export interface ICurrentVersionToolboxTalk {
  documentNo: string;
  programName?: string;
  effectiveDate: Date;
  vendorCode: string;
  safetyRepresentative?: string;
  contractorRepresentative?: string;
  currentVersion: number;
}

export const fetchCurrentVersionOfAllToolboxTalk = async (): Promise<
  ApiResponse<ICurrentVersionToolboxTalk[]>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const documents = await ToolboxTalkModel.find({})
      .sort({ effectiveDate: -1 })
      .lean();
    if (!documents) {
      throw new Error('No Toolboxtalks found!');
    }

    const data = documents.map((doc) => {
      return {
        documentNo: doc.documentNo,
        currentVersion: doc.currentVersion,
        effectiveDate: doc.effectiveDate,
        programName: doc.programName,
        vendorCode: doc.vendorCode,
        safetyRepresentative: doc.safetyRepresentative,
        contractorRepresentative: doc.contractorRepresentative,
      };
    });
    return {
      success: true,
      status: 200,
      message: 'data fetched successfully',
      data: await JSON.parse(JSON.stringify(data)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching document', error);
    return {
      success: false,
      status: 404,
      message: error instanceof Error ? error.message : 'Something went wrong',
      data: null,
      error,
    };
  }
};

export const getLatestVersionOfToolboxTalk = async (
  documentNo: string
): Promise<ApiResponse<IToolboxTalk>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!documentNo.trim()) {
      throw new Error(`provide valid document no`);
    }

    const currentDocument = await ToolboxTalkModel.findOne({
      documentNo,
    }).lean();
    if (!currentDocument) {
      throw new Error(`No document exist for documentNumber: ${documentNo}`);
    }

    const currentVersion = currentDocument.versions.find(
      (version) => version.revNo === currentDocument.currentVersion
    );

    if (!currentVersion) {
      throw new Error('No versions of this document exist');
    }

    // const data: ICurrentVersionToolboxTalk & IToolboxTalkVersion = {
    //   documentNo: currentDocument.documentNo,
    //   currentVersion: currentDocument.currentVersion,
    //   effectiveDate: currentDocument.effectiveDate,
    //   programName: currentDocument.programName,
    //   vendorCode: currentDocument.vendorCode,
    //   safetyRepresentative: currentDocument.safetyRepresentative,
    //   contractorRepresentative: currentDocument.contractorRepresentative,
    //   attendance: currentVersion.attendance,
    //   feedback: currentVersion.feedback,
    //   questions: currentVersion.questions,
    //   points: currentVersion.points,
    //   records: currentVersion.records,
    //   supervisor: currentVersion.supervisor,
    //   uploadDate: currentVersion.uploadDate,
    //   workOrderNo: currentVersion.workOrderNo,
    //   siteFileURL: currentVersion.siteFileURL,
    //   uploadedBy: currentVersion.uploadedBy,
    //   suggestion: currentVersion.suggestion,
    //   totalEmployees: currentVersion.totalEmployees,
    //   totalManPower: currentVersion.totalManPower,
    //   totalSafety: currentVersion.totalSafety,
    //   totalWorkers: currentVersion.totalWorkers,
    // };

    const data: IToolboxTalk = {
      documentNo: currentDocument.documentNo,
      currentVersion: currentDocument.currentVersion,
      effectiveDate: currentDocument.effectiveDate,
      programName: currentDocument.programName,
      vendorCode: currentDocument.vendorCode,
      contractorRepresentative: currentDocument.contractorRepresentative,
      safetyRepresentative: currentDocument.safetyRepresentative,
      versions: [currentVersion],
    };

    return {
      success: true,
      status: 200,
      message: 'data fetched successfully',
      data,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching document', error);
    return {
      success: false,
      status: 404,
      message: error instanceof Error ? error.message : 'Something went wrong',
      data: null,
      error,
    };
  }
};

export const getAllVersionsOfToolboxTalk = async (
  documentNo: string
): Promise<ApiResponse<IToolboxTalk>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!documentNo.trim()) {
      throw new Error(`provide valid document no`);
    }

    const document = await ToolboxTalkModel.findOne({ documentNo }).lean();
    if (!document) {
      throw new Error(`No document exist for documentNumber: ${documentNo}`);
    }

    return {
      success: true,
      status: 200,
      message: 'data fetched successfully',
      data: document,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching document', error);
    return {
      success: false,
      status: 404,
      message: error instanceof Error ? error.message : 'Something went wrong',
      data: null,
      error,
    };
  }
};

export const getNextToolboxTalkVersion = async (
  documentNo: string
): Promise<
  ApiResponse<{
    nextVersion: number;
  }>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!documentNo) {
      throw new Error('Please Provide Valid document No');
    }
    // if (!documentNo) throw new Error(`provide valid document no`);

    const existingDocument = await ToolboxTalkModel.findOne({
      documentNo,
    }).select('currentVersion');

    const nextVersion = existingDocument
      ? existingDocument.currentVersion + 1
      : 1;

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Next version calculated successfully',
        data: { nextVersion },
        error: null,
      })
    );
  } catch (error) {
    console.error('Error getting next version:', error);
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 404,
        message:
          error instanceof Error ? error.message : 'Something went wrong',
        data: null,
        error: error,
      })
    );
  }
};

export const getToolboxTalkByVersionAndDoc = async (
  documentNo: string,
  versionNo: number
): Promise<ApiResponse<IToolboxTalk>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!documentNo.trim() || isNaN(versionNo)) {
      throw new Error(`provide valid document and version no`);
    }

    const currentDocument = await ToolboxTalkModel.findOne({
      documentNo,
    }).lean();
    if (!currentDocument) {
      throw new Error(`No document exist for documentNumber: ${documentNo}`);
    }

    const currentVersion = currentDocument.versions.find(
      (version) => version.revNo === versionNo
    );

    if (!currentVersion) {
      throw new Error('No versions of this document exist');
    }

    const data: IToolboxTalk = {
      documentNo: currentDocument.documentNo,
      currentVersion: currentDocument.currentVersion,
      effectiveDate: currentDocument.effectiveDate,
      programName: currentDocument.programName,
      vendorCode: currentDocument.vendorCode,
      contractorRepresentative: currentDocument.contractorRepresentative,
      safetyRepresentative: currentDocument.safetyRepresentative,
      versions: [currentVersion],
    };

    return {
      success: true,
      status: 200,
      message: 'data fetched successfully',
      data,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching document', error);
    return {
      success: false,
      status: 404,
      message: error instanceof Error ? error.message : 'Something went wrong',
      data: null,
      error,
    };
  }
};

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import { DocumentModel, Version } from '@/lib/models/Safety/document.model';

export const fetchCurrentVersionOfAllDocuments = async (): Promise<
  ApiResponse<
    {
      category: 'General' | 'SOP/JHA/HIRA';
      documentType: string;
      currentVersionDocument: Version;
    }[]
  >
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const documents = await DocumentModel.find({});
    if (!documents) {
      throw new Error('No documents found!');
    }

    const data = documents.map((document) => {
      return {
        category: document.category,
        documentType: document.documentType,
        currentVersionDocument: document.versions.find(
          (item) => item.versionNumber === document.currentVersion
        ),
      };
    });
    return {
      success: true,
      status: 200,
      message: 'data fetched successfully',
      data,
      error: null,
    };
  } catch (error) {
    console.error('Error getting next version:', error);
    return {
      success: false,
      status: 404,
      message: 'Failed to calculate next version',
      data: null,
      error: error instanceof Error ? error.message : 'Something went wrong',
    };
  }
};

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import DocumentModel, {
  DocNameTypes,
  IVersion,
} from '@/lib/models/Safety/document.model';

export interface ICurrentVersionOfAllDocumentsResponse {
  category: 'General' | 'SOP/JHA/HIRA';
  documentType: DocNameTypes;
  currentVersionDocument: IVersion;
}
export const fetchCurrentVersionOfAllDocuments = async (): Promise<
  ApiResponse<ICurrentVersionOfAllDocumentsResponse[]>
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
        documentType: document.documentType as DocNameTypes,
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

export const getCurrentDocumentByDocTypeandCategory = async (
  category: string,
  documentType: DocNameTypes
): Promise<
  ApiResponse<{
    category: 'General' | 'SOP/JHA/HIRA';
    documentType: DocNameTypes;
    currentVersionDocument: IVersion;
  }>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!category || !documentType) {
      throw new Error('Category and documentType is required');
    }

    const document = await DocumentModel.findOne({
      category,
      documentType,
    });

    if (!document) {
      throw new Error('No document found!');
    }
    return {
      success: true,
      status: 200,
      message: 'data fetched successfully',
      data: {
        category: document.category,
        documentType: document.documentType as DocNameTypes,
        currentVersionDocument: document.versions.find(
          (item) => item.versionNumber === document.currentVersion
        ),
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching document:', error);
    return {
      success: false,
      status: 404,
      message: error instanceof Error ? error.message : 'Something went wrong',
      data: null,
      error,
    };
  }
};

export const getAllVersionsOfDocument = async (
  category: string,
  documentType: DocNameTypes
): Promise<
  ApiResponse<{
    category: 'General' | 'SOP/JHA/HIRA';
    documentType: DocNameTypes;
    versions: IVersion[];
  }>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!category || !documentType) {
      throw new Error('Category and documentType is required');
    }

    const document = await DocumentModel.findOne({
      category,
      documentType,
    });
    if (!document) {
      throw new Error('No Document found');
    }
    return {
      success: true,
      status: 200,
      message: 'data fetched successfully',
      data: {
        category: document.category,
        documentType: document.documentType as DocNameTypes,
        versions: document.versions,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching documents:', error);
    return {
      success: false,
      status: 404,
      message: error instanceof Error ? error.message : 'Something went wrong',
      data: null,
      error,
    };
  }
};

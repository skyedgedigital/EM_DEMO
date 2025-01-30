'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import DocumentModel, {
  DocNameTypes,
  DocsCategoryTypes,
  IDocument,
  IVersion,
} from '@/lib/models/Safety/document.model';
import { Types } from 'mongoose';

export interface ICurrentVersionOfAllDocumentsResponse {
  category: DocsCategoryTypes;
  documentType: DocNameTypes;
  currentVersionDocument: IVersion;
}
export const fetchCurrentVersionOfAllDocuments = async (): Promise<
  ApiResponse<ICurrentVersionOfAllDocumentsResponse[]>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const documents = await DocumentModel.find({}).lean();
    console.log('Documents', documents);
    if (!documents) {
      throw new Error('No documents found!');
    }

    const data: ICurrentVersionOfAllDocumentsResponse[] = documents.map(
      (document) => {
        return {
          category: document.category as DocsCategoryTypes,
          documentType: document.documentType as DocNameTypes,
          currentVersionDocument: document.versions.find(
            (item) => item.versionNumber === document.currentVersion
          ),
        };
      }
    );
    console.log(data);
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

export const getCurrentDocumentByDocTypeAndCategory = async (
  category: DocsCategoryTypes,
  documentType: DocNameTypes
): Promise<
  ApiResponse<{
    category: DocsCategoryTypes;
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
        category: document.category as DocsCategoryTypes,
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
  category: DocsCategoryTypes,
  documentType: DocNameTypes
): Promise<ApiResponse<IDocument>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!category || !documentType) {
      throw new Error('Category and documentType is required');
    }

    const document = await DocumentModel.findOne({
      category,
      documentType,
    }).lean();
    console.log('DOC', document);
    // if (document && document) {
    //   return {
    //     data: null,
    //     error: null,
    //     message: 'Unexpected error occurred, Please try later',
    //     status: 500,
    //     success: false,
    //   };
    // }
    if (!document) {
      return {
        data: null,
        error: null,
        message: 'No Uploaded Documents found',
        status: 200,
        success: true,
      };
    }
    const sortedDoc = {
      ...document,
      versions: document.versions.sort(
        (a, b) => b.versionNumber - a.versionNumber
      ),
    };
    return {
      success: true,
      status: 200,
      message: `${documentType} fetched successfully`,
      data: JSON.parse(JSON.stringify(document)),
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
export const getNextVersion = async (
  category: DocsCategoryTypes,
  documentType: DocNameTypes
): Promise<
  ApiResponse<{
    nextVersion: number;
  }>
> => {
  console.log(category, documentType);
  try {
    if (!category || !documentType) {
      throw new Error('Category and document type are required');
    }

    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const existingDocument = await DocumentModel.findOne({
      category,
      documentType,
    }).select('currentVersion');

    const nextVersion = existingDocument
      ? existingDocument.currentVersion + 1
      : 1;
    console.log('next version', nextVersion);
    return {
      success: true,
      status: 200,
      message: 'Next version calculated successfully',
      data: { nextVersion },
      error: null,
    };
  } catch (error) {
    console.error('Error getting next version:', error);
    return {
      success: false,
      status: 404,
      message: error instanceof Error ? error.message : 'Something went wrong',
      data: null,
      error: error,
    };
  }
};

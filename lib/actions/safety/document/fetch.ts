'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import DocumentModel, {
  DocNameTypes,
  DocsCategoryTypes,
  IVersion,
} from '@/lib/models/Safety/document.model';
import { Types } from 'mongoose';

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
    console.log('Documents', documents);
    if (!documents) {
      throw new Error('No documents found!');
    }

    const data: ICurrentVersionOfAllDocumentsResponse[] = [
      {
        documentType: 'Safety Manual',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Appointment Letter',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Campaign Calendar',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Emergency Preparedness Plan',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Employee List',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'First-aider Certificate',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Objective & Target',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Organization Structure',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'PPE Replacement Policy',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Policy & Principal',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Safety Plan',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Safety Professional Certificate',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Sponsorship Letter',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Tool Replacement Policy',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'Top Management Certificate',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL: '',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'General',
      },
      {
        documentType: 'HIRA',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL:
            'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=cbcf08a7-eeac-4025-8fd7-88a1fddb4339',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'SOP/JHA/HIRA',
      },
      {
        documentType: 'JHA',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL: '',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'SOP/JHA/HIRA',
      },
      {
        documentType: 'SOP',
        currentVersionDocument: {
          uploadDate: new Date(),
          documentURL: '',
          versionNumber: 1,
          uploadedBy: new Types.ObjectId(),
        },
        category: 'SOP/JHA/HIRA',
      },
    ];
    // const data = documents.map((document) => {
    //   return {
    //     category: document.category,
    //     documentType: document.documentType as DocNameTypes,
    //     currentVersionDocument: document.versions.find(
    //       (item) => item.versionNumber === document.currentVersion
    //     ),
    //   };
    // });
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
): Promise<
  ApiResponse<{
    category: DocsCategoryTypes;
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
        category: document.category as DocsCategoryTypes,
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

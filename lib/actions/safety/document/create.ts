// import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import { DocumentModel } from '@/lib/models/Safety/document.model';
import mongoose from 'mongoose';
// import { getServerSession } from 'next-auth';

interface CreateDocumentParams {
  category: 'General' | 'SOP/JHA/HIRA';
  documentType: string;
  documentURL: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadDate: Date;
}

export const createDocument = async (
  params: CreateDocumentParams
): Promise<ApiResponse<CreateDocumentParams>> => {
  try {
    /**
     * if this server session doesn't work, I will have to get the userId from the client
     * some error is being thrown in the frontend when using this server action, when I add this line
     */
    // const session = await getServerSession(authOptions);
    // console.log(session, 'HAHAHAHAH');
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const { category, documentType, documentURL, uploadDate, uploadedBy } =
      params;
    if (!category || !documentType || !documentURL || !uploadedBy) {
      throw new Error('Invalid values');
    }

    const existingDocument = await DocumentModel.findOne({
      category,
      documentType,
    });

    if (existingDocument) {
      throw new Error('Document already exist');
    }

    const document = await DocumentModel.create({
      category,
      documentType,
      versions: [
        {
          documentURL,
          uploadDate,
          versionNumber: 1,
          uploadedBy,
        },
      ],
    });
    if (!document) {
      throw new Error(`Can't create document`);
    }
    return {
      success: true,
      status: 201,
      message: `Document successfully created!`,
      data: {
        category: document.category,
        documentType: document.documentType,
        documentURL: document.versions[0].documentURL,
        uploadDate: document.versions[0].uploadDate,
        uploadedBy: document.versions[0].uploadedBy,
      },
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      status: 404,
      message: error.message || 'Something went wrong!',
      data: null,
      error: null,
    };
  }
};

export const updateDocument = async (
  params: CreateDocumentParams
): Promise<ApiResponse<CreateDocumentParams>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const { category, documentType, documentURL, uploadDate, uploadedBy } =
      params;
    if (
      !category ||
      !documentType ||
      !documentURL ||
      !uploadDate ||
      !uploadedBy
    ) {
      throw new Error('Invalid Values');
    }
    const existingDocument = await DocumentModel.findOne({
      category,
      documentType,
    });
    if (!existingDocument) {
      throw new Error('Document does not exist');
    }

    const lastUpdatedVersion =
      existingDocument.versions[existingDocument.versions.length - 1];

    const newVersion = {
      versionNumber: lastUpdatedVersion.versionNumber + 1,
      documentURL,
      uploadDate,
      uploadedBy,
    };
    existingDocument.versions.push(newVersion);
    existingDocument.currentVersion = newVersion.versionNumber;
    const updatedDoc = await existingDocument.save();
    if (!updatedDoc) throw new Error("Couldn't update the document");
    await existingDocument.save();
    return {
      success: true,
      status: 201,
      message: `Document successfully updated!`,
      data: {
        category: updatedDoc.category,
        documentType: updatedDoc.documentType,
        documentURL: newVersion.documentURL,
        uploadDate: newVersion.uploadDate,
        uploadedBy: newVersion.uploadedBy,
      },
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      status: 404,
      message: error.message || 'Something went wrong!',
      data: null,
      error: null,
    };
  }
};

export const getNextVersion = async (
  category: string,
  documentType: string
) => {
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

    return {
      success: true,
      message: 'Next version calculated successfully',
      data: { nextVersion },
      error: null,
    };
  } catch (error) {
    console.error('Error getting next version:', error);
    return {
      success: false,
      message: 'Failed to calculate next version',
      data: null,
      error: error instanceof Error ? error.message : 'Something went wrong',
    };
  }
};

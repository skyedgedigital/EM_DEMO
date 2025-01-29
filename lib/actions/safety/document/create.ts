import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import DocumentModel from '@/lib/models/Safety/document.model';
import mongoose from 'mongoose';

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
      const lastUpdatedVersion = existingDocument.versions.find(
        (version) => version.versionNumber === document.currentVersion
      );

      if (!lastUpdatedVersion) {
        throw new Error('Version mismatch');
      }

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
    }

    // currentVersion will be automatically assigned
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
      error: error,
    };
  }
};


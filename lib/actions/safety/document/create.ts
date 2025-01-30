'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import DocumentModel, {
  DocNameTypes,
  DocsCategoryTypes,
} from '@/lib/models/Safety/document.model';
import mongoose from 'mongoose';

interface CreateDocumentParams {
  category: DocsCategoryTypes;
  documentType: DocNameTypes;
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
      throw new Error('Insufficient values');
    }
    console.log(
      'XXXXXXXXXXXXXXXXXXXXX',
      category,
      documentType,
      documentURL,
      uploadDate,
      uploadedBy
    );
    console.log('-------------------');
    const existingDocument = await DocumentModel.findOne({
      category,
      documentType,
    });
    console.log('existing doc', existingDocument);
    if (existingDocument) {
      const lastUpdatedVersion = existingDocument.versions.find(
        (version) => version.versionNumber === existingDocument.currentVersion
      );
      console.log('lastUpdatedVersion', lastUpdatedVersion);

      if (!lastUpdatedVersion) {
        console.log('lastUpdatedVersion', lastUpdatedVersion);

        throw new Error('Version mismatch');
      }

      const newVersion = {
        versionNumber: lastUpdatedVersion.versionNumber + 1,
        documentURL,
        uploadDate,
        uploadedBy,
      };
      console.log('newVersion', newVersion);

      existingDocument.versions.push(newVersion);
      existingDocument.currentVersion = newVersion.versionNumber;
      const updatedDoc = await existingDocument.save();
      console.log('updatedDoc', updatedDoc);
      if (!updatedDoc) throw new Error("Couldn't update the document");
      return {
        success: true,
        status: 201,
        message: `Document successfully updated!`,
        data: {
          category: updatedDoc.category as DocsCategoryTypes,
          documentType: updatedDoc.documentType as DocNameTypes,
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
        category: document.category as DocsCategoryTypes,
        documentType: document.documentType as DocNameTypes,
        documentURL: document.versions[0].documentURL,
        uploadDate: document.versions[0].uploadDate,
        uploadedBy: document.versions[0].uploadedBy,
      },
      error: null,
    };
  } catch (error) {
    console.log('error', error);

    return {
      success: false,
      status: 404,
      message: error.message || 'Something went wrong!',
      data: null,
      error: error,
    };
  }
};

import mongoose, { Schema } from 'mongoose';

export const docsEnums = [
  'Safety Manual',
  'Policy & Principal',
  'Organization Structure',
  'Safety Plan',
  'Objective & Target',
  'PPE Replacement Policy',
  'Tool Replacement Policy',
  'Campaign Calendar',
  'Emergency Preparedness Plan',
  'Employee List',
  'First-aider Certificate',
  'Safety Professional Certificate',
  'Top Management Certificate',
  'Appointment Letter',
  'Sponsorship Letter',
  'SOP',
  'JHA',
  'HIRA',
] as const;
export type DocNameTypes = (typeof docsEnums)[number];

export interface IVersion {
  versionNumber: number;
  documentURL: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadDate: Date;
}

export interface IDocument {
  category: 'General' | 'SOP/JHA/HIRA';
  documentType: string;
  versions?: IVersion[];
  currentVersion: number;
}

const VersionSchema: mongoose.Schema<IVersion> = new mongoose.Schema({
  versionNumber: {
    type: Number,
    required: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  documentURL: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: new Date(),
  },
});

const DocumentSchema: mongoose.Schema<IDocument> = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['General', 'SOP/JHA/HIRA'],
    },
    documentType: {
      type: String,
      required: true,
      enum: docsEnums,
    },
    versions: [VersionSchema],
    currentVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const DocumentModel: mongoose.Model<IDocument> =
  mongoose.models?.Document ||
  mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;

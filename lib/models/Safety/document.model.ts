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
export interface Version {
  versionNumber: number;
  documentURL: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadDate: Date;
}

export interface Document {
  category: 'General' | 'SOP/JHA/HIRA';
  documentType: string;
  versions?: Version[];
  currentVersion: number;
}

const VersionSchema: mongoose.Schema<Version> = new mongoose.Schema({
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

const DocumentSchema: mongoose.Schema<Document> = new mongoose.Schema(
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

export const DocumentModel: mongoose.Model<Document> =
  mongoose.models.Document ||
  mongoose.model<Document>('Document', DocumentSchema);

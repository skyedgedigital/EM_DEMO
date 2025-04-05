import mongoose from 'mongoose';

export const panelTypeNames = [
  'Safety',
  'HR',
  'FLEET-MANAGER',
  'ACCOUNTANT',
  'DRIVER',
  'ADMIN',
] as const;
export type panelTypes = (typeof panelTypeNames)[number];
export const actionTypeNames = ['CREATE', 'UPDATE', 'DELETE'] as const;
export type actionTypes = (typeof actionTypeNames)[number];
import { collectionValues, MongoDBCollections } from '@/dbCollections';

export interface ILogs {
  panel: panelTypes;
  actionType: string;
  message: string;
  date: Date;
  actionBy: mongoose.Types.ObjectId;
  collection: MongoDBCollections;
  documentId: mongoose.Types.ObjectId;
}

const LogSchema: mongoose.Schema<ILogs> = new mongoose.Schema({
  collection: {
    type: String,
    required: true,
    enum: collectionValues,
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  panel: {
    type: String,
    required: true,
    enum: panelTypeNames,
  },
  actionType: {
    type: String,
    required: true,
    enum: actionTypeNames,
  },
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  date: {
    type: Date,
    required: true,
  },
});

const LogModel: mongoose.Model<ILogs> =
  mongoose.models?.Log || mongoose.model('Log', LogSchema);

export default LogModel;

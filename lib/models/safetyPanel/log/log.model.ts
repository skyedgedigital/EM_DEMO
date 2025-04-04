import mongoose from 'mongoose';

export const actionTypeNames = ['CREATE', 'UPDATE', 'DELETE'] as const;
export type actionTypes = (typeof actionTypeNames)[number];

export const modelTypeNames = ['DOCUMENT', 'TOOLBOXTALK', 'TRAINING'];
export type modelTypes = (typeof modelTypeNames)[number];

export interface ILog {
  collection: modelTypes;
  documentId: string;
  message: string;
  action: actionTypes;
}

const LogSchema: mongoose.Schema<ILog> = new mongoose.Schema({
  collection: {
    type: String,
    required: true,
    enum: modelTypeNames,
  },
  documentId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: actionTypeNames,
  },
});

const LogModel: mongoose.Model<ILog> =
  mongoose.models.Log || mongoose.model('Log', LogSchema);

export default LogModel;

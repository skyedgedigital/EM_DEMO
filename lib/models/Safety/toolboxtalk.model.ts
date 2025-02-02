import mongoose, { Schema } from 'mongoose';

interface IQA {
  question: string;
  answer?: string;
}

interface IRecord {
  action: string;
  when?: string;
  date: Date;
  status: string;
}

interface IPoint {
  point: string;
  color?: string;
}

export interface IToolboxTalkVersion {
  questions: IQA[];
  revNo: number;
  workOrderNo: mongoose.Types.ObjectId;
  totalManPower?: number;
  totalWorkers?: number;
  totalEmployees?: number;
  totalSafety?: number;
  records: IRecord[];
  uploadDate?: Date;
  suggestion?: string;
  feedback?: string;
  points: IPoint[];
  attendanceFileURL: string;
  siteFileURL?: string;
  supervisor: 'Company Supervisor' | 'Line Manager';
}

export interface IToolboxTalk {
  documentNo: string;
  programName?: string;
  effectiveDate: Date;
  vendorCode: string;
  safetyRepresentative?: string;
  contractorRepresentative?: string;
  versions: IToolboxTalkVersion[];
  currentVersion: number;
}

const QASchema: mongoose.Schema<IQA> = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: '',
  },
});

const RecordSchema: mongoose.Schema<IRecord> = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: String,
    required: true,
  },
  when: {
    type: String,
    default: '',
  },
});

const PointSchema: mongoose.Schema<IPoint> = new mongoose.Schema({
  color: {
    type: String,
    default: '',
  },
  point: {
    type: String,
    required: true,
  },
});

const ToolboxTalkVersionSchema: mongoose.Schema<IToolboxTalkVersion> =
  new mongoose.Schema({
    questions: [QASchema],
    revNo: {
      type: Number,
      required: true,
    },
    workOrderNo: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'WorkOrderHr',
    },
    totalEmployees: {
      type: Number,
      default: 0,
    },
    totalManPower: {
      type: Number,
      default: 0,
    },
    totalWorkers: {
      type: Number,
      default: 0,
    },
    totalSafety: {
      type: Number,
      default: 0,
    },
    uploadDate: {
      type: Date,
      default: new Date(),
    },
    feedback: {
      type: String,
      default: '',
    },
    suggestion: {
      type: String,
      default: '',
    },
    records: [RecordSchema],
    points: [PointSchema],
    attendanceFileURL: {
      type: String,
      required: true,
    },
    siteFileURL: {
      type: String,
      default: '',
    },
    supervisor: {
      type: String,
      enum: ['Company Supervisor', 'Line Manager'],
      required: true,
    },
  });

const ToolboxTalkSchema: mongoose.Schema<IToolboxTalk> = new mongoose.Schema({
  contractorRepresentative: {
    type: String,
    required: true,
    default: '',
  },
  documentNo: {
    type: String,
    required: true,
    unique: true,
  },
  effectiveDate: {
    type: Date,
    required: true,
  },
  programName: {
    type: String,
    default: '',
  },
  safetyRepresentative: {
    type: String,
    default: '',
  },
  vendorCode: {
    type: String,
    required: true,
  },
  currentVersion: {
    type: Number,
    required: true,
  },
  versions: [ToolboxTalkVersionSchema],
});

const ToolboxTalkModel: mongoose.Model<IToolboxTalk> =
  mongoose.models.ToolboxTalk ||
  mongoose.model<IToolboxTalk>('ToolboxTalk', ToolboxTalkSchema);

export default ToolboxTalkModel;

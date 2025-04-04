import mongoose, { Schema } from 'mongoose';
export const SupervisorNames = ['Company Supervisor', 'Line Manager'] as const;
export type SupervisorNamesTypes = (typeof SupervisorNames)[number];
export interface IQA {
  question: string;
  answer?: string;
}

export const RecordStatusNames = [
  'Issued',
  'In Progress',
  'Completed',
  'Rejected',
] as const;
export type RecordStatusNamesTypes = (typeof RecordStatusNames)[number];

export const StripColorsNames = ['orange', 'red', 'purple', 'green'] as const;
export type StripColorNameTypes = (typeof StripColorsNames)[number];
interface IRecord {
  actionBy: string;
  when?: string;
  targetDate?: Date;
  status: RecordStatusNamesTypes;
  item?: string;
}

export interface IStripPoint {
  point: string;
  color?: StripColorNameTypes;
  pointFileUrl?: string;
  stripeNo: number;
  location?: string;
}

export interface IAttendance {
  permitNo?: string;
  remarks?: string;
  attendanceFileURL: string;
}

export interface IToolboxTalkVersion {
  questions: IQA[];
  workOrderNo: mongoose.Types.ObjectId;
  totalManPower?: number;
  totalWorkers?: number;
  totalEngineers?: number;
  totalSupervisors?: number;
  totalSafety?: number;
  totalEmployees?: number;
  records: IRecord[];
  uploadDate?: Date;
  suggestion?: string;
  feedback: IQA[];
  points: IStripPoint[];
  attendance: IAttendance;
  siteFileURL?: string;
  supervisor: SupervisorNamesTypes;
  uploadedBy: mongoose.Types.ObjectId;
}

export interface IToolboxTalk {
  documentNo: string;
  programName: string;
  effectiveDate: Date;
  vendorCode: string;
  safetyRepresentative: string;
  contractorRepresentative: string;
  versions: IToolboxTalkVersionWithRevNo[];
  currentVersion: number;
}

export interface IToolboxTalkVersionWithRevNo extends IToolboxTalkVersion {
  revNo: number;
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
  actionBy: {
    type: String,
    required: true,
  },
  targetDate: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: String,
    enum: RecordStatusNames,
    required: true,
    default: 'Issued',
  },
  when: {
    type: String,
    default: '',
  },
  item: {
    type: String,
    default: '',
  },
});

const PointSchema: mongoose.Schema<IStripPoint> = new mongoose.Schema({
  color: {
    type: String,
    enum: StripColorsNames,
    default: 'orange',
  },
  point: {
    type: String,
    default: '',
  },
  pointFileUrl: {
    type: String,
    default: '',
  },
  stripeNo: {
    type: Number,
  },
  location: {
    type: String,
  },
});

const AttendanceSchema: mongoose.Schema<IAttendance> = new mongoose.Schema({
  attendanceFileURL: {
    type: String,
    required: true,
  },
  permitNo: {
    type: String,
    default: '',
  },
  remarks: {
    type: String,
    default: '',
  },
});

const ToolboxTalkVersionSchema: mongoose.Schema<IToolboxTalkVersionWithRevNo> =
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
    totalEngineers: {
      type: Number,
      default: 0,
    },
    totalSupervisors: {
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
    feedback: [QASchema],
    suggestion: {
      type: String,
      default: '',
    },
    records: [RecordSchema],
    points: [PointSchema],
    attendance: AttendanceSchema,
    siteFileURL: {
      type: String,
      default: '',
    },
    supervisor: {
      type: String,
      enum: SupervisorNames,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Employee',
    },
  });

const ToolboxTalkSchema: mongoose.Schema<IToolboxTalk> = new mongoose.Schema({
  contractorRepresentative: {
    type: String,
    required: true,
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
    required: true,
  },
  safetyRepresentative: {
    type: String,
    required: true,
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
  mongoose.models?.ToolboxTalk ||
  mongoose.model<IToolboxTalk>('ToolboxTalk', ToolboxTalkSchema);

export default ToolboxTalkModel;

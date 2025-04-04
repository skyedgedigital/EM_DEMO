import mongoose, { Schema } from 'mongoose';

// interface IMonthlyTask {
//   day: string;
//   month: string;
//   year: string;
//   event: string;
// }

export const EventStatusNames = [
  'pending',
  'in progress',
  'completed',
] as const;
export type EventStatusTypes = (typeof EventStatusNames)[number];

export interface IMonthlyTask {
  eventDate: Date;
  eventName: string;
  assignedTo: mongoose.Types.ObjectId;
  status: EventStatusTypes;
  eventDescription: string;
}

const MonthlyTaskSchema: mongoose.Schema<IMonthlyTask> = new Schema(
  {
    eventDate: { type: Date, required: true },
    eventName: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
      default: '',
    },
    assignedTo: {
      ref: 'EmployeeData',
      required: true,
      type: Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: EventStatusNames,
      default: 'pending',
    },
  },

  { timestamps: true }
);
MonthlyTaskSchema.index(
  { eventDate: 1, event: 1, assignedTo: 1 },
  { unique: true }
);
const MonthlyTask: mongoose.Model<IMonthlyTask> =
  mongoose.models?.MonthlyTask ||
  mongoose.model('MonthlyTask', MonthlyTaskSchema);

export default MonthlyTask;

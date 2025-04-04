import mongoose from 'mongoose';

export interface IBillingItem {
  item: mongoose.Types.ObjectId;
  vehicleNumber: string;
  unit?: 'minutes' | 'hours' | 'days' | 'months' | 'fixed' | 'shift' | 'ot';
  hours: number;
  itemCosting: number;
  startTime: string;
  endTime: string;
  _id?: mongoose.Types.ObjectId | string;
  serviceNumber: string;
}
export interface IBill extends mongoose.Document {
  workOrder: mongoose.Schema.Types.ObjectId;
  department: mongoose.Schema.Types.ObjectId;
  engineer: mongoose.Schema.Types.ObjectId;
  date: Date;
  billNumber: string;
  location?: string;
  workDescription?: string;
  //   file?: string;
  status?: 'approved' | 'pending' | 'unsigned' | 'generated';
  verified: boolean;
  items: IBillingItem[];
  totalCost: number;
  signed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  invoiceCreated?: boolean;
}

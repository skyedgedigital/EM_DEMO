import mongoose from 'mongoose';

export interface IBillingWorkOrder extends mongoose.Document {
  workOrderNumber: string;
  workDescription: string;
  workOrderValue: number;
  workOrderValidity: Date;
  shiftStatus: boolean;
  workOrderBalance: number;
  createdAt: Date;
  updatedAt: Date;
  units: [string];
}

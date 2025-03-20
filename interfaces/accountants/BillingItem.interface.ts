import mongoose from 'mongoose';
import { IBillingWorkOrder } from './BillingWorkOrder.interface';

export interface IBillingItem extends mongoose.Document {
  itemNumber: number;
  itemName?: string;
  hsnNo?: string;
  itemPrice: number;
  workOrder: mongoose.PopulatedDoc<IBillingWorkOrder>;
  createdAt: Date;
  updatedAt: Date;
  serviceNumber: String;
}

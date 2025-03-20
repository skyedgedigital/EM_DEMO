import mongoose from 'mongoose';
import { IBillingItem } from '@/interfaces/accountants/BillingItem.interface';

const BillingItemSchema: mongoose.Schema<IBillingItem> = new mongoose.Schema({
  itemNumber: {
    type: Number,
    required: true,
  },
  itemName: {
    type: String,
  },
  hsnNo: {
    type: String,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  workOrder: {
    type: mongoose.Types.ObjectId,
    ref: 'BillingWorkOrder',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  serviceNumber: {
    type: String,
    default: '',
  },
});

BillingItemSchema.pre<IBillingItem>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const BillingItem: mongoose.Model<IBillingItem> =
  mongoose.models?.BillingItem ||
  mongoose.model('BillingItem', BillingItemSchema);

export default BillingItem;

export { BillingItemSchema };

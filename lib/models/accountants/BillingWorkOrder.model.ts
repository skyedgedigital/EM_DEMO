import { IBillingWorkOrder } from '@/interfaces/accountants/BillingWorkOrder.interface';
import mongoose from 'mongoose';

const BillingWorkOrderSchema: mongoose.Schema<IBillingWorkOrder> =
  new mongoose.Schema({
    workOrderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    workDescription: {
      type: String,
      required: true,
      default: 'No description provided.',
      trim: true,
    },
    workOrderValue: {
      type: Number,
      required: true,
      default: 0,
    },
    workOrderValidity: {
      type: Date,
      required: true,
    },
    workOrderBalance: {
      type: Number,
      required: true,
    },
    units: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

BillingWorkOrderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const BillingWorkOrder: mongoose.Model<IBillingWorkOrder> =
  mongoose.models?.BillingWorkOrder ||
  mongoose.model('BillingWorkOrder', BillingWorkOrderSchema);

export default BillingWorkOrder;

export { BillingWorkOrderSchema };

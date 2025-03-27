import mongoose from 'mongoose';
import { IBillingWorkOrderItem } from '@/interfaces/accountants/IBillingWorkOrderItem.interface';

const BillingWorkOrderItemSchema: mongoose.Schema<IBillingWorkOrderItem> =
  new mongoose.Schema({
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

BillingWorkOrderItemSchema.pre<IBillingWorkOrderItem>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const BillingWorkOrderItem: mongoose.Model<IBillingWorkOrderItem> =
  mongoose.models?.BillingWorkOrderItem ||
  mongoose.model('BillingWorkOrderItem', BillingWorkOrderItemSchema);

export default BillingWorkOrderItem;

export { BillingWorkOrderItemSchema };

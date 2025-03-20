import mongoose from 'mongoose';
import IBillingInvoice from '@/interfaces/accountants/BillingInvoice.interface';

const BillingInvoiceSchema: mongoose.Schema<IBillingInvoice> =
  new mongoose.Schema({
    invoiceId: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    invoiceLink: {
      type: String,
    },
    InvoiceData: {
      type: String,
    },
    SesNo: {
      type: String,
      trim: true,
    },
    DoNo: {
      type: String,
      trim: true,
    },
    //   chalans: [String],
    pdfLink: {
      type: String,
      trim: true,
    },
    summaryLink: {
      type: String,
      trim: true,
    },
    //   mergedItems: {
    //     type: String,
    //   },
    TaxNumber: {
      type: String,
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

const BillingInvoice: mongoose.Model<IBillingInvoice> =
  mongoose.models?.BillingInvoice ||
  mongoose.model('BillingInvoice', BillingInvoiceSchema);

export default BillingInvoice;

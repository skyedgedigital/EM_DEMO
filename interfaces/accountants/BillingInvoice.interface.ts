import { Document, Schema, Types } from 'mongoose';

interface IBillingInvoice extends Document {
  invoiceNumber: string;
  invoiceLink?: string;
  InvoiceData?: string;
  SesNo?: string;
  DoNo?: string;
  bills?:string;
  pdfLink: string;
  summaryLink: string;
  createdAt: Date;
  updatedAt: Date;
  invoiceId: string;
  mergedItems: string;
  TaxNumber?: string;
}

export default IBillingInvoice;

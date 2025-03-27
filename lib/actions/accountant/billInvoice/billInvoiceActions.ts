import { createBillInvoice } from './create';
import {
  checkIfBillingInvoiceExists,
  deleteBillInvoiceById,
  generateContinuousBillInvoiceNumber,
  generateContinuousTaxBillInvoiceNumber,
  getAllBillingInvoices,
  getBillingInvoiceByInvoiceId,
  getLastTwoBillInvoiceNumbers,
  updateBillInvoice,
  updateBillInvoiceNumber,
  uploadBillingInvoiceToFireBase,
  uploadBillingSummaryToFireBase,
} from './invoice';
import { getBillingDistinguishedSummaryData } from './summaryPdf';

export const billingInvoiceActions = {
  CREATE: { createBillInvoice },
  GET: {
    getBillingSummaryPdfData: getBillingDistinguishedSummaryData,
    getBillingInvoiceByInvoiceId,
    getAllBillingInvoices,
    getLatestBillInvoiceNumber: generateContinuousBillInvoiceNumber,
    generateContinuousTaxBillInvoiceNumber,
    getLastTwoBillInvoiceNumbers,
  },
  CHECK: {
    checkIfBillingInvoiceExists,
  },
  UPDATE: {
    updateBillInvoice,
    updateBillInvoiceNumber,
  },
  UPLOAD: {
    uploadBillingInvoiceToFireBase,
    uploadBillingSummaryToFireBase,
  },
  DELETE: { deleteBillInvoiceById },
};

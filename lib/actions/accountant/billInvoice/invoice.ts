'use server';

import handleDBConnection from '@/lib/database';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import { revalidatePath } from 'next/cache';
import BillingInvoice from '@/lib/models/accountants/BillingInvoice.model';

const checkIfBillingInvoiceExists = async (
  billNumbers: string[],
  invoiceNumber: string
): Promise<ApiResponse<any>> => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;

  const sortedChalanNumbers = billNumbers.sort().join(',').trim();
  try {
    const result = await BillingInvoice.findOne({
      $or: [
        { invoiceId: sortedChalanNumbers },
        { invoiceNumber: invoiceNumber },
      ],
    });
    console.log('Found invoice', result);
    if (!result) {
      return {
        success: true,
        message: 'No matching BillingInvoice Found',
        status: 200,
        error: null,
        data: null,
      };
    }
    const message =
      result.invoiceId === sortedChalanNumbers
        ? 'BillingInvoice already exists with this chalan'
        : 'BillingInvoice number already exists';
    return {
      success: false,
      message,
      data: JSON.stringify(result),
      status: 400,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected Error occurred, Please try later',
      error: JSON.stringify(err),
      status: 500,
      data: null,
    };
  }
};

const getBillingInvoiceByInvoiceId = async (
  invoiceId: string
): Promise<ApiResponse<any>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const ifExists = await BillingInvoice.findOne({
      invoiceId: invoiceId,
    });
    if (!ifExists) {
      return {
        success: false,
        status: 404,
        message: `The BillingInvoice ${invoiceId} not exists`,
        error: null,
        data: null,
      };
    }
    const doc = await BillingInvoice.findOne({
      invoiceId: invoiceId,
    });
    // .populate({
    //   path: "items",
    //   populate: {
    //     path: "item",
    //     model: "Item",
    //   },
    // });
    console.log(doc);
    return {
      success: true,
      message: `BillingInvoice ${invoiceId} fetched`,
      status: 200,
      data: JSON.stringify(doc),
      error: null,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: 'Unexpected error occurred,Please try later',
      status: 500,
      error: JSON.stringify(err),
      data: null,
    };
  }
};

const updateBillInvoice = async (invoiceData): Promise<ApiResponse<any>> => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const { invoiceNumber, SESNo, DONo, TaxNumber } = JSON.parse(invoiceData);

    // Find the invoice by invoiceNumber
    let invoice = await BillingInvoice.findOne({ invoiceNumber });

    if (invoice) {
      // If the invoice exists, update SESNo and DONo
      invoice.SesNo = SESNo;
      invoice.DoNo = DONo;
      invoice.TaxNumber = TaxNumber;
      invoice = await invoice.save();
      return {
        success: true,
        message: 'BillingInvoice updated',
        data: JSON.stringify(invoice),
        status: 200,
        error: null,
      };
    } else {
      // If the invoice doesn't exist, create a new one
      return {
        success: false,
        message: "BillingInvoice doesn't exist",
        status: 400,
        error: null,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        'Unexpected error occurred,Failed to update BillingInvoice, Please try later',
      status: 500,
      error: JSON.stringify(error),
      data: null,
    };
  }
};

const updateBillInvoiceNumber = async (
  invoiceData
): Promise<ApiResponse<any>> => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const { invoiceNumber, invoiceId } = JSON.parse(invoiceData);

    // Find the invoice by invoiceNumber
    let invoice = await BillingInvoice.findOne({ invoiceId });
    const currentYear = new Date().getFullYear();

    // Construct the new invoiceNumber in the format SE/currentYear/currentYear+1/invoiceNumber
    const formattedInvoiceNumber = `SE/24-25/${invoiceNumber}`;

    if (invoice) {
      // If the invoice exists, update SESNo and DONo
      invoice.invoiceNumber = formattedInvoiceNumber;
      invoice = await invoice.save();
      return {
        success: true,
        message: 'BillingInvoice SES and DO updated',
        data: JSON.stringify(invoice),
        status: 200,
        error: null,
      };
    } else {
      // If the invoice doesn't exist, create a new one
      return {
        success: false,
        message: "BillingInvoice doesn't exist",
        status: 400,
        error: null,
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'Unexpected error occurred,Please try later',
      status: 500,
      error: JSON.stringify(error),
      data: null,
    };
  }
};

const getAllBillingInvoices = async (): Promise<ApiResponse<any>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const docs = await BillingInvoice.find({}).sort({ createdAt: -1 });

    return {
      success: true,
      message: `All Invoices fetched`,
      status: 200,
      data: JSON.stringify(docs),
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error occurred,Please try later',
      status: 500,
      error: JSON.stringify(err),
      data: null,
    };
  }
};

const uploadBillingInvoiceToFireBase = async (
  invoiceId,
  downloadUrl: string
): Promise<ApiResponse<any>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const filter = {
      invoiceId: invoiceId,
    };
    const update = {
      pdfLink: downloadUrl,
    };
    const found = await BillingInvoice.findOne({
      invoiceId,
    });
    console.log('Found BillingInvoice', found);
    const result = await BillingInvoice.findOneAndUpdate(filter, update, {
      new: true,
    });
    return {
      success: true,
      message: `BillingInvoice uploaded to Firebase Storage`,
      status: 200,
      data: JSON.stringify(result),
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error occurred,Please try later',
      status: 500,
      error: JSON.stringify(err),
      data: null,
    };
  }
};

const uploadBillingSummaryToFireBase = async (
  invoiceId,
  downloadUrl: string
) => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const filter = {
      invoiceId: invoiceId,
    };
    const update = {
      summaryLink: downloadUrl,
    };
    const found = await BillingInvoice.findOne({
      invoiceId,
    });
    console.log('Found BillingInvoice', found);
    const result = await BillingInvoice.findOneAndUpdate(filter, update, {
      new: true,
    });
    return {
      success: true,
      message: `BillingInvoice uploaded to Firebase Storage`,
      status: 200,
      data: JSON.stringify(result),
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unexpected error occurred,Please try later',
      status: 500,
      error: JSON.stringify(err),
      data: null,
    };
  }
};

function incrementInvoiceNumber(invoiceNumber) {
  // Split the string by '/' to get the last part (which contains the number with leading zeros)
  console.log(invoiceNumber);
  const parts = invoiceNumber.split('/');
  console.log(parts);

  // Extract the last part which is the numeric part (e.g., "0001")
  const lastPart = parts[parts.length - 1];

  // Extract the number from the last part and convert it to an integer
  console.log(lastPart);
  const lastPartNumber = lastPart;
  console.log(lastPartNumber.length);
  const lastNumber = parseInt(lastPartNumber, 10);
  console.log(lastNumber);

  // Increment the number by 1
  const incrementedNumber = lastNumber + 1;

  // Pad the incremented number with leading zeros to match the original format
  const paddedNumber = String(incrementedNumber).padStart(lastPart.length, '0');

  // Return only the incremented and padded number as a string
  return paddedNumber;
}

const generateContinuousBillInvoiceNumber = async (): Promise<
  ApiResponse<any>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const allInvoiceNumbers = (
      await BillingInvoice.find().select('invoiceNumber')
    ).toSorted(
      (a, b) =>
        Number(a.invoiceNumber.split('/')[2]) -
        Number(b.invoiceNumber.split('/')[2])
    );

    if (!allInvoiceNumbers) {
      return {
        success: false,
        status: 200,
        message:
          'Failed to look invoice numbers in data base to generate new invoice numbers, Please try later',
        data: null,
        error: null,
      };
    }
    console.log('ALL SORTED INVOICE NUMBER', allInvoiceNumbers);
    let latestInvoiceNumber: number;
    if (allInvoiceNumbers.length === 0) {
      latestInvoiceNumber = 1;
    } else {
      latestInvoiceNumber =
        Number(
          allInvoiceNumbers?.[allInvoiceNumbers.length - 1].invoiceNumber.split(
            '/'
          )[2]
        ) + 1;
    }
    console.log('latest invoice number', latestInvoiceNumber);
    if (!latestInvoiceNumber) {
      return {
        success: false,
        status: 200,
        message: 'Failed to generate next invoice number, Please try later',
        data: null,
        error: null,
      };
    }
    return {
      success: true,
      status: 200,
      message: 'Latest Doc Number recieved',
      data: JSON.stringify(latestInvoiceNumber),
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: 'Unexpected error occurred,Please try later',
      error: JSON.stringify(err),
      data: null,
    };
  }
};
const generateContinuousTaxBillInvoiceNumber = async (): Promise<
  ApiResponse<any>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const allTaxInvoiceNumbers = (
      await BillingInvoice.find().select('TaxNumber')
    ).toSorted((a, b) => {
      if (a.TaxNumber && b.TaxNumber)
        return (
          Number(a.TaxNumber.split('/')[2]) - Number(b.TaxNumber.split('/')[2])
        );
    });

    if (!allTaxInvoiceNumbers) {
      return {
        success: false,
        status: 200,
        message:
          'Failed to look invoice numbers in data base to generate new invoice numbers, Please try later',
        data: null,
        error: null,
      };
    }
    console.log('ALL SORTED TAX INVOICE NUMBER', allTaxInvoiceNumbers);
    const latestTaxInvoiceNumber =
      Number(
        allTaxInvoiceNumbers?.[allTaxInvoiceNumbers.length - 1].TaxNumber.split(
          '/'
        )[2]
      ) + 1;
    console.log('latest invoice number', latestTaxInvoiceNumber);
    if (!latestTaxInvoiceNumber) {
      return {
        success: false,
        status: 200,
        message: 'Failed to generate next invoice number, Please try later',
        data: null,
        error: null,
      };
    }
    return {
      success: true,
      status: 200,
      message: 'Latest Doc Number recieved',
      data: JSON.stringify(latestTaxInvoiceNumber),
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: 'Unexpected error occurred,Please try later',
      error: JSON.stringify(err),
      data: null,
    };
  }
};

const deleteBillInvoiceById = async (id: string) => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const invoiceExist = await BillingInvoice.find({ _id: id });
    if (!invoiceExist) {
      revalidatePath('/fleetmanager/invoice-management');
      return {
        success: false,
        status: 200,
        message: 'Invoice does not exist',
        data: null,
        error: null,
      };
    }

    await BillingInvoice.deleteOne({ _id: id });
    revalidatePath('/fleetmanager/invoice-management');
    return {
      success: true,
      status: 204,
      message: 'Invoice Successfully Deleted',
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: err.message || 'Unexpected error occurred,Please try later',
      error: JSON.stringify(err),
      data: null,
    };
  }
};

const getLastTwoBillInvoiceNumbers = async (): Promise<ApiResponse<any>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const latestDoc = await BillingInvoice.find()
      .sort({
        _id: -1,
      })
      .select('invoiceNumber')
      .limit(2);
    console.log('LATEST TWO DOC', latestDoc);

    return {
      success: true,
      status: 200,
      message: 'Latest Doc Number recieved',
      data: JSON.stringify(latestDoc),
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: 'Unexpected error occurred,Please try later',
      error: JSON.stringify(err),
      data: null,
    };
  }
};
export {
  updateBillInvoice,
  checkIfBillingInvoiceExists,
  getBillingInvoiceByInvoiceId,
  // uploadInvoicePDFToS3,
  // uploadInvoiceSummaryPDFToS3,
  updateBillInvoiceNumber,
  getAllBillingInvoices,
  uploadBillingInvoiceToFireBase,
  uploadBillingSummaryToFireBase,
  generateContinuousBillInvoiceNumber,
  deleteBillInvoiceById,
  getLastTwoBillInvoiceNumbers,
  generateContinuousTaxBillInvoiceNumber,
};

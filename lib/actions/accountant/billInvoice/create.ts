// THIS FUNCTION FUNCTIONALITY SEQUENCE
// - TAKING ARRAY OF CHALAN NUMBERS AND CHECKING ANY IF INVOICE ALREADY EXISTS
// - FETCHING ALL CHALANS
// - PREPARING ITEMS ARRAY FROM ALL CHALANS
// - GENERATING CONTINUOUS INVOICE NUMBER
// - SAVING INVOICE
// - UPDATING ALL CHALANS WITH NEWLY CREATED INVOICE NUMBER
// - RETURNING NEWLY CREATED INVOICE

import { IBill } from '@/interfaces/accountants/Bill.interface';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import BillingInvoice from '@/lib/models/accountants/BillingInvoice.model';
interface MergedItems {
  itemCost: number;
  unit: string;
  hours: number;
}
// ***** this is mergeChalan() function renamed as createBillInvoice()
export const createBillInvoice = async (
  submittedBill: IBill,
  invoiceNumber: string
): Promise<ApiResponse<any>> => {
  try {
    const billNumbers = [submittedBill.billNumber];
    // MERGED ITEMS KO RAKHNE WALA ARRAY
    const mergedItems: { [itemId: string]: MergedItems } = {};

    // chalans.forEach((chalan) => {
    // Iterate over items in the current chalan
    submittedBill.items.forEach((item) => {
      const itemId = item.item.toString();
      const itemCosting = item.itemCosting || 0;
      const unit = item.unit;
      const hours = item.hours || 0;

      // Check if the itemId already exists in mergedItems
      if (mergedItems[itemId] && mergedItems[itemId].unit === unit) {
        // If it exists, update the totalCost and other properties as needed
        mergedItems[itemId].itemCost += itemCosting;
        mergedItems[itemId].unit = unit; // Assuming unit is the same across all entries
        mergedItems[itemId].hours += hours; // Accumulate hours if needed
      } else {
        // If it doesn't exist, create a new entry for the itemId
        mergedItems[itemId] = {
          itemCost: itemCosting,
          unit: unit,
          hours: hours,
        };
      }
    });
    // });

    // You can now use itemGroups to handle duplicates with different units

    // console.log(billNumbers);

    const sortedChalanNumbers = billNumbers.sort().join(',').trim();

    const invoiceObj = new BillingInvoice({
      invoiceId: sortedChalanNumbers,
      invoiceNumber: `SE/24-25/${invoiceNumber}`,
      mergedItems: JSON.stringify(mergedItems),
      chalans: billNumbers,
    });

    const invoiceSaved = await invoiceObj.save();

    console.log(invoiceSaved);

    return {
      success: true,
      status: 200,
      message: 'Bill saved succesfully',
      data: JSON.stringify(invoiceSaved),
      error: null,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      status: 500,
      error: JSON.stringify(err),
      message:
        'Unexpected error occurred, Failed merge chalans,Please try later',
      data: null,
    };
  }
};

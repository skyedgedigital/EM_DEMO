'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import { IBill } from '@/interfaces/accountants/Bill.interface';

interface MergedItems {
  itemCost: number;
  unit: string;
  hours: number;
}

const prepareMergedBillItems = async (
  submittedBill: IBill
): Promise<ApiResponse<any>> => {
  try {
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
    console.log('MERGED ITEMS', mergedItems);
    return {
      data: JSON.stringify(mergedItems),
      error: null,
      status: 200,
      success: true,
      message: 'Successfully prepared merged items',
    };
  } catch (error) {
    return {
      success: false,
      status: 404,
      message:
        'Unexpected error occurred, Failed to prepare merged common items in Please try later',
      error: null,
      data: null,
    };
  }
};

export { prepareMergedBillItems };

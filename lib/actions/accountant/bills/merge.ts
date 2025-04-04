'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import { IBill, IBillingItem } from '@/interfaces/accountants/Bill.interface';

interface MergedItems {
  itemCost: number;
  unit: IBillingItem['unit'];
  hours: number;
}

export interface IPrepareMergedBillItemsResponse {
  [itemId: string]: MergedItems;
}
const prepareMergedBillItems = async (
  submittedBill: IBill
): Promise<ApiResponse<IPrepareMergedBillItemsResponse>> => {
  try {
    // MERGED ITEMS KO RAKHNE WALA ARRAY
    const mergedItems: IPrepareMergedBillItemsResponse = {};

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
      data: JSON.parse(JSON.stringify(mergedItems)),
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

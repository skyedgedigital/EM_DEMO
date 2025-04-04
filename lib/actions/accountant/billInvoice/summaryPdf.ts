'use server';

import { IBill } from '@/interfaces/accountants/Bill.interface';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import BillingWorkOrderItem from '@/lib/models/accountants/BillingWorkOrderItems.model';
const getBillingDistinguishedSummaryData = async (
  submittedBillData: IBill
): Promise<ApiResponse<any>> => {
  try {
    // Connect to the database
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    // Fetch items and create a mapping of item IDs to names
    const items = await BillingWorkOrderItem.find({});
    const itemsMap = new Map();
    items.forEach((item) => {
      itemsMap.set(item._id.toString(), item.itemName);
    });
    console.log('Items Map:', itemsMap);

    // Collect results
    const result: any = {};

    if (submittedBillData) {
      const {
        items: billItems,
        date,
        location,
        billNumber,
      } = submittedBillData;

      // Process each item in the chalan
      billItems.forEach((chalanItem) => {
        const itemId = chalanItem.item.toString();
        if (itemsMap.has(itemId)) {
          // Initialize structure if not present
          if (!result[itemId]) {
            result[itemId] = {
              totalHours: 0,
              details: [],
            };
          }

          // Update total hours
          result[itemId].totalHours += chalanItem.hours;

          // Add details to the result
          result[itemId].details.push({
            itemDescription: itemsMap.get(itemId),
            billNumber,
            chalanDate: date,
            location,
            workingHour: chalanItem.hours,
          });
        }
      });
    }

    // Log the result with details
    console.log('Result Summary:');
    for (const [itemId, data] of Object.entries(result) as [string, any][]) {
      console.log(`Item ID: ${itemId}`);

      console.log(`  Total Hours: ${data.totalHours}`);
      console.log(`  Details:`);
      data.details.forEach((detail: any, index: number) => {
        console.log(`    ${index + 1}. ${JSON.stringify(detail, null, 2)}`);
      });
    }

    return {
      success: true,
      status: 200,
      message: 'Data fetched successfully',
      data: result,
      error: null,
    };
  } catch (err) {
    console.error('Error in getBillingDistinguishedSummaryData:', err);
    return {
      success: false,
      status: 500,
      message: 'Internal Server Error',
      error: JSON.stringify(err),
      data: null,
    };
  }
};

export { getBillingDistinguishedSummaryData };

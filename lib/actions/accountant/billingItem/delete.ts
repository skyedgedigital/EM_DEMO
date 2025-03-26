'use server';

import handleDBConnection from '@/lib/database';
import BillingItem from '@/lib/models/accountants/BillingItems.model';

const deleteBillingItemByItemNumber = async (itemNumber: number) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const ifExists = await BillingItem.findOne({
      itemNumber: itemNumber,
    });
    if (!ifExists) {
      return {
        success: false,
        message: `BillingItem with number ${itemNumber} not found`,
        status: 404,
      };
    }
    await BillingItem.findOneAndDelete({
      itemNumber: itemNumber,
    });
    return {
      success: true,
      status: 200,
      message: `BillingItem with Number ${itemNumber} deleted`,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message:
        'Unexpected error occurred, Failed to delete item,Please try later',
      error: JSON.stringify(err.message) || 'Unknown error occurred',
    };
  }
};

export { deleteBillingItemByItemNumber };

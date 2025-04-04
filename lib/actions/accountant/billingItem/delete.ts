'use server';

import handleDBConnection from '@/lib/database';
import BillingWorkOrderItem from '@/lib/models/accountants/BillingWorkOrderItems.model';

const deleteBillingItemByItemNumber = async (itemNumber: number) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const ifExists = await BillingWorkOrderItem.findOne({
      itemNumber: itemNumber,
    });
    if (!ifExists) {
      return {
        success: false,
        message: `BillingWorkOrderItem with number ${itemNumber} not found`,
        status: 404,
      };
    }
    await BillingWorkOrderItem.findOneAndDelete({
      itemNumber: itemNumber,
    });
    return {
      success: true,
      status: 200,
      message: `BillingWorkOrderItem with Number ${itemNumber} deleted`,
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

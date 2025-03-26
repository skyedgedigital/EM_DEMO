'use server'

import handleDBConnection from "@/lib/database";
import BillingItem from "@/lib/models/accountants/BillingItems.model";

const updateBillingItem = async (itemId: any, updates: any) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const filter = {
      _id: itemId,
    };
    const updatedItem = await BillingItem.findOneAndUpdate(filter, updates, {
      new: true,
    });
    return {
      status: 200,
      data: updatedItem,
      message: 'Item updated successfully',
    };
  } catch (err) {
    return {
      status: 500,
      err: JSON.stringify(err),
      message: 'Internal Server Error',
    };
  }
};

export { updateBillingItem };
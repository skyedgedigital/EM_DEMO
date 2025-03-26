'use server';

import handleDBConnection from '@/lib/database';
import BillingItem from '@/lib/models/accountants/BillingItems.model';
import BillingWorkOrder from '@/lib/models/accountants/BillingWorkOrder.model';

const createBillingItem = async (itemData: any, workOrderNumber: string) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const workOrderDoc = await BillingWorkOrder.findOne({
      workOrderNumber: workOrderNumber,
    });
    if (!workOrderDoc) {
      return {
        success: false,
        status: 404,
        message: 'No BillingWorkOrder Found for the given Number',
      };
    }
    const workOrderDocId = workOrderDoc._id;
    console.log(workOrderDocId);
    const ifExists = await BillingItem.find({
      workOrder: workOrderDocId,
      itemNumber: itemData.itemNumber,
    });
    console.log(ifExists);
    if (!(ifExists.length === 0)) {
      return {
        success: false,
        status: 400,
        message: `item Number ${itemData.itemNumber} already associated with workORder ${workOrderNumber}`,
      };
    }

    const obj = new BillingItem({
      ...itemData,
      workOrder: workOrderDocId,
    });

    const result = await obj.save();

    return {
      success: true,
      status: 200,
      message: 'BillingItem Added with given BillingWorkOrder',
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: 'Internal Server Error',
      error: JSON.stringify(err.message) || 'An Unknown Error Occurred',
    };
  }
};

export { createBillingItem };

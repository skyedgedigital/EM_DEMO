'use server';

import handleDBConnection from '@/lib/database';
import BillingWorkOrderItem from '@/lib/models/accountants/BillingWorkOrderItems.model';
import BillingWorkOrder from '@/lib/models/accountants/BillingWorkOrder.model';

const fetchAllBillingItemsOfBillingWorkOrder = async (workOrderNumber) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    console.log('wowow');
    const filter = await JSON.parse(workOrderNumber);
    const find = filter.toString();

    console.log(workOrderNumber);
    console.log(typeof filter);
    const getWorkOrder = await BillingWorkOrder.findOne({
      workOrderNumber: find,
    });

    const WorkOrderId = getWorkOrder._id;
    const result = await BillingWorkOrderItem.find({
      workOrder: WorkOrderId,
    });
    console.log('okay boss');
    console.log(result);
    return {
      success: true,
      status: 200,
      message: `Fetched Data of all Items from BillingWorkOrder ${workOrderNumber}`,
      data: JSON.stringify(result),
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      status: 500,
      message: 'Unexpected Error Occurred, Please Try Later',
      error: err.message || 'Unknown error occurred',
    };
  }
};

const fetchBillingItemByItemNumber = async (itemNumber: number) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const resp = await BillingWorkOrderItem.findOne({
      itemNumber: itemNumber,
    });
    if (!resp) {
      return {
        success: false,
        status: 404,
        message: `BillingWorkOrderItem With Number ${itemNumber} not found`,
      };
    }
    return {
      success: true,
      status: 200,
      message: `BillingWorkOrderItem Fetched with ItemNumber ${itemNumber}`,
      data: resp,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: 'Unexpected Error Occurred, Please Try Later',
      error: err.message || 'Unknown error occurred',
    };
  }
};

const fetchBillingItemByItemId = async (itemNumber: string) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const resp = await BillingWorkOrderItem.findById({
      _id: itemNumber,
    });
    if (!resp) {
      return {
        success: false,
        status: 404,
        message: `BillingWorkOrderItem With Number ${itemNumber} not found`,
      };
    }
    return {
      success: true,
      status: 200,
      message: `BillingWorkOrderItem Fetched with ItemNumber ${itemNumber}`,
      data: JSON.stringify(resp),
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: 'Unexpected Error Occurred, Please Try Later',
      error: err.message || 'Unknown error occurred',
    };
  }
};

const fetchHsnNumberByBillingItemId = async (itemId: string) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const resp = await BillingWorkOrderItem.findOne({
      _id: itemId,
    });
    return {
      success: true,
      status: 200,
      message: `Hsn Number Fetched with ItemNumber ${itemId}`,
      data: resp.hsnNo,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
    };
  }
};

export {
  fetchAllBillingItemsOfBillingWorkOrder,
  fetchBillingItemByItemNumber,
  fetchBillingItemByItemId,
  fetchHsnNumberByBillingItemId,
};

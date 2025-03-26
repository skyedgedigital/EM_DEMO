'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import BillingWorkOrder from '@/lib/models/accountants/BillingWorkOrder.model';

const updateBillingWorkOrder = async (
  workOrderNumber: string,
  updatedData: any
) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const filter = {
      workOrderNumber: workOrderNumber,
    };
    let update = updatedData;
    const ifExists = await BillingWorkOrder.findOne({
      workOrderNumber: workOrderNumber,
    });
    if (!ifExists) {
      return {
        message: `The Work Order ${workOrderNumber} not exists`,
        success: false,
        status: 404,
      };
    }
    const result = await BillingWorkOrder.findOneAndUpdate(filter, update, {
      new: true,
    });
    return {
      success: true,
      status: 201,
      message: 'Successfully Updated',
      data: result,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Internal Server Error',
      status: 500,
      error: JSON.stringify(err),
    };
  }
};
const updateBillingWorkOrderBalance = async (
  workOrderNumber: string,
  deductionAmount: number
): Promise<ApiResponse<any>> => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const ifExists = await BillingWorkOrder.findOne({
      workOrderNumber: workOrderNumber,
    });
    if (!ifExists) {
      return {
        message: `The Work Order ${workOrderNumber} not exists`,
        success: false,
        status: 404,
        data: null,
        error: null,
      };
    }
    console.log('Before update', ifExists);
    ifExists.workOrderBalance = ifExists.workOrderBalance - deductionAmount;
    const result = await ifExists.save();
    console.log('After update', result);

    if (!result) {
      return {
        message: `The Work Order Balance did not updated, Please try later`,
        success: false,
        status: 404,
        data: null,
        error: null,
      };
    }
    return {
      success: true,
      status: 201,
      message: 'Work Order Balance Successfully Updated',
      data: JSON.stringify(result),
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Internal Server Error',
      status: 500,
      error: JSON.stringify(err),
      data: null,
    };
  }
};

export { updateBillingWorkOrder, updateBillingWorkOrderBalance };

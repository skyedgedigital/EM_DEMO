'use server';

import { IBillingWorkOrder } from '@/interfaces/accountants/BillingWorkOrder.interface';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import BillingWorkOrder from '@/lib/models/accountants/BillingWorkOrder.model';

const fetchAllBillingWorkOrders = async (): Promise<
  ApiResponse<IBillingWorkOrder[]>
> => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const resp = await BillingWorkOrder.find({});
    return {
      success: true,
      status: 200,
      message: 'List of All Work Order Fetched',
      data: JSON.parse(JSON.stringify(resp)),
      error: null,
    };
  } catch (err) {
    console.log('XXXXXXXXXXX', err);
    return {
      success: false,
      status: 500,
      message: 'Internal Server Error',
      error: JSON.stringify(err),
      data: null,
    };
  }
};

const fetchBillingWorkOrderByWorkOrderNumber = async (
  workOrderNumber: string
): Promise<ApiResponse<IBillingWorkOrder>> => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const findWorkOrderExists = await BillingWorkOrder.findOne({
      workOrderNumber: workOrderNumber,
    });
    if (!findWorkOrderExists) {
      // return {
      //   success: false,
      //   status: 404,
      //   message: 'No BillingWorkOrder With This Number Exists',
      //   error: null,
      //   data: null,
      // };
      throw new Error('Work order did not found');
    }
    const resp = await BillingWorkOrder.findOne({
      workOrderNumber: workOrderNumber,
    });
    return {
      success: true,
      status: 200,
      message: `Data of BillingWorkOrder ${workOrderNumber}`,
      data: await JSON.parse(JSON.stringify(resp)),
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: 'Unexpected Error Occur',
      error: JSON.stringify(err),
      data: null,
    };
  }
};

const fetchBillingWorkOrderByWorkOrderId = async (workOrderNumber: string) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    console.log(workOrderNumber);
    const findWorkOrderExists = await BillingWorkOrder.findById({
      _id: workOrderNumber,
    });
    if (!findWorkOrderExists) {
      return {
        success: false,
        status: 404,
        message: 'No BillingWorkOrder With This Number Exists',
      };
    }
    const resp = await BillingWorkOrder.findOne({
      _id: workOrderNumber,
    });
    return {
      success: true,
      status: 200,
      message: `Data of BillingWorkOrder ${workOrderNumber}`,
      data: resp,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: 'Internal Server Error',
      error: JSON.stringify(err),
    };
  }
};

const fetchBillingWorkOrderUnitsByWorkOrderNameOrId = async (
  filter: string
) => {
  const dbConnection = await handleDBConnection();
  if (!dbConnection.success) return dbConnection;
  try {
    const findIfWorkOrderExists = await BillingWorkOrder.findOne(
      JSON.parse(filter)
    );
    if (!findIfWorkOrderExists) {
      return {
        success: false,
        status: 404,
        message: 'BillingWorkOrder not Found',
      };
    }
    const units = findIfWorkOrderExists.units;
    return {
      success: true,
      status: 200,
      message: 'Units Fetched',
      data: JSON.stringify(units),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      status: 500,
      message: 'Internal Server Error',
    };
  }
};
const fetchAllValidBillingWorkOrder = async (): Promise<ApiResponse<any>> => {
  try {
    const resp: IBillingWorkOrder[] = await BillingWorkOrder.find({});

    if (!resp) {
      return {
        data: null,
        error: null,
        status: 500,
        success: false,
        message: 'Unexpected error occurred, Failed to fetch valid work orders',
      };
    }

    console.log('ALL WO', resp);
    const validWorkOrders: IBillingWorkOrder[] = [];
    const now = Date.now();

    resp.forEach((wo) => {
      const validityTime = new Date(wo?.workOrderValidity).getTime();
      if (validityTime >= now) {
        validWorkOrders.push(wo);
      }
    });
    console.log('VALID WO', validWorkOrders);

    return {
      data: JSON.stringify(validWorkOrders),
      error: null,
      status: 200,
      success: true,
      message: '',
    };
  } catch (error) {
    return {
      data: null,
      error: JSON.stringify(error),
      status: 500,
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unexpected error occurred, Failed to fetch valid work orders',
    };
  }
};
export {
  fetchAllBillingWorkOrders,
  fetchBillingWorkOrderByWorkOrderNumber,
  fetchBillingWorkOrderByWorkOrderId,
  fetchBillingWorkOrderUnitsByWorkOrderNameOrId,
  fetchAllValidBillingWorkOrder,
};

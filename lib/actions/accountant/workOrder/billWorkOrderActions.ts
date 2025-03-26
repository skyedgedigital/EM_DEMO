import { createBillingWorkOrder } from './create';
import {
  fetchAllBillingWorkOrders,
  fetchAllValidBillingWorkOrder,
  fetchBillingWorkOrderByWorkOrderId,
  fetchBillingWorkOrderByWorkOrderNumber,
  fetchBillingWorkOrderUnitsByWorkOrderNameOrId,
} from './fetch';
import {
  updateBillingWorkOrder,
  updateBillingWorkOrderBalance,
} from './update';

const billingWorkOrderActions = {
  CREATE: {
    createBillingWorkOrder,
  },
  FETCH: {
    fetchAllBillingWorkOrders,
    fetchBillingWorkOrderByWorkOrderNumber,
    fetchBillingWorkOrderUnitsByWorkOrderNameOrId,
    fetchAllValidBillingWorkOrder,
    fetchBillingWorkOrderByWorkOrderId,
  },
  UPDATE: {
    updateBillingWorkOrder,
    updateBillingWorkOrderBalance,
  },
};
export default billingWorkOrderActions;

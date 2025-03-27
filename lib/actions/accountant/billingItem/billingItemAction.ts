import { createBillingItem } from './create';
import { deleteBillingItemByItemNumber } from './delete';
import {
  fetchAllBillingItemsOfBillingWorkOrder,
  fetchHsnNumberByBillingItemId,
  fetchBillingItemByItemNumber,
  fetchBillingItemByItemId,
} from './fetch';
import { updateBillingItem } from './update';

const billingItemActions = {
  CREATE: {
    createBillingItem: createBillingItem,
  },
  FETCH: {
    fetchAllBillingItemOfBillingWorkOrder:
      fetchAllBillingItemsOfBillingWorkOrder,
    fetchBillingItemByItemNumber: fetchBillingItemByItemNumber,
    fetchHsnNoByBillingItemId: fetchHsnNumberByBillingItemId,
    fetchBillingItemByItemId,
  },
  DELETE: {
    deleteBillingItemByItemNumber: deleteBillingItemByItemNumber,
  },
  UPDATE: {
    updateBillingItemByItemId: updateBillingItem,
  },
};

export default billingItemActions;

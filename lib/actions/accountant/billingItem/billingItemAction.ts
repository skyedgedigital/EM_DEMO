import { createBillingItem } from './create';
import { deleteBillingItemByItemNumber } from './delete';
import {
  fetchAllBillingItemsOfBillingWorkOrder,
  fetchHsnNumberByBillingItemId,
  fetchBillingItemByItemNumber,
} from './fetch';
import { updateBillingItem } from './update';

const itemAction = {
  CREATE: {
    createBillingItem: createBillingItem,
  },
  FETCH: {
    fetchAllBillingItemOfBillingWorkOrder:
      fetchAllBillingItemsOfBillingWorkOrder,
    fetchBillingItemByItemNumber: fetchBillingItemByItemNumber,
    fetchHsnNoByBillingItemId: fetchHsnNumberByBillingItemId,
  },
  DELETE: {
    deleteBillingItemByItemNumber: deleteBillingItemByItemNumber,
  },
  UPDATE: {
    updateBillingItemByItemId: updateBillingItem,
  },
};

export default itemAction;

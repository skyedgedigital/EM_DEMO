import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/data-table';
import { columns } from '@/components/fleet-manager/WorkOrderColumns';
import AddItem from '@/components/fleet-manager/AddItem';
import CreateBillingWorkOrder from '@/components/accountant/CreateBillingWorkOrder';
import EditBillingWorkOrder from '@/components/accountant/EditBillingWorkOrder';
import billingWorkOrderActions from '@/lib/actions/accountant/workOrder/billWorkOrderActions';
import { IBillingWorkOrder } from '@/interfaces/accountants/BillingWorkOrder.interface';
import billingItemActions from '@/lib/actions/accountant/billingItem/billingWorkOrderItemAction';
import { IBillingWorkOrderItem } from '@/interfaces/accountants/IBillingWorkOrderItem.interface';
import { BillingWorkOrderColumns } from '@/components/accountant/BillingWorkOrderColumns';
import AddBillingWorkOrderItem from '@/components/accountant/AddBillingWorkOrderItem';

const BillingWorkOrder: React.FC<{}> = async () => {
  let workOrders: IBillingWorkOrder[] = [];
  try {
    const res = await billingWorkOrderActions.FETCH.fetchAllBillingWorkOrders();
    if (res?.success) {
      workOrders = res.data;
    }
  } catch (error) {
    console.error('Error fetching work orders:', error);
  }

  let workOrdersWithItems = [];

  try {
    // Use Promise.all to fetch items in parallel
    workOrdersWithItems = await Promise.all(
      workOrders.map(async (workOrder) => {
        let items: IBillingWorkOrderItem[] = [];
        try {
          const filter = JSON.stringify(workOrder?.workOrderNumber);
          const itemsRes =
            await billingItemActions.FETCH.fetchAllBillingItemOfBillingWorkOrder(
              filter
            );
          if (itemsRes?.success) {
            items = itemsRes.data;
          }
        } catch (error) {
          console.error(
            `Error fetching items for work order ${workOrder?.workOrderNumber}:`,
            error
          );
        }

        const date = new Date(workOrder.workOrderValidity);
        const options: Intl.DateTimeFormatOptions = {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        };
        const formattedDate = date.toLocaleDateString('en-GB', options);

        return {
          ...workOrder,
          items: items,
          workOrderValidity: formattedDate,
        };
      })
    );
  } catch (error) {
    console.error('Error processing work orders with items:', error);
  }

  return (
    <Tabs defaultValue='addWorkOrder'>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        Work Orders
      </h1>
      <TabsList className='grid w-full grid-cols-2 sm:grid-cols-3  justify-content-center gap-2 bg-white mb-3  '>
        <TabsTrigger value='addWorkOrder'>Add Billing Work Order</TabsTrigger>
        <TabsTrigger value='editWorkOrder'>Edit Billing Work Order</TabsTrigger>
        <TabsTrigger value='viewWorkOrders'>
          View Billing Work Orders
        </TabsTrigger>
      </TabsList>
      <TabsContent value='addWorkOrder'>
        <CreateBillingWorkOrder />
      </TabsContent>
      <TabsContent value='editWorkOrder'>
        <div className='flex flex-col gap-6'>
          <EditBillingWorkOrder />
          <AddBillingWorkOrderItem />
        </div>
      </TabsContent>
      <TabsContent value='viewWorkOrders'>
        <DataTable
          columns={BillingWorkOrderColumns}
          data={workOrdersWithItems}
          filterValue='workOrderNumber'
        />
      </TabsContent>
    </Tabs>
  );
};

export default BillingWorkOrder;

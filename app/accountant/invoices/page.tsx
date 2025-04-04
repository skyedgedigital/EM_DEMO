import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/data-table';
import EditBillInvoice from '@/components/accountant/EditBillInvoice';
import { billingInvoiceActions } from '@/lib/actions/accountant/billInvoice/billInvoiceActions';
import { BillInvoiceColumns } from '@/components/accountant/BillInvoiceColumns';

export const dynamic = 'force-dynamic';

const page = async () => {
  const res = await billingInvoiceActions.GET.getAllBillingInvoices();
  let invoices;
  if (res.success) {
    invoices = await JSON.parse(res.data);
  }

  return (
    <Tabs defaultValue='invoice'>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        Invoice Management
      </h1>
      <TabsList className='grid w-full grid-cols-2  gap-1 justify-content-center bg-white mb-20 sm:mb-10 lg:mb-0'>
        <TabsTrigger value='invoice'>Add SES/DO</TabsTrigger>
        <TabsTrigger value='viewInvoice'>View Invoices</TabsTrigger>
      </TabsList>
      <TabsContent value='invoice'>
        {' '}
        <EditBillInvoice />
      </TabsContent>
      <TabsContent value='viewInvoice'>
        <DataTable
          columns={BillInvoiceColumns}
          data={invoices}
          filterValue='invoiceNumber'
        />
      </TabsContent>
    </Tabs>
  );
};

export default page;

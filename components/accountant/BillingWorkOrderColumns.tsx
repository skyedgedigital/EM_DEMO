'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { BillingItemColumns } from './BillingItemColumns';
import { DataTable } from '../data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import workOrderAction from '@/lib/actions/workOrder/workOrderAction';
import UomTable from '../fleet-manager/UomTable';
import { IBillingWorkOrderItem } from '@/interfaces/accountants/IBillingWorkOrderItem.interface';
// import UomTable from './UomTable';

export type WorkOrder = {
  workOrderNumber: string;
  workDescription: String;
  workOrderValue: Number;
  workOrderValidity: Date;
  workOrderBalance: Number;
  items?: IBillingWorkOrderItem[];
};

export const BillingWorkOrderColumns: ColumnDef<WorkOrder>[] = [
  {
    accessorKey: 'workOrderNumber',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Number
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },

  {
    accessorKey: 'workDescription',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          //   onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Description
          {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
        </Button>
      );
    },
  },
  {
    accessorKey: 'workOrderValue',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          //   onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Value
          {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
        </Button>
      );
    },
  },
  {
    accessorKey: 'workOrderBalance',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          //   onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Balance
          {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
        </Button>
      );
    },
  },
  {
    accessorKey: 'workOrderValidity',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          //   onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Validity
          {/* <ArrowUpDown className='ml-2 h-4 w-4' /> */}
        </Button>
      );
    },
  },
  {
    id: 'actions',

    cell: ({ row }) => {
      const workOrder = row.original;

      const handleDeleteWorkOrder = async (workOrderNumber: string) => {
        console.log(`Deleting work Order!`);
        try {
          const res = await workOrderAction.DELETE.deleteWorkOrder(
            workOrderNumber
          );

          if (res.success) {
            toast.success(res.message!);
          }
          if (!res.success) {
            toast.error(
              res.message || res?.error || 'Unable to delete work order!'
            );
          }
        } catch (error) {
          toast.error('Error deleting work order!!');
          console.error(`Error deleting work order: ${error}`);
        }
      };

      console.log('yeich items hain', workOrder);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={(e) => e.preventDefault()}>
              <Dialog>
                <DialogTrigger>View Items</DialogTrigger>
                <DialogContent className='w-full overflow-x-scroll'>
                  <DataTable
                    columns={BillingItemColumns}
                    data={workOrder.items}
                  />
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.preventDefault()}>
              <Dialog>
                <DialogTrigger>{`View UOM's`}</DialogTrigger>
                <DialogContent className='w-11/12 overflow-x-scroll'>
                  <UomTable
                    workOrderNumber={workOrder.workOrderNumber}
                    //@ts-ignore
                    workOrderUnits={workOrder.units}
                  />
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-red-500'
              onClick={() => handleDeleteWorkOrder(workOrder.workOrderNumber)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

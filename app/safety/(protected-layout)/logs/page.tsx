'use client';
import React, { useState } from 'react';
import { formatDate } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  actionTypes,
  panelTypeNames,
  panelTypes,
} from '@/lib/models/log/log.model';
import { DateRange } from 'react-day-picker';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { DatePickerWithRange } from '@/components/ui/dateRangePicker';
import { access } from '@/utils/enum';
import { useForm } from 'react-hook-form';

export interface ClientLog {
  panel: string;
  actionType: actionTypes;
  message: string;
  date: Date; // Date as ISO string
  actionBy: string;
  collection: string;
  documentId: string;
  _id: string;
}
const logs: ClientLog[] = [
  {
    panel: 'Safety',
    actionType: 'CREATE',
    message: 'New Document uploaded New Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'Hr',
    actionType: 'CREATE',
    message:
      'New Document uploaded New Document t uploaded New Docum uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'Driver',
    actionType: 'CREATE',
    message:
      'New Document uploaded New Document uploa uploaded New Document uploa ded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'accountant',
    actionType: 'CREATE',
    message: 'New Document uploaded New Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'Safety',
    actionType: 'CREATE',
    message:
      'New Document uploaded New Document uploaded New Document uploa uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'HR',
    actionType: 'CREATE',
    message: 'New Document uploaded New Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'Safety',
    actionType: 'CREATE',
    message: 'New Document uploaded New Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'fleetmanager',
    actionType: 'CREATE',
    message: 'New Document uploaded New Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'Safety',
    actionType: 'CREATE',
    message:
      'New Document uploaded New uploaded New Document uploauploaded New Document uploauploaded New Document uploa Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'Hr',
    actionType: 'CREATE',
    message: 'New Document uploaded New Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'Safety',
    actionType: 'CREATE',
    message:
      'New Document uploaded New Document uploaded New Document uploa uploaded New Document uploa uploaded New Document uploa  uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'Accountant',
    actionType: 'CREATE',
    message: 'New Document uploaded New Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'fleet manager',
    actionType: 'CREATE',
    message: 'New Document uploaded New Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'Driver',
    actionType: 'CREATE',
    message:
      'New Document uploaded New Document uploaded New Document uploaded New Document uploa uploaded New Document uploa uploaded New Document uploa',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'Safety',
    actionType: 'CREATE',
    message: 'New Document uploaded New Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
];
const LogPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedLog, setSelectedLog] = useState<ClientLog>(null);
  const { register, setValue } = useForm<{
    dateRange: DateRange | null;
    actionType: actionTypes | 'ALL';
    panel: panelTypes | 'ALL';
  }>({
    defaultValues: {
      dateRange: null,
      actionType: 'ALL',
      panel: 'ALL',
    },
  });

  const getDateRange = (dateRange: DateRange | null) => {
    // setLogFilters((prev) => ({ ...prev, dateRange }));
    setValue('dateRange', dateRange);
  };
  return (
    <>
      <section className='flex flex-col gap-2 min-h-screen relative'>
        <div className='flex flex-col gap-2 sticky top-4 bg-white border-b-[1px] border-blue-400'>
          <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
            Logs
          </h1>
          <div className='flex justify-center items-center gap-4 p-3 pt-0 pb-4 shadow'>
            <p>Filter By:</p>
            <form className='flex justify-start items-center gap-4'>
              <div className=''>
                <label
                  htmlFor='panel'
                  className='block text-sm font-medium text-gray-500'
                >
                  Panel:
                </label>
                <select
                  id='panel'
                  className=' block w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  {...register('panel')}
                >
                  <option value='ALL'>All</option>
                  <option value='Safety'>Safety</option>
                  <option value='DRIVER'>Driver</option>
                  <option value='HR'>HR</option>
                  <option value='FLEET-MANAGER'>Fleet Manager</option>
                  <option value='ADMIN'>Admin</option>
                  <option value='ACCOUNTANT'>Accountant</option>
                </select>
              </div>
              <div className=''>
                <label
                  htmlFor='action-type'
                  className='block text-sm font-medium text-gray-700'
                >
                  Action type:
                </label>
                <select
                  //   value={selectedStatus}
                  defaultValue='ALL'
                  id='action-type'
                  className=' block w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  // onChange={(e) => {}}
                >
                  <option value=''>ALL</option>
                  <option value='CREATE'>CREATE</option>
                  <option value='DELETE'>DELETE</option>
                  <option value='UPDATE'>UPDATE</option>
                </select>
              </div>
              <div className=''>
                <label
                  htmlFor='action-type'
                  className='block text-sm font-medium text-gray-700'
                >
                  Between Dates:
                </label>
                {/* <input
                  type='date'
                  className='mt-1 block w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                /> */}
                <DatePickerWithRange
                  className='flex w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm gap-2'
                  getDateRange={getDateRange}
                />
              </div>
            </form>
          </div>
        </div>
        <div className=''>
          {logs?.map((log, i) => (
            <div
              key={log._id.toString() + i}
              className=' w-full hover:cursor-pointer hover:bg-gray-100 px-2 py-2 border-b-[1px] border-gray-300 flex flex-col md:flex-row justify-between items-center '
              onClick={() => {
                setSelectedLog(log);
                setIsDrawerOpen(true);
              }}
            >
              <div className='flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row justify-start items-center w-full gap-8'>
                {' '}
                <span className='flex lg:w-1/6 w-full justify-start items-center gap-2 text-base'>
                  <p className='text-gray-500 font-normal text-xs text-nowrap'>
                    Date:
                  </p>
                  <p className='text-sm text-gray-700 text-nowrap'>
                    {log?.date && formatDate(log?.date, 'dd MMM, yyyy')}
                  </p>
                </span>
                <span className='flex lg:w-1/6 w-full justify-start items-center gap-2 text-base'>
                  <p className='text-gray-500 font-normal text-xs text-nowrap'>
                    Panel:
                  </p>
                  <p className='text-sm text-gray-700'> {log?.panel}</p>
                </span>
                <span className='flex lg:w-1/6 w-full justify-start items-center gap-2 text-base'>
                  <p className='text-gray-500 font-normal text-xs text-nowrap'>
                    Action Type:
                  </p>
                  <p className='text-sm text-gray-700'> {log?.actionType}</p>
                </span>
                <span className='flex  w-full lg:w-3/6 justify-start items-center gap-2 text-base '>
                  <p className='text-gray-500 font-normal text-xs text-nowrap'>
                    Message:
                  </p>
                  <p className='text-sm text-gray-700'> {log?.message}</p>
                </span>
              </div>
              <div className='lg:ml-28'>
                <Button
                  variant='default'
                  className='border-white shadow-none hover:border-blue-500 hover:bg-white text-blue-500 bg-white border-[1px] '
                >
                  Sign Document
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Drawer
          direction='right'
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        >
          <DrawerContent className='h-full w-1/3 ml-auto flex flex-col '>
            <DrawerHeader>
              <DrawerTitle>Log info:</DrawerTitle>
              {/* <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription> */}
            </DrawerHeader>
            <div>
              {' '}
              <div className='flex flex-col justify-start items-start p-5 w-full gap-3'>
                {' '}
                <span className='flex lg:w-1/6 w-full justify-start items-center gap-2 text-base'>
                  <p className='text-gray-500 font-normal text-xs text-nowrap'>
                    Panel:
                  </p>
                  <p className='text-sm text-gray-700'> {selectedLog?.panel}</p>
                </span>
                <span className='flex lg:w-1/6 w-full justify-start items-center gap-2 text-base'>
                  <p className='text-gray-500 font-normal text-xs text-nowrap'>
                    Date:
                  </p>
                  <p className='text-sm text-gray-700 text-nowrap'>
                    {selectedLog?.date &&
                      formatDate(selectedLog?.date, 'dd MMM, yyyy')}
                  </p>
                </span>
                <span className='flex lg:w-1/6 w-full justify-start items-center gap-2 text-base'>
                  <p className='text-gray-500 font-normal text-xs text-nowrap'>
                    Action Type:
                  </p>
                  <p className='text-sm text-gray-700'>
                    {' '}
                    {selectedLog?.actionType}
                  </p>
                </span>
                <span className='flex  w-full justify-start items-start gap-2 text-base '>
                  <p className='text-gray-500 font-normal text-xs text-nowrap'>
                    Message:
                  </p>
                  <p className='text-sm text-gray-700'>
                    {' '}
                    {selectedLog?.message}
                  </p>
                </span>
                <span className='flex  w-full justify-start items-start gap-2 text-base '>
                  <p className='text-gray-500 font-normal text-xs text-nowrap'>
                    Action By:
                  </p>
                  <p className='text-sm text-gray-700'>
                    {' '}
                    {selectedLog?.actionBy}
                  </p>
                </span>
              </div>
            </div>
            <DrawerFooter>
              <Button className='bg-blue-500 text-white hover:bg-blue-700'>
                Sign Document
              </Button>
              <DrawerClose className='w-full'>
                <Button
                  className='w-full border-[1px] border-blue-300 text-blue-500 hover:text-blue-700 hover:border-blue-500'
                  variant='outline'
                >
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </section>
    </>
  );
};

export default LogPage;

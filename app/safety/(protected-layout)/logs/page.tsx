'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { formatDate, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { actionTypes, ILogs, panelTypes } from '@/lib/models/log/log.model';
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
import { useForm } from 'react-hook-form';
import { IFetchLogsResponse } from '@/lib/actions/log/fetch';
import { logActions } from '@/lib/actions/log/logActions';
import toast from 'react-hot-toast';

const logsExample: IFetchLogsResponse['logs'] = [
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
    panel: 'HR',
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
    panel: 'DRIVER',
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
    panel: 'ACCOUNTANT',
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
    panel: 'FLEET-MANAGER',
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
    message:
      'New Document uploaded New Document uploaded New Document uploa uploaded New Document uploa uploaded New Document uploa  uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'ACCOUNTANT',
    actionType: 'CREATE',
    message: 'New Document uploaded New Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'FLEET-MANAGER',
    actionType: 'CREATE',
    message: 'New Document uploaded New Document uploaded New Document',
    date: new Date(),
    actionBy: '66ccaf35752b130f5b65b895',
    collection: 'documents',
    documentId: '66ccaf35752b130f5b65b895',
    _id: '66ccaf35752b130f5b65b895',
  },
  {
    panel: 'DRIVER',
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

type TFormData = {
  dateRange: DateRange | null;
  actionType: actionTypes | 'ALL';
  panel: panelTypes | 'ALL';
};

const LogPage = () => {
  const [logs, setLogs] = useState<IFetchLogsResponse['logs']>(logsExample);
  console.log('logssss', logs);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedLog, setSelectedLog] =
    useState<IFetchLogsResponse['logs'][number]>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loadingStates, setLoadingStates] = useState({
    loadingLogs: true,
    loadingMore: false,
  });
  const { register, setValue, handleSubmit, formState, watch } =
    useForm<TFormData>({
      defaultValues: {
        dateRange: {
          from: subDays(new Date(), 7),
          to: new Date(),
        },
        actionType: 'ALL',
        panel: 'ALL',
      },
    });
  const formData = watch();

  const onSubmit = (submittedFormData: TFormData) => {
    console.log(submittedFormData);
    // Reset to first page when filters change
    setPage(1);
    setHasMore(true);
    fetchLogs(1, true);
  };

  const getDateRange = async (dateRange: DateRange | null) => {
    setValue('dateRange', dateRange);
  };
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loadingStates.loadingMore ||
      !hasMore
    ) {
      return;
    }

    // Load more data when scrolled to bottom
    setLoadingStates((prev) => ({ ...prev, loadingMore: true }));
    setPage((prev) => prev + 1);
  }, [loadingStates.loadingMore, hasMore]);

  const fetchLogs = useCallback(
    async (pageNum: number, isInitialLoad = false) => {
      try {
        const { data, success } = await logActions.FETCH.fetchLogs(
          pageNum,
          10, // limit
          {
            actionType:
              formState.defaultValues?.actionType === 'ALL'
                ? undefined
                : formData?.actionType,
            panel:
              formState.defaultValues?.panel === 'ALL'
                ? undefined
                : (formData?.panel as ILogs['panel']),
            dateRange: formData?.dateRange,
          }
        );

        if (success) {
          if (isInitialLoad) {
            setLogs(data.logs);
          } else {
            setLogs((prev) => [...prev, ...data.logs]);
          }

          // Check if there's more data
          setHasMore(pageNum < data.totalPages);
        }
      } catch (error) {
        toast.error(error?.message || 'Failed to load logs');
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          loadingLogs: false,
          loadingMore: false,
        }));
      }
    },
    [formState.defaultValues]
  );

  // Initial load
  useEffect(() => {
    // fetchLogs(1, true);
  }, [fetchLogs]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchLogs(page);
    }
  }, [page, fetchLogs]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const fetchAllLogs = async () => {
      setLoadingStates((prev) => ({
        ...prev,
        loadingLogs: true,
      }));
      try {
        //  i will send formState.default values as initial argument
        const { data, message, status, success, error } =
          await logActions.FETCH.fetchLogs();

        if (success) {
          setLogs((prev) => [...prev, ...data.logs]);
        }
        if (!success) {
          toast.error(message || error.toString());
        }
      } catch (error) {
        toast.error(
          error?.message ||
            JSON.stringify(error) ||
            'Unexpected error occurred, Failed to load logs, Please try later'
        );
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          loadingLogs: false,
        }));
      }
    };
    // fetchAllLogs();
  }, []);

  return (
    <>
      <section className='flex flex-col gap-2 min-h-screen relative'>
        <div className='flex flex-col gap-2 sticky top-4 bg-blue-50 border-b-[1px] border-blue-400 '>
          <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
            Logs
          </h1>
          <div className='flex justify-center items-center gap-4 p-3 pt-0 pb-4 shadow'>
            <p className='text-sm'>Filter By:</p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex justify-start items-end gap-4'
            >
              <div className=''>
                <label
                  htmlFor='panel'
                  className='block text-sm font-medium text-gray-500'
                >
                  Panel:
                </label>
                <select
                  id='panel'
                  className=' block w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm'
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
                  className=' block w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm'
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
                  Between Dates (from-to):
                </label>
                <DatePickerWithRange
                  className='flex w-fit py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm gap-2'
                  getDateRange={getDateRange}
                />
              </div>
              <Button
                type='submit'
                className='bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-700'
              >
                Filter log
              </Button>
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
                  <p className='text-sm text-gray-700'>
                    {' '}
                    {log?.panel?.toLocaleLowerCase()}
                  </p>
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

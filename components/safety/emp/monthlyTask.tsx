import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import MonthlyAction from '@/lib/actions/SafetyEmp/monthly/MonthlyTaskAction';
import { ArrowLeft, ArrowRight, Loader2Icon, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { IMonthlyTaskResponse } from '@/lib/actions/SafetyEmp/monthly/fetch';
import MonthlyTaskAction from '@/lib/actions/SafetyEmp/monthly/MonthlyTaskAction';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import {
  EventStatusNames,
  EventStatusTypes,
} from '@/lib/models/safetyPanel/emp/monthlyTask.model';

type FormattedEvents = {
  [dateKey: string]: IMonthlyTaskResponse[];
};
const MonthlyTask = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [specifiedDate, setSpecifiedDate] = useState<string>(null);
  const [events, setEvents] = useState<FormattedEvents>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMonthlyEvents = async () => {
      setIsLoading(true);
      try {
        const resp = await MonthlyAction.FETCH.fetchMonthlyTask();
        if (!resp.success) {
          console.error('Failed to fetch events:', resp.error);
          return;
        }

        const eventsData = resp.data;
        console.log('Raw event data:', eventsData);

        const formattedEvents: FormattedEvents = {};

        eventsData.forEach(
          ({
            eventDate,
            eventName,
            eventDescription,
            _id,
            status,
            assignedTo,
          }) => {
            try {
              // Handle potential date string issues
              const dateObj = new Date(eventDate);
              if (isNaN(dateObj.getTime())) {
                console.error('Invalid date:', eventDate);
                return;
              }

              const dateKey = format(dateObj, 'yyyy-MM-dd');
              console.log('Processing:', eventName, 'for date:', dateKey);

              if (!formattedEvents[dateKey]) {
                formattedEvents[dateKey] = [];
              }
              formattedEvents[dateKey].push({
                eventName,
                _id,
                assignedTo,
                eventDate,
                eventDescription,
                status,
              });
            } catch (e) {
              console.error('Error processing event:', e);
            }
          }
        );

        console.log('Formatted events:', formattedEvents);
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching monthly events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMonthlyEvents();
  }, []);

  const renderHeader = () => {
    const month = format(currentMonth, 'MM');
    const year = format(currentMonth, 'yyyy');

    // Generate an array of years (from current year - 10 to current year + 10)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    return (
      <div className='flex justify-center gap-3 items-center mb-4 '>
        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={prevMonth}
            className='px-4 text-xl border-[1px] p-1 rounded hover:bg-gray-100'
          >
            <ArrowLeft className='text-blue-500' />
          </button>
        </div>
        <div className='flex items-center gap-2'>
          <select
            className='p-1 border rounded'
            value={parseInt(month)}
            onChange={(e) =>
              setCurrentMonth(
                new Date(parseInt(year), parseInt(e.target.value) - 1)
              )
            }
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i + 1}>
                {format(new Date(2020, i), 'MMMM')}
              </option>
            ))}
          </select>
          <select
            className='p-1 border rounded'
            value={parseInt(year)}
            onChange={(e) =>
              setCurrentMonth(
                new Date(parseInt(e.target.value), parseInt(month) - 1)
              )
            }
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className='flex items-center'>
          <button
            onClick={nextMonth}
            className='px-4 text-xl border-[1px] p-1 rounded hover:bg-gray-100'
          >
            <ArrowRight className='text-blue-500' />
          </button>
        </div>
      </div>
    );
  };
  const renderDays = () => {
    const days = [];
    const dateFormat = 'iiii';
    let startDate = startOfWeek(startOfMonth(currentMonth));

    for (let i = 0; i < 7; i++) {
      days.push(
        <p className='flex-1 text-center font-normal text-sm' key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </p>
      );
    }
    return <div className='flex '>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dateKey = format(day, 'yyyy-MM-dd');

        days.push(
          <div
            key={day.toString()}
            className={`p-1 hover:scale-105 hover:bg-blue-50 transition-all hover:cursor-pointer flex flex-col w-24 h-24 border-[1px] ${
              !isSameMonth(day, monthStart)
                ? 'bg-gray-100'
                : isSameDay(day, selectedDate)
                ? 'bg-blue-200'
                : ''
            }`}
            onClick={() => setSpecifiedDate(dateKey)}
          >
            <span className='block text-left pl-1 w-fit h-fit'>
              {formattedDate}
            </span>
            <div className='text-xs overflow-y-auto flex-grow'>
              {events[dateKey] &&
                events[dateKey].map(
                  (
                    {
                      eventName,
                      eventDescription,
                      _id,
                      assignedTo,
                      status,
                      eventDate,
                    },
                    index
                  ) => (
                    <div
                      key={index}
                      className={`hover:scale-105 hover:cursor-pointer transition-all flex flex-col gap-1 items-center justify-between rounded p-1 mt-1 border-[1px] ${
                        status === 'pending' && 'border-red-200 bg-red-100'
                      } ${
                        status === 'in progress' &&
                        'border-yellow-300 bg-yellow-100'
                      } ${
                        status === 'completed' &&
                        'border-green-300 bg-green-100'
                      }`}
                    >
                      <p>{eventName}</p>
                    </div>
                  )
                )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className='flex' key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className=''>{rows}</div>;
  };
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <section className='flex flex-col justify-center items-center lg:flex-row  h-screen'>
      {/* Calendar Section - Sticky */}
      <div className='w-full lg:w-1/2 mx-auto p-1 md:p-4 lg:p-8 pt-0 lg:border-r-[1px] border-gray-100 lg:h-screen lg:overflow-y-auto lg:sticky lg:top-0'>
        {isLoading && (
          <span className='flex justify-center items-center gap-2 mb-2'>
            <Loader2Icon className='w-[20px] h-[20px] animate-spin' />
            <p className='text-nowrap text-sm'>Loading monthly tasks...</p>
          </span>
        )}
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      <div className='w-full lg:w-1/2 lg:h-screen overflow-y-auto'>
        <AllTaskDetailsOnSpecifiedDate specifiedDate={specifiedDate} />
      </div>
    </section>
  );
};

export default MonthlyTask;

const AllTaskDetailsOnSpecifiedDate = ({
  specifiedDate = null,
}: {
  specifiedDate: string;
}) => {
  const [allEventsOnSelectedDate, setAllEventsOnSelectedDate] = useState<
    IMonthlyTaskResponse[]
  >([]);
  // console.log('SELECTED EVENT', allEventsOnSelectedDate);
  const [loadingStates, setLoadingStates] = useState<{
    loadingMonthlyTasks: boolean;
  }>({
    loadingMonthlyTasks: true,
  });

  const fetchAllEventsOnSelectedDate = async (specifiedDate: string) => {
    try {
      setLoadingStates((prev) => ({ ...prev, loadingMonthlyTasks: true }));
      const { data, status, success, message, error } =
        await MonthlyTaskAction.FETCH.fetchMonthlyTaskOnSpecificDate(
          specifiedDate
        );

      if (success) {
        console.log('All events', data);
        setAllEventsOnSelectedDate(data);
        toast.success(message);
      }
      if (!success) {
        toast.error(message);
      }
    } catch (error) {
      toast.error(
        error?.message ||
          JSON.stringify(error) ||
          'Unexpected error occurred, Failed to fetch tasks, Please try later'
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, loadingMonthlyTasks: false }));
    }
  };

  useEffect(() => {
    if (!specifiedDate) return;
    fetchAllEventsOnSelectedDate(specifiedDate);
  }, [specifiedDate]);

  return (
    <section className='w-full mx-auto p-1 md:p-2 lg:p-4 lg:border-l-[1px] border-gray-100 overflow-y-auto'>
      {/* {specifiedDate} {JSON.stringify(allEventsOnSelectedDate)}{' '} */}
      <h2 className='text-lg flex gap-1 mb-3 '>
        <p className='text-gray-600'>All tasks on:</p>{' '}
        <p>
          {specifiedDate
            ? new Date(specifiedDate).toLocaleDateString()
            : 'Click a date to see details'}
        </p>
      </h2>

      {loadingStates.loadingMonthlyTasks && specifiedDate ? (
        <div className='flex justify-center items-center p-2 gap-2'>
          <Loader2Icon className='animate-spin text-blue-500 w-[20px] h-[20px]' />
          <p>Loading tasks...</p>
        </div>
      ) : allEventsOnSelectedDate.length === 0 && specifiedDate ? (
        <div className='w-full flex justify-center items-center p-1'>
          No task on this day
        </div>
      ) : (
        <div className='w-full flex  items-center p-1'>
          <Accordion type='multiple' className='w-full'>
            {allEventsOnSelectedDate.map(
              ({
                eventDate,
                eventName,
                eventDescription,
                status,
                _id,
                assignedTo,
              }) => (
                <>
                  <AccordionItem key={_id} value={_id} className='w-full mb-3'>
                    <AccordionTrigger className=' w-full hover:no-underline  rounded hover:bg-gray-100 px-2'>
                      <div className='flex justify-between items-center w-full gap-4'>
                        <div className='flex justify-start items-center gap-2 text-base'>
                          <p className='text-gray-700 font-normal text-sm text-nowrap'>
                            Task Name:
                          </p>
                          <p>{eventName}</p>
                        </div>
                        <p
                          className={`p-1 mr-2 font-normal rounded-full px-3 text-white text-xs ${
                            status === 'pending' && 'bg-red-500 '
                          } ${status === 'in progress' && 'bg-yellow-500 '} ${
                            status === 'completed' && 'bg-green-700 '
                          }`}
                        >
                          {status}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='w-full flex flex-col gap-4 px-3'>
                      <IndividualTaskDetails
                        eventDate={eventDate}
                        eventDescription={eventDescription}
                        _id={_id}
                        assignedTo={assignedTo}
                        specifiedDate={specifiedDate}
                        fetchAllEventsOnSelectedDate={
                          fetchAllEventsOnSelectedDate
                        }
                        status={status}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </>
              )
            )}
          </Accordion>
        </div>
      )}
    </section>
  );
};

const IndividualTaskDetails = ({
  eventDescription,
  eventDate,
  assignedTo,
  _id,
  specifiedDate,
  fetchAllEventsOnSelectedDate,
  status,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<EventStatusTypes>(status);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      return toast.error('Not a valid status to update');
    }
    try {
      const { data, status, success, message, error } =
        await MonthlyAction.UPDATE.updateMonthlyTaskStatusById(
          _id,
          selectedStatus
        );

      if (success) {
        toast.success(message);
        fetchAllEventsOnSelectedDate(specifiedDate);
      }
      if (!success) {
        toast.error(message);
      }
    } catch (error) {
      console.log('Update status error', error);
      toast.error(
        error?.message ||
          JSON.stringify(error) ||
          'Unexpected error occurred, Failed to update status, Please try later'
      );
    }
  };
  const handleDelete = async (taskId: string) => {
    try {
      const resp = await MonthlyAction.DELETE.deleteMonthlyTask(taskId);
      if (resp.success) {
        toast.success(resp.message);
        // Update events state after deletion
        fetchAllEventsOnSelectedDate(specifiedDate);
      }
      if (!resp.success) {
        toast.error(resp.message);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(
        error?.message ||
          JSON.stringify(error) ||
          'Unexpected error occurred, Failed to delete task, Please try later'
      );
    }
  };
  return (
    <>
      <div className='flex flex-col gap-2 '>
        <span className='flex justify-start items-center gap-1'>
          <p className='text-gray-500 font-normal'>Description:</p>
          <p>{eventDescription}</p>
        </span>
        <span className='flex justify-start items-center gap-1'>
          <p className='text-gray-500 font-normal'>Task date:</p>
          <p>{new Date(eventDate).toLocaleDateString()}</p>
        </span>
        <span className='flex justify-start items-center gap-1'>
          <p className='text-gray-500 font-normal'>Assigned to:</p>
          <p>
            {assignedTo?.name} &nbsp;({assignedTo?.code})
          </p>
        </span>
      </div>
      <div className='flex flex-col md:flex-row justify-between items-end'>
        <div className='flex justify-start items-end gap-2 mt-1'>
          <div className=''>
            <label
              htmlFor='status'
              className='block text-sm font-medium text-gray-700'
            >
              Status:
            </label>
            <select
              value={selectedStatus}
              id='status'
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              onChange={(e) =>
                setSelectedStatus(e.currentTarget.value as EventStatusTypes)
              }
            >
              {' '}
              {/* <option value={''}>All Employees</option> */}
              {EventStatusNames?.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleStatusUpdate}
            disabled={selectedStatus && status === selectedStatus}
            variant='outline'
            className=' border-blue-500 text-blue-500 disabled:border-gray-500 disabled:text-gray-500 hover:bg-blue-50 hover::cursor-pointer'
          >
            save
          </Button>
        </div>
        <Button
          variant='destructive'
          className=' text-red-600 bg-white border-0 shadow-none hover:bg-red-100  transition-all'
          onClick={() => {
            setSelectedTaskId(_id);
            setDialogOpen(true);
          }}
        >
          Delete Task
        </Button>
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-red-500'>
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className=''
              onClick={() => handleDelete(selectedTaskId)}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

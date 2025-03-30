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
import { ArrowLeft, ArrowRight, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { IMonthlyTaskResponse } from '@/lib/actions/SafetyEmp/monthly/fetch';
import MonthlyTaskAction from '@/lib/actions/SafetyEmp/monthly/MonthlyTaskAction';

type FormattedEvents = {
  [dateKey: string]: IMonthlyTaskResponse[];
};
const MonthlyTask = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [specifiedDate, setSpecifiedDate] = useState<string>(null);
  const [events, setEvents] = useState<FormattedEvents>({});

  useEffect(() => {
    const fetchMonthlyEvents = async () => {
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
      }
    };
    fetchMonthlyEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      const resp = await MonthlyAction.DELETE.deleteMonthlyTask(eventId);
      if (resp.success) {
        toast.success('Event Removed');
        // Update events state after deletion
        const updatedEvents = { ...events };
        Object.keys(updatedEvents).forEach((dateKey) => {
          updatedEvents[dateKey] = updatedEvents[dateKey].filter(
            (event) => event._id !== eventId
          );
        });
        setEvents(updatedEvents);
      } else {
        toast.error('Failed to remove event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Something went wrong');
    }
  };

  const renderHeader = () => {
    const month = format(currentMonth, 'MM');
    const year = format(currentMonth, 'yyyy');

    // Generate an array of years (from current year - 10 to current year + 10)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    return (
      <div className='flex justify-center gap-3 items-center my-4'>
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
        <div className='flex-1 text-center font-medium' key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className='flex'>{days}</div>;
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
            className={`p-1 flex flex-col w-24 h-24 border-[1px] ${
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
                        status === 'pending' && 'border-red-500 bg-red-100'
                      } ${
                        status === 'in progress' &&
                        'border-yellow-500 bg-yellow-100'
                      } ${
                        status === 'completed' &&
                        'border-green-700 bg-green-100'
                      }`}
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   setSelectedEvent({
                      //     eventName,
                      //     eventDescription,
                      //     _id,
                      //     assignedTo,
                      //     status,
                      //     eventDate,
                      //   });
                      //   console.log('Event clicked:', eventName);
                      // }}
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
    return <div>{rows}</div>;
  };
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <section className='border-2 border-blue-600 flex flex-col lg:flex-row gap-2 '>
      <div className='w-full lg:w-1/2 mx-auto p-4 border-2 border-green-500'>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
      {/* <div className={` transition-all lg:${specifiedDate ? 'w-1/2' : 'w-0'}`}> */}
      {specifiedDate && (
        <AllTaskDetailsOnSpecifiedDate
          className='w-full mx-auto p-4 border-2 border-green-500'
          specifiedDate={specifiedDate}
        />
      )}
      {/* </div> */}
    </section>
  );
};

export default MonthlyTask;

const AllTaskDetailsOnSpecifiedDate = ({
  specifiedDate = '',
  className = '',
}: {
  specifiedDate: string;
  className: string;
}) => {
  const [allEventsOnSelectedDate, setAllEventsOnSelectedDate] =
    useState<IMonthlyTaskResponse[]>(null);
  console.log('SELECTED EVENT', allEventsOnSelectedDate);
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
    <section className={className}>
      {specifiedDate} {JSON.stringify(allEventsOnSelectedDate)}{' '}
    </section>
  );
};

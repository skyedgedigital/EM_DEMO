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
import { ArrowLeft, ArrowRight, Loader2Icon, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import { IFetchAllTrainingSelectedDetailsResponse } from '@/lib/actions/safety/training/fetch';
import CreateTraining from './CreateTraining';
import Link from 'next/link';

type FormattedTrainings = {
  [dateKey: string]: IFetchAllTrainingSelectedDetailsResponse[];
};
const TrainingCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<FormattedTrainings>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAllMonthlyTrainings = async () => {
    setIsLoading(true);
    try {
      const resp = await trainingActions.FETCH.fetchAllTrainingSelectedDetails([
        'title',
        'trainingDate',
      ]);
      if (!resp.success) {
        console.error('Failed to fetch events:', resp.error);
        toast.error(resp.message);
        return;
      }

      const eventsData = resp.data;
      console.log('Raw event data:', eventsData);

      const formattedEvents: FormattedTrainings = {};

      eventsData.forEach(({ title, trainingDate, _id }) => {
        try {
          // Handle potential date string issues
          const dateObj = new Date(trainingDate);
          if (isNaN(dateObj.getTime())) {
            console.error('Invalid date:', trainingDate);
            return;
          }

          const dateKey = format(dateObj, 'yyyy-MM-dd');
          console.log('Processing:', title, 'for date:', dateKey);

          if (!formattedEvents[dateKey]) {
            formattedEvents[dateKey] = [];
          }
          formattedEvents[dateKey].push({
            title,
            trainingDate,
            _id,
          });
        } catch (e) {
          console.error('Error processing event:', e);
        }
      });

      console.log('Formatted events:', formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching monthly events:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllMonthlyTrainings();
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
            className={`p-1  flex flex-col w-24 h-24 border-[1px] ${
              !isSameMonth(day, monthStart)
                ? 'bg-gray-100'
                : isSameDay(day, selectedDate)
                ? 'bg-blue-200'
                : ''
            }`}
            // onClick={() => setSpecifiedDate(dateKey)}
          >
            <span className='block text-left pl-1 w-fit h-fit'>
              {formattedDate}
            </span>
            <div className='text-xs overflow-y-auto flex-grow'>
              {events[dateKey] &&
                events[dateKey].map(({ _id, trainingDate, title }, index) => (
                  <Link
                    key={_id}
                    target='_blank'
                    href={`/safety/trainings/training-details?trainingId=${_id}`}
                    className={` flex flex-col gap-1 items-center justify-between rounded p-1 mt-1 bg-blue-600  text-white overflow-hidden hover:scale-105 transition-all hover:cursor-pointer`}
                  >
                    <p className='text-nowrap text-start w-full'>{title}</p>
                  </Link>
                ))}
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
    <section className='flex flex-col justify-center items-center lg:flex-row gap-4'>
      {/* Calendar Section - Sticky */}
      <div className='w-full lg:w-1/2 mx-auto p-1 md:p-4 lg:p-8 pt-0   lg:overflow-y-auto lg:sticky lg:top-0 border-[1px] border-gray-300 rounded flex flex-col gap-2'>
        {isLoading && (
          <span className='flex justify-center items-center gap-2 mb-2'>
            <Loader2Icon className='w-[20px] h-[20px] animate-spin text-blue-700' />
            <p className='text-nowrap text-sm'>Loading monthly trainings...</p>
          </span>
        )}
        {renderHeader()}
        {renderDays()}
        {renderCells()}
        <p className='mt-3 text-sm text-gray-500 italic text-center'>
          Note: click on trainings to see details
        </p>
      </div>

      <div className='w-full h-full mb-auto flex-grow lg:w-1/2 justify-start overflow-y-auto flex flex-col gap-2'>
        <CreateTraining reloadMonthlyTraining={fetchAllMonthlyTrainings} />
      </div>
    </section>
  );
};

export default TrainingCalendar;

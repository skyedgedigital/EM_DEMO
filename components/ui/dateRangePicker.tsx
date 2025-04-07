'use client';

import { format, subDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';

export function DatePickerWithRange({
  className,
  getDateRange,
}: {
  className?: string;
  getDateRange: (dateRange: DateRange | null) => void;
}) {
  const [date, setDate] = useState<DateRange | null>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  useEffect(() => {
    getDateRange(date);
  }, [date]);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'md:min-w-[250px] flex justify-start items-center text-left font-normal',
              !date && 'text-muted-foreground',
              className
            )}
          >
            <CalendarIcon className='w-[20px] h-[20px]' />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date or range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}

            // footer={
            //   date
            //     ? `You picked ${date.to.toLocaleDateString()}.`
            //     : 'Please pick a date.'
            // }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

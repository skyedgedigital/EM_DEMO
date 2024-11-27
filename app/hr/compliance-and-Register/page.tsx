'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import DamageRegister from './DamageForm';
import AdvanceRegister from './AdvanceForm';

const Page = () => {
  const [selectedTab, setSelectedTab] = useState('compliance'); // New state for tabs
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);

  const schema = z.object({
    year: z.string().trim().min(1, 'Required'),
    month: z.string().trim().min(1, 'Required'),
  });

  type FormFields = z.infer<typeof schema>;

  const form = useForm<FormFields>({
    defaultValues: {
      year: '',
      month: '',
    },
    resolver: zodResolver(schema),
  });

  const monthsName = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const years = Array.from({ length: 2024 - 2010 + 1 }, (_, i) => 2010 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    toast.success('Form submitted successfully!');
    window.open(
      `/hr/compliance-and-Register/compliance-register?month=${data.month}&year=${data.year}`,
      '_blank'
    );
  };

  return (
    <div>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        Compliance and Register
      </h1>
      {/* <div className="flex justify-center items-center mb-4">
        <h1 className="font-bold text-3xl border-b-2">Compliance and Register</h1>
      </div> */}

      {/* Tab Navigation */}
      <div className='flex justify-center space-x-4 mb-6'>
        <button
          className={`py-2 px-4 rounded-2xl transition-colors ${
            selectedTab === 'compliance'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-slate-300'
          }`}
          onClick={() => setSelectedTab('compliance')}
        >
          Compliance Register
        </button>
        <button
          className={`py-2 px-4 rounded-2xl transition-colors ${
            selectedTab === 'damage'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-slate-300'
          }`}
          onClick={() => setSelectedTab('damage')}
        >
          Damage Register
        </button>
        <button
          className={`py-2 px-4 rounded-2xl transition-colors ${
            selectedTab === 'advance'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 hover:bg-slate-300'
          }`}
          onClick={() => setSelectedTab('advance')}
        >
          Advance Register
        </button>
      </div>

      {/* Tab Content */}
      {selectedTab === 'compliance' && (
        <div className=' mt-8 w-full md:w-3/4 lg:w-1/2 mx-auto'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='p-2 mr-2 border-[1px] border-gray-300 rounded-md shadow-lg flex flex-col gap-6'
            >
              <h2 className=' bg-primary-color-extreme/10 font-semibold py-1 text-base text-center'>
                Select Year and Month
              </h2>
              <div className='flex flex-col md:flex-row p-3 gap-4'>
                <FormField
                  control={form.control}
                  name='year'
                  render={({ field }) => (
                    <FormItem className=' flex-col flex gap-1 flex-1'>
                      <FormLabel>Year</FormLabel>
                      <Select
                        onValueChange={(e) => field.onChange(e)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='' />
                            ) : (
                              'Select Year'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='max-w-80 max-h-72'>
                          {years.map((option) => (
                            <SelectItem value={option.toString()} key={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='month'
                  render={({ field }) => (
                    <FormItem className=' flex-col flex gap-1 flex-1'>
                      <FormLabel>Month</FormLabel>
                      <Select
                        onValueChange={(e) => field.onChange(e)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='' />
                            ) : (
                              'Select Month'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='max-w-80 max-h-72'>
                          {months.map((option) => (
                            <SelectItem value={option.toString()} key={option}>
                              {monthsName[option - 1]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='py-4 flex flex-col md:flex-row justify-center items-center'>
                <Button
                  type='submit'
                  className='flex items-center gap-1 border-2 border-black px-4 mb-2 rounded bg-green-500 text-white'
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  )}
                  Show Compliance Register
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Placeholder content for other tabs */}
      {selectedTab === 'damage' && <DamageRegister />}
      {selectedTab === 'advance' && <AdvanceRegister />}
    </div>
  );
};

export default Page;
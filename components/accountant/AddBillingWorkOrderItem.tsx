'use client';

import React, { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { string, z, ZodTypeAny } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { defaultErrorMap } from 'zod';
import toast from 'react-hot-toast';

import { IItem } from '@/interfaces/item.interface';
import billingWorkOrderItemAction from '@/lib/actions/accountant/billingItem/billingWorkOrderItemAction';
import billingWorkOrderActions from '@/lib/actions/accountant/workOrder/billWorkOrderActions';

const zodInputStringPipe = (zodPipe: ZodTypeAny) =>
  z
    .string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: 'Required',
    })
    .transform((value) => (value === null ? 0 : Number(value)))
    .pipe(zodPipe);
const workOrderSchema = z.object({
  workOrderNumber: z.string().trim().min(1, 'Required'),
  items: z.object({
    serviceNumber: z.string().min(1, 'Service no is required'),
    itemName: z.string().trim().min(1, 'Required'),
    itemPrice: zodInputStringPipe(
      z.number().positive('Value must be greater than 0')
    ),
    hsnNo: z.string().trim().min(1, 'Required'), // Assuming hsnNo is a string
    itemNumber: zodInputStringPipe(
      z.number().positive('Value must be greater than 0')
    ), // Allow zero or positive integers
  }),
});

type FormFields = z.infer<typeof workOrderSchema>;

const AddBillingWorkOrderItem = () => {
  const [workOrderNumber, setWorkOrderNumber] = useState('');

  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);

  const [allWorkOrderNumbers, setAllWorkOrderNumbers] = useState<string[]>([]);

  const [updateItems, setUpdateItems] = useState<IItem[] | null>(null);

  const form = useForm<FormFields>({
    defaultValues: {
      workOrderNumber: '',

      items: {
        itemName: '',
        itemPrice: '',
        itemNumber: '',
        hsnNo: '',
        serviceNumber: '',
      },
    },
    resolver: zodResolver(workOrderSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    try {
      console.log('wwowoowow', data.items);

      const { workOrderNumber, items } = data;

      const response =
        await billingWorkOrderItemAction.CREATE.createBillingItem(
          items,
          workOrderNumber
        );
      console.log(response);

      if (response.success) {
        toast.success(response.message);
        form.reset({
          workOrderNumber: '', // Add validation for length or pattern if needed

          items: {
            itemName: '',
            itemPrice: '',
            itemNumber: '',
            hsnNo: '',
          },
        });
        console.log('Items added successfully', response.data);
      } else {
        toast.error(response.message);

        console.error('Error adding items:', response.message);
      }
    } catch (error) {
      toast.error('Internal Server Error');
      console.error('Internal Server Error:', error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const workOrderResp =
          await billingWorkOrderActions.FETCH.fetchAllBillingWorkOrders();
        const success = workOrderResp.success;
        const data = workOrderResp.data;
        if (success) {
          const workOrderNumbers = data
            ? data.map((workOrder) => workOrder.workOrderNumber)
            : [];
          console.log(workOrderNumbers);
          setAllWorkOrderNumbers(workOrderNumbers);
        }
        if (!success) {
          toast.error(workOrderResp.message);
        }
      } catch (error) {
        toast.error(
          error?.message ||
            'Unexpected error occurred, Failed to load work order numbers, Please try later'
        );
      }
    };
    fetch();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='border-[1px] border-gray-300 rounded-md shadow-lg flex flex-col gap-6 mt-4'
      >
        <h2 className='bg-blue-50 font-semibold p-1 text-base py-2 text-center'>
          Add Item
        </h2>
        <div className='px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 '>
          <FormField
            control={form.control}
            name='workOrderNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Order</FormLabel>
                <Select
                  onValueChange={(e) => {
                    field.onChange(e);
                    setWorkOrderNumber(e);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      {field.value ? (
                        <SelectValue placeholder='' />
                      ) : (
                        'Select Work Order No.'
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allWorkOrderNumbers?.map((option, index) => (
                      <SelectItem value={option} key={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='w-full px-4 gap-2 flex flex-col md:flex-row '>
          <FormField
            control={form.control}
            name={`items.itemName`}
            render={({ field }) => (
              <FormItem className=' flex-col flex gap-1 flex-1'>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input placeholder='' {...field} className=' bg-white ' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`items.hsnNo`}
            render={({ field }) => (
              <FormItem className=' flex-col flex gap-1 flex-1'>
                <FormLabel>HSN No.</FormLabel>
                <FormControl>
                  <Input placeholder='' {...field} className=' bg-white ' />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />{' '}
          <FormField
            control={form.control}
            name={`items.serviceNumber`}
            render={({ field }) => (
              <FormItem className=' flex-col flex gap-1 flex-1'>
                <FormLabel>Service Number</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder=''
                    {...field}
                    className=' bg-white '
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`items.itemPrice`}
            render={({ field }) => (
              <FormItem className=' flex-col flex gap-1 flex-1'>
                <FormLabel>Item Price</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder=''
                    {...field}
                    className=' bg-white '
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`items.itemNumber`}
            render={({ field }) => (
              <FormItem className=' flex-col flex gap-1 flex-1'>
                <FormLabel>Item Number</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder=''
                    {...field}
                    className=' bg-white '
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='px-4 flex flex-col gap-3 sm:flex-row md:justify-end pb-4'>
          <Button type='submit' className=' bg-green-500 w-40 '>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddBillingWorkOrderItem;

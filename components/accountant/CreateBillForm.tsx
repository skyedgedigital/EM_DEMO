'use client';

import { Button } from '../ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CircleX, Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import { z, ZodTypeAny } from 'zod';
import toast from 'react-hot-toast';
import departmentAction from '@/lib/actions/department/departmentAction';
import engineerAction from '@/lib/actions/engineer/engineerAction';

import vehicleAction from '@/lib/actions/vehicle/vehicleAction';
import billingWorkOrderActions from '@/lib/actions/accountant/workOrder/billWorkOrderActions';
import billingItemActions from '@/lib/actions/accountant/billingItem/billingItemAction';
import { IBillingWorkOrderItem } from '@/interfaces/accountants/IBillingWorkOrderItem.interface';
import { calcPrice } from '@/utils/calcPrice';
import BillingInvoice, {
  IItemsInBillingInvoice,
} from '../invoices/BillingInvoice';
import { IBillingWorkOrder } from '@/interfaces/accountants/BillingWorkOrder.interface';
import { billsActions } from '@/lib/actions/accountant/bills/billsAction';
import { IBill } from '@/interfaces/accountants/Bill.interface';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
interface MergedItems {
  itemCost: number;
  unit: string;
  hours: number;
}
const zodInputStringPipe = (zodPipe: ZodTypeAny) =>
  z
    .string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: 'Number Invalid',
    })
    .transform((value) => (value === null ? 0 : Number(value)))
    .pipe(zodPipe);

const BillFormSchema = z.object({
  workOrder: z.string().trim().min(1, 'Required'),
  department: z.string().trim().min(1, 'Required'),
  engineer: z.string().trim().min(1, 'Required'),
  date: z.coerce.date({
    errorMap: (issue, { defaultError }) => ({
      message: issue.code === 'invalid_date' ? 'Required' : defaultError,
    }),
  }),
  billNumber: z.string().trim().min(1, 'Required'),
  location: z.string().optional(),
  workDescription: z.string().optional(),
  // file: z
  //   .any()
  //   .refine((files) => files?.length >= 1, 'Document is required.')
  //   .refine(
  //     (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //     'Only .jpg, .jpeg and .png formats are supported.'
  //   ),
  status: z.enum(['unsigned', 'signed']).default('signed'),
  items: z
    .array(
      z.object({
        serviceNumber: z.string().default(''),
        item: z.string(),
        vehicleNumber: z.string().trim().min(1, 'Required'),
        unit: z.string().trim().min(1, 'Required'),
        hours: zodInputStringPipe(
          z.number().positive('Value must be greater than 0')
        ), // Allow optional hours
        startTime: z
          .string()
          .regex(
            /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
            'Invalid time format (HH:MM)'
          ),
        endTime: z
          .string()
          .regex(
            /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
            'Invalid time format (HH:MM)'
          ),
        // itemCosting IS ONLY USED WHEN DATA PASSED TO INVOICE, NOT FOR FORM (BAD DESIGN FOR NOW)
        itemCosting: z.number().nullable(),
      })
    )
    .min(1, 'Atleast one item is required!!'),
  //   commentByDriver: z.string().optional(),
  // commentByFleetManager: z.string().optional(),
  totalCost: z.number().nullable(),
});

type BillFormFields = z.infer<typeof BillFormSchema>;

const CreateBillForm = () => {
  const [allVehicleNumbers, setAllVehicleNumbers] = useState<string[]>([]);

  const [creatingBillInvoice, setCreatingBillInvoice] = useState(false);
  const [allDepartments, setAllDepartments] = useState<string[]>([]);
  const [department, setDepartment] = useState('');
  const [workOrder, setWorkOrder] = useState('');
  const [dataForBillingInvoice, setDataForBillingInvoice] =
    useState<ReactNode>(null);
  const [
    selectedWorkOrderObjectItemOptionsArray,
    setSelectedWorkOrderObjectItemsOptionsArray,
  ] = useState<Partial<IBillingWorkOrderItem>[]>([]);
  console.log(
    'selectedWorkOrderObjectItemOptionsArray',
    selectedWorkOrderObjectItemOptionsArray
  );
  const [fetchedWorkOrderOptions, setFetchedWorkOrderOptions] = useState([]);
  const [fetchedEngineerNames, setFetchedEngineerNames] = useState([]);
  const [units, setUnits] = useState([]);

  const router = useRouter();

  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<BillFormFields>({
    defaultValues: {
      workOrder: '', // Allow optional workOrder
      department: '', // Allow optional department
      engineer: '',
      date: undefined,
      //   chalanNumber: '',
      location: '',
      workDescription: '',
      status: 'signed',
      items: [],
      totalCost: null,
      //   commentByDriver: '',
      // commentByFleetManager: '',
    },
    resolver: zodResolver(BillFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: 'items',
    control: form.control,
  });

  const onSubmit: SubmitHandler<BillFormFields> = async (
    submittedBillData: BillFormFields
  ) => {
    try {
      setCreatingBillInvoice(true);
      console.log('BEFORE Submitted bill data', submittedBillData);
      // PREPARE MERGE CHALAN (ye sara selected chalan number leta hai or usse items le ke merge kar deta hai. yahan direct item humlog de denge chalan se nahi lena pdega)
      // PEHLE CREATE BILL INVOICE CALL KARENGE
      // USI ME ANDAR BILL CREATE HOGA OR PHIR BILL INVOICE

      // PROCEDURE 1
      const minTimestamp = new Date(submittedBillData.date).getTime();
      const maxTimestamp = new Date(submittedBillData.date).getTime();

      // Convert timestamps back to Date objects
      const minDate = new Date(minTimestamp);
      const maxDate = new Date(maxTimestamp);

      // Format the dates as "x to y"
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Format the dates
      const formattedDateString = `${formatDate(minDate)}`;
      // PROCEDURE 2
      // PRICE IS CALCULATED SAME AS totalCost IN CHALAN CALCULATED FOR ALL ITEMS (fn()->calcPrice() in createChalan)
      // added itemCosting
      let total = 0;
      for (const item of submittedBillData.items) {
        console.log(item.unit);
        // const fetchedItem = await Item.findById(item.item);

        const fetchedItem = selectedWorkOrderObjectItemOptionsArray.find(
          (i) => i._id.toString() === item.item.toString()
        );
        if (!fetchedItem) {
          console.error(`Item with ID ${item.item} not found`);
          continue;
        }
        let quantity = item.hours;
        let unit = item.unit;
        console.log(
          'Quantity ->',
          quantity,
          ' Price ->',
          fetchedItem.itemPrice,
          'Unit',
          unit
        );

        item.itemCosting = calcPrice(
          quantity,
          fetchedItem.itemPrice,
          item.unit
        );
        total += item.itemCosting;
      }
      submittedBillData.totalCost = total;
      console.log('Total item total', total);
      // ***** completed bill data structure same as chalan in database

      // PROCEDURE 3
      const { data, status, success, message, error } =
        await billsActions.PREPARE.prepareMergedBillItems(
          submittedBillData as unknown as IBill
        );
      const mergedItems = await JSON.parse(data);
      // console.log('mergedItems received in create invoice', mergedItems);
      const items: IItemsInBillingInvoice[] = [];
      let totalCost = 0;
      for (const itemId in mergedItems) {
        const itemCost = mergedItems[itemId];
        totalCost += itemCost;
        const res = await billingItemActions.FETCH.fetchBillingItemByItemId(
          itemId
        );
        const item = await JSON.parse(res.data);

        console.warn('The Items', item);
        const { itemNumber, itemName, itemPrice, workOrder } = item;
        items.push({
          itemId, // Use the key as the itemId property
          itemCost, // Use the value as the itemCost property
          itemNumber,
          itemPrice,
          itemName,
          workOrder,
        });
      }
      console.log('Items to be sent', items);
      // ******************************** WORKING CORRECT TILL HERE ************************************
      // TOTAL PRICE CALCULATED
      console.log('AFTER Submitted bill data', submittedBillData);

      const woRes =
        await billingWorkOrderActions.FETCH.fetchBillingWorkOrderByWorkOrderNumber(
          submittedBillData.workOrder
        );

      if (!woRes.success) {
        return toast.error('Failed to load work order details');
      }
      const selectedWorkOrderInfo: IBillingWorkOrder = woRes.data;

      // PREPARING items FIELD TO SEND IN INVOICE COMPONENT (SAME AS DID IN create-invoice/page.tsx)

      const DisplayableInvoice = (
        <BillingInvoice
          items={items}
          workOrder={selectedWorkOrderInfo}
          itemCost={total}
          location={submittedBillData?.location}
          service={formattedDateString}
          department={submittedBillData?.department}
          submittedBillData={submittedBillData as unknown as IBill}
        />
      );
      setDataForBillingInvoice(DisplayableInvoice);
      if (DisplayableInvoice) {
        const element: HTMLElement | null =
          document.getElementById('bill-invoice');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }

      console.log('bill submitted', submittedBillData);
      // console.log('bill submitted', `Billing-invoice-${invoiceNumber}`);
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || JSON.stringify(error) || 'something went wrong'
      );
    } finally {
      setCreatingBillInvoice(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await vehicleAction.FETCH.fetchAllVehicles();

      if (res?.success) {
        const vehicleNumbers = JSON.parse(res?.data).map(
          (vehicle) => vehicle.vehicleNumber
        );
        setAllVehicleNumbers(vehicleNumbers);
      } else {
        toast.error(res?.message || 'can not fetch vehicle numbers!');
      }
    };
    fetch();
  }, []);
  useEffect(() => {
    const fetch = async () => {
      const res = await departmentAction.FETCH.fetchAllDepartments();
      if (res.success) {
        const departments = JSON.parse(res.data).map(
          (department) => department.departmentName
        );
        const realdepartments = JSON.parse(JSON.stringify(departments));
        console.log('ALL DEPARTMENTS', realdepartments);
        setAllDepartments(realdepartments);
      }
      if (!res.success) {
        toast.error(
          res?.message || 'Department options did not fetched.Please try again.'
        );
      }
    };
    fetch();
  }, []);
  useEffect(() => {
    const fetchEngineersData = async () => {
      const res = await engineerAction.FETCH.fetchEngineerByDepartmentName(
        department
      );

      if (res.success) {
        const engineers = res?.data
          ? JSON.parse(res?.data).map((engineer) => engineer.name)
          : [];
        console.log('engineers', engineers);
        setFetchedEngineerNames(engineers);
      }
      if (!res.success) {
        return toast.error(
          res.message || 'Unable to fetch department details!'
        );
      }
    };
    if (department != '') fetchEngineersData();
  }, [department]);

  useEffect(() => {
    const fetchItemsData = async () => {
      const filter = await JSON.stringify(workOrder);
      const res =
        await billingItemActions.FETCH.fetchAllBillingItemOfBillingWorkOrder(
          filter
        );

      if (res.success) {
        const parsed = await JSON.parse(res.data);
        const items = res.data ? parsed : [];
        console.log('Billing items', items);
        setSelectedWorkOrderObjectItemsOptionsArray(items);
      }
      if (!res.success) {
        return toast.error(res.message || 'Unable to fetch items!');
      }
    };
    if (workOrder != '') fetchItemsData();
  }, [workOrder]);

  useEffect(() => {
    const fetch = async () => {
      // const { success, error, data, message } =
      //   await workOrderAction.FETCH.fetchAllWorkOrder();
      const workOrderResp =
        await billingWorkOrderActions.FETCH.fetchAllValidBillingWorkOrder();
      console.log('workorder resonse', workOrderResp);
      const success = workOrderResp.success;
      // const error = workOrderResp.error;
      if (!success) {
        return toast.error(
          workOrderResp.message ||
            'Work order options did not fetched.Please try again.'
        );
      }
      if (success) {
        const data = JSON.parse(workOrderResp.data);
        const res = data ? data : [];
        console.log('ALL WORKORDERS', data);
        setFetchedWorkOrderOptions(data);
      }
    };
    fetch();
  }, []);

  return (
    <section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log('Form errors:', form.formState.errors);
            onSubmit(data);
          })}
          className='border-[1px] border-gray-300 rounded-md shadow-lg flex flex-col gap-6 mt-4'
        >
          <h2 className='bg-blue-50 font-semibold p-1 text-base py-2 text-center'>
            Create Bill
          </h2>
          <div className='px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6'>
            <FormField
              control={form.control}
              name='billNumber'
              render={({ field }) => (
                <FormItem className=' flex-col flex gap-1 flex-1'>
                  <FormLabel>Bill Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter bill number'
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
              name='department'
              render={({ field }) => (
                <FormItem className=' flex-col flex gap-1 flex-1'>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                      setDepartment(e);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='' />
                        ) : (
                          'Select a Department'
                        )}
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {allDepartments.map((option, index) => (
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
              name='workOrder'
              render={({ field }) => (
                <FormItem className=' flex-col flex gap-1 flex-1'>
                  <FormLabel>Work Order</FormLabel>
                  <Select
                    onValueChange={async (e) => {
                      // RESETTING SELECTED WORK DESCRIPTION
                      const selectedOrder = fetchedWorkOrderOptions.find(
                        (order: any) =>
                          order.workOrderNumber.toLowerCase() ===
                          e.toLowerCase()
                      );
                      if (selectedOrder) {
                        form.setValue(
                          'workDescription',
                          selectedOrder.workDescription
                        );
                      }

                      // LOADING UNITS
                      field.onChange(e);
                      console.log('The WorkOrder Change Occurred', e);
                      const resp =
                        await billingWorkOrderActions.FETCH.fetchBillingWorkOrderUnitsByWorkOrderNameOrId(
                          JSON.stringify({
                            workOrderNumber: e,
                          })
                        );
                      if (resp.success) {
                        let unitsArray = JSON.parse(resp.data);
                        setUnits(unitsArray);
                        if (unitsArray.length === 0) {
                          toast.success('No Units Present for the workOrder');
                        } else {
                          toast.success('Units loaded for the WorkOrder');
                          setWorkOrder(e);
                          console.log('The Units', resp.data);
                        }
                      } else {
                        toast.error('Error Loading Units for the WorkOrder');
                        toast.error('Kindly Reload');
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='' />
                        ) : (
                          'Select Work Order Number'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fetchedWorkOrderOptions?.map((option, index) => (
                        <SelectItem
                          key={option.workOrderNumber}
                          value={option.workOrderNumber}
                        >
                          {option.workOrderNumber}
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
              name='engineer'
              render={({ field }) => (
                <FormItem className=' flex-col flex gap-1 flex-1'>
                  <FormLabel>Engineer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='' />
                        ) : (
                          'Select an Engineer'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fetchedEngineerNames.map((option, index) => (
                        <SelectItem
                          key={option.toString()}
                          value={option.toString()}
                          className='capitalize'
                        >
                          {option
                            ?.toLowerCase()
                            .split(' ')
                            .map(
                              (word: string) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(' ')}
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
              name='location'
              render={({ field }) => (
                <FormItem className=' flex-col flex gap-1 flex-1'>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter location'
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
              name='date'
              render={({ field }) => (
                <FormItem className='flex flex-col pt-2 justify-center'>
                  <FormLabel>Chalan Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild className=''>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='workDescription'
              render={({ field }) => (
                <FormItem className=' flex-col flex gap-1 flex-1'>
                  <FormLabel>Work Description</FormLabel>
                  <FormControl>
                    <Textarea disabled {...field} className=' bg-white ' />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
            control={form.control}
            name='file'
            render={({ field: { value, onChange } }) => (
              <div className='flex-col flex gap-1 flex-1'>
                <label className='font-semibold'>Chalan Photo</label>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='bg-white border border-gray-300 rounded-md p-2'
                  onChange={(event) => {
                    const files = event.target.files;
                    if (files && files.length > 0) {
                      setSelectedFile(files[0]);
                      onChange(files);
                    } else {
                      setSelectedFile(null);
                      onChange(undefined);
                    }
                  }}
                />
                {selectedFile && <p>{selectedFile.name}</p>}
                <FormMessage />
              </div>
            )}
          /> */}
            <p>no photo upload for bill</p>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className=' flex-col flex gap-1 flex-1'>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {field.value ? (
                          <SelectValue placeholder='' />
                        ) : (
                          'Select Status'
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='signed'>Signed</SelectItem>
                      {/* <SelectItem value="pending">Pending</SelectItem> */}
                      <SelectItem value='unsigned'>Unsigned</SelectItem>
                      {/* <SelectItem value="generated">Generated</SelectItem> */}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
            control={form.control}
            name='commentByDriver'
            render={({ field }) => (
              <FormItem className=' flex-col flex gap-1 flex-1'>
                <FormLabel>Comment By Driver</FormLabel>
                <FormControl>
                  <Textarea {...field} className=' bg-white ' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          /> */}
          </div>
          <h2 className='text-blue-800 font-bold px-4'>Fill Items</h2>
          {form.formState.errors.items && (
            <p className='text-red-500 italic text-xs'>
              {form.formState.errors.items.message}
            </p>
          )}

          {fields.map((field, index) => (
            <div className='w-full flex flex-col gap-2 px-4' key={field.id}>
              <h2 className='text-blue-800 font-semibold'>{`Item - ${
                index + 1
              }`}</h2>
              <div className='w-full  gap-2 flex flex-col md:flex-row '>
                <FormField
                  control={form.control}
                  name={`items.${index}.item`}
                  render={({ field }) => (
                    <FormItem className=' flex-col flex gap-1 flex-1'>
                      <FormLabel>Item</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <FormControl>
                            <SelectValue placeholder='Select Item' />
                          </FormControl>
                        </SelectTrigger>
                        <SelectContent>
                          {selectedWorkOrderObjectItemOptionsArray.map(
                            (option, index) => (
                              <SelectItem
                                value={option._id.toString()}
                                key={option._id.toString()}
                              >
                                {option.itemName.toString()}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.vehicleNumber`}
                  render={({ field }) => (
                    <FormItem className=' flex-col flex gap-1 flex-1'>
                      <FormLabel>Vehicle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {field.value ? (
                              <SelectValue placeholder='' />
                            ) : (
                              'Select Vehicle No.'
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allVehicleNumbers?.map((option, index) => (
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

                <FormField
                  control={form.control}
                  name={`items.${index}.unit`}
                  render={({ field }) => (
                    <FormItem className=' flex-col flex gap-1 flex-1'>
                      <FormLabel>Unit</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <FormControl>
                            <SelectValue placeholder='Select a Unit' />
                          </FormControl>
                        </SelectTrigger>
                        <SelectContent>
                          {/* <SelectItem value="shift">shift</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem> */}
                          {units.map((ele) => {
                            return (
                              <>
                                <SelectItem value={ele}>{ele}</SelectItem>
                              </>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.hours`}
                  render={({ field }) => (
                    <FormItem className=' flex-col flex gap-1 flex-1'>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
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
                  name={`items.${index}.startTime`}
                  render={({ field }) => (
                    <FormItem className=' flex-col flex gap-1 flex-1'>
                      <FormLabel>Start TIme</FormLabel>
                      <FormControl>
                        <Input type='time' {...field} className=' bg-white ' />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.endTime`}
                  render={({ field }) => (
                    <FormItem className=' flex-col flex gap-1 flex-1'>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type='time' {...field} className=' bg-white ' />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {index > 0 && (
                  <span className=' flex flex-col justify-between gap-1'>
                    <span></span>
                    <button
                      onClick={() => remove(index)}
                      className='text-xm w-fit bg-red-600 text-white font-semibold p-2 rounded  '
                    >
                      <CircleX />
                    </button>
                  </span>
                )}
              </div>
            </div>
          ))}
          <div className='px-4 flex flex-col gap-3 sm:flex-row md:justify-between py-4'>
            <Button
              type='button'
              className='w-40'
              onClick={(e) => {
                e.preventDefault();
                append({
                  item: '',
                  vehicleNumber: '',
                  unit: 'hours',
                  hours: '',
                  startTime: '',
                  endTime: '',
                  serviceNumber: '',
                  itemCosting: null,
                });
              }}
            >
              Add Item
            </Button>
            <Button type='submit' className=' bg-green-500 w-40 '>
              {creatingBillInvoice ? (
                <>
                  <Loader2Icon className='animate-spin' /> Creating Invoice
                </>
              ) : (
                <>Create Invoice</>
              )}
            </Button>
          </div>
        </form>
      </Form>
      {dataForBillingInvoice !== null ? dataForBillingInvoice : ''}
    </section>
  );
};

export default CreateBillForm;

{
  /*
  
  PROCEDURE 1
   const { data, status, success, message, error } =
    await chalanAction.PREPARE.prepareMergedItems(selectedChalanNumbers);
  const mergedItems = await JSON.parse(data);
  // console.log('mergedItems received in create invoice', mergedItems);
  const items = [];
  let totalCost = 0;
  for (const itemId in mergedItems) {
    const itemCost = mergedItems[itemId];
    totalCost += itemCost;
    const res = await fetchItemByItemId(itemId);
    const item = await JSON.parse(res.data);

    console.warn('The Items', item);
    const { itemNumber, itemName, itemPrice, workOrder } = item;
    items.push({
      itemId, // Use the key as the itemId property
      itemCost, // Use the value as the itemCost property
      itemNumber,
      itemPrice,
      itemName,
      workOrder,
    });
  }

  PROCEDURE 2
  
  
  */
}

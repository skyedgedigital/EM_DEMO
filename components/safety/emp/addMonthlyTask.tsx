import mongoose from 'mongoose';
import MonthlyTaskAction from '@/lib/actions/SafetyEmp/monthly/MonthlyTaskAction';
import {
  EventStatusNames,
  IMonthlyTask,
} from '@/lib/models/safetyPanel/emp/monthlyTask.model';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { IEmployeesBySelectedHRWorkOrderIDResponse } from '@/lib/actions/HR/EmployeeData/fetch';
import { IWorkOrderHr } from '@/lib/models/HR/workOrderHr.model';
import EmployeeDataAction from '@/lib/actions/HR/EmployeeData/employeeDataAction';
import { Loader2Icon, RefreshCcw } from 'lucide-react';
import WorkOrderHrAction from '@/lib/actions/HR/workOrderHr/workOrderAction';

const EventFormSchema = z.object({
  eventName: z.string().min(3, 'Event name is too short'),
  eventDescription: z.string().optional().default(''),
  eventDate: z.string().transform((val) => new Date(val)),
  assignedTo: z
    .string()
    .min(1, 'Assigned to is necessary')
    .transform((val) => new mongoose.Types.ObjectId(val)),
  status: z.enum(EventStatusNames).default('pending'),
});
type EventFormType = z.infer<typeof EventFormSchema>;

const AddMonthlyTask = () => {
  const [employees, setAllEmployees] = useState<
    IEmployeesBySelectedHRWorkOrderIDResponse[]
  >([]);
  const [
    selectedWorkOrderFilterForEmployees,
    setSelectedWorkOrderFilterForEmployees,
  ] = useState<string>(null);
  const [hrWorkOrders, setHrWorkOrders] =
    useState<(IWorkOrderHr & { _id: string })[]>(null);

  const { register, watch, handleSubmit, formState } = useForm<EventFormType>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      assignedTo: '',
      eventName: '',
      eventDescription: '',
      eventDate: new Date(),
      status: 'pending',
    },
  });
  const [loadingStates, setLoadingStates] = useState<{
    loadingEmployees: boolean;
    creatingMonthlyTask: boolean;
  }>({
    loadingEmployees: true,
    creatingMonthlyTask: false,
  });
  const formData = watch();
  const fetchEmployee = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, loadingEmployees: true }));
      const { data, message, success } =
        await EmployeeDataAction.FETCH.fetchEmployeesBySelectedHRWorkOrderID(
          selectedWorkOrderFilterForEmployees,
          ['name', 'code']
        );

      if (success) {
        const empData = data;
        console.log('employees', empData);
        setAllEmployees(empData);
      } else {
        toast.error(message || 'Failed to load employees, Please try later');
      }
    } catch (error) {
      toast.error('An error occurred while fetching employees');
    } finally {
      setLoadingStates((prev) => ({ ...prev, loadingEmployees: false }));
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [selectedWorkOrderFilterForEmployees]);
  useEffect(() => {
    const fetchHrWorkOrders = async () => {
      try {
        const { data, error, message, status, success } =
          await WorkOrderHrAction.FETCH.fetchAllValidWorkOrderHr([
            'workOrderNumber',
          ]);
        if (success) {
          const parsedData = await JSON.parse(data);
          // console.log("fetched workorder hr", parsedData.length, parsedData);
          setHrWorkOrders(parsedData);
        }
        if (!success) {
          toast.error('Failed to load HR WorkOrders to filter employee', {
            duration: 5000,
          });
        }
      } catch (error) {
        console.log('Fetching Work order Failed', error);
      }
    };
    fetchHrWorkOrders();
  }, []);

  const onSubmit = async (submittedEventData: EventFormType) => {
    try {
      setLoadingStates((prev) => ({ ...prev, creatingMonthlyTask: true }));

      const { data, status, success, message, error } =
        await MonthlyTaskAction.CREATE.createMonthlyTask(
          submittedEventData as IMonthlyTask
        );

      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log('Error creating monthly task', error);
      toast.error(
        error?.message ||
          JSON.stringify(error) ||
          'Unexpected error occurred, Failed to create monthly task, Please try later'
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, creatingMonthlyTask: false }));
    }
  };

  useEffect(() => {
    console.log('error', formState.errors);
  }, [formState.errors]);
  return (
    <>
      <h1 className='w-full text-center my-4 text-lg md:text-xl lg:text-2xl'>
        Add Monthly Task
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mx-auto mt-4 p-6 bg-white shadow-md rounded-md  flex flex-col gap-2'
      >
        <div className='flex flex-col md:flex-row gap-4 justify-start items-start'>
          <div className='mb-4 w-full lg:w-[30%]'>
            <label
              htmlFor='eventName'
              className='block text-sm font-medium text-gray-700'
            >
              Event Name:
            </label>
            <input
              {...register('eventName', { required: true })}
              type='text'
              id='eventName'
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />{' '}
            {formState.errors.eventName && (
              <p className='text-red-500 text-xs mt-1'>
                {formState.errors.eventName.message}
              </p>
            )}
          </div>
          <div className='mb-4'>
            <label
              htmlFor='eventDate'
              className='block text-sm font-medium text-gray-700'
            >
              Event Date:
            </label>
            <input
              {...register('eventDate', { required: true })}
              type='date'
              id='eventDate'
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />{' '}
            {formState.errors.eventDate && (
              <p className='text-red-500 text-xs mt-1'>
                {formState.errors.eventDate.message}
              </p>
            )}
          </div>
          <div className='mb-4'>
            <label
              htmlFor='status'
              className='block text-sm font-medium text-gray-700'
            >
              Status:
            </label>
            <select
              id='status'
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              // onChange={(e) =>
              //   setSelectedWorkOrderFilterForEmployees(e.currentTarget.value)
              // }
              {...register('status')}
            >
              {' '}
              {/* <option value={''}>All Employees</option> */}
              {EventStatusNames?.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
            {/* {errors.title && (
                  <p className='text-red-500 text-sm'>{errors.title.message}</p>
                )} */}
          </div>
          <div className='mb-4 flex-grow'>
            <label
              htmlFor='event'
              className='block text-sm font-medium text-gray-700'
            >
              Event Description(optional):
            </label>
            <textarea
              id='event'
              {...register('eventDescription', { required: true })}
              className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />{' '}
            {formState.errors.eventDescription && (
              <p className='text-red-500 text-xs mt-1'>
                {formState.errors.eventDescription.message}
              </p>
            )}
          </div>{' '}
        </div>

        <div className='flex flex-col gap-3 border-[1px] border-gray-200 rounded p-2'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <h2 className='font-semibold'>Event appoint to:</h2>
            {formState.errors.assignedTo && (
              <p className='text-red-500 text-xs mt-1'>
                {formState.errors.assignedTo.message}
              </p>
            )}
            <div className='flex flex-col md:flex-row gap-1 items-end'>
              <div className='flex flex-col gap-1 p-1 '>
                <label htmlFor='woHr' className='md:mr-8'>
                  Filter Employee by Work Order:
                </label>
                <select
                  id='woHr'
                  className='border-[1px] flex-grow border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
                  onChange={(e) =>
                    setSelectedWorkOrderFilterForEmployees(
                      e.currentTarget.value
                    )
                  }
                >
                  {' '}
                  <option value={''}>All Employees</option>
                  {hrWorkOrders?.map((wo) => (
                    <option value={wo?._id} key={wo?._id}>
                      {wo.workOrderNumber}
                    </option>
                  ))}
                </select>
                {/* {errors.title && (
                  <p className='text-red-500 text-sm'>{errors.title.message}</p>
                )} */}
              </div>
              <button
                onClick={fetchEmployee}
                type='button'
                className='flex justify-center items-center gap-2 px-2 py-2 border-[1px] border-blue-400 rounded bg-white text-blue-500 text-nowrap text-sm font-semibold mb-1'
              >
                <RefreshCcw
                  className={`${
                    loadingStates.loadingEmployees && `animate-spin`
                  } w-[16px] h-[16px] `}
                />
                <>Reload Employees</>
              </button>
            </div>
          </div>
          {employees.length === 0 ? (
            <div className='w-full h-full flex justify-center items-center'>
              <p>No employees found</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 max-h-screen overflow-auto'>
              {employees.map((employee) => (
                <label
                  key={employee._id.toString()}
                  htmlFor={employee._id.toString()}
                  className='flex items-center gap-2 border-[.5px] p-1 px-2 border-gray-200 lowercase hover:bg-gray-100 text-gray-700'
                >
                  <input
                    name='assignedTo'
                    type='radio'
                    value={employee._id}
                    id={employee._id.toString()}
                    {...register('assignedTo')}
                    checked={
                      formData.assignedTo.toString() === employee._id.toString()
                    }
                  />
                  {employee.name} ({employee.code})
                </label>
              ))}
            </div>
          )}
        </div>
        <div className='w-full flex justify-center items-center mt-4'>
          <button
            type='submit'
            className=' inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            {loadingStates.creatingMonthlyTask ? (
              <>
                {' '}
                <Loader2Icon className='animate-spin' />
                Create Monthly Task
              </>
            ) : (
              <>Create Monthly Task</>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddMonthlyTask;

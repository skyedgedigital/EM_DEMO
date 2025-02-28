import { IEmployeeData } from '@/interfaces/HR/EmployeeData.interface';
import EmployeeDataAction from '@/lib/actions/HR/EmployeeData/employeeDataAction';
import { ITrainingExam } from '@/lib/models/Safety/training.model';
import mongoose from 'mongoose';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface IEmployee extends Pick<IEmployeeData, 'code' | 'name'> {
  _id: mongoose.Types.ObjectId;
}
const CreateTraining = () => {
  const [employees, setAllEmployees] = useState<IEmployee[]>();
  const { register, control, formState, watch, setValue } =
    useForm<ITrainingExam>({
      defaultValues: {
        allowedCandidates: [],
        questions: [],
        trainer: '',
        targetDate: null,
        responsibility: '',
      },
    });

  const formData = watch();
  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });
  const fetchEmployee = async () => {
    try {
      const { data, message, error, status, success } =
        await EmployeeDataAction.FETCH.fetchAllEmployeesSelectedFieldInfos([
          'name',
          'code',
        ]);

      if (success) {
        const empData: IEmployee[] = await JSON.parse(data);
        console.log('empData', empData);
        setAllEmployees(empData);
      }
      if (!success) {
        toast.error(message || 'Failed to load employees, Please try later');
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (_id: mongoose.Types.ObjectId) => {
    const allowedCandidates = watch('allowedCandidates');
    const updatedCandidates = allowedCandidates.includes(_id)
      ? allowedCandidates.filter((id) => id !== _id)
      : [...allowedCandidates, _id];

    setValue('allowedCandidates', updatedCandidates);
  };
  return (
    <section>
      {/* <div>{JSON.stringify(formData)}</div> */}
      <h2 className='text-lg text-blue-500 font-semibold'>
        Fill details to create training
      </h2>
      <form className='flex flex-col gap-2'>
        <div className='flex gap-2 items-center'>
          <div className=' flex flex-col gap-1  flex-grow p-1'>
            <label htmlFor='targetDate'>Title</label>
            <input
              id='title'
              type='text'
              {...register('title', {
                required: true,
                //   onChange: debouncedUpdate,
              })}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />{' '}
          </div>
          <div className=' flex flex-col gap-1  flex-grow p-1'>
            <label htmlFor='targetDate'>Date</label>
            <input
              id='targetDate'
              type='date'
              {...register('targetDate', {
                required: true,
                //   onChange: debouncedUpdate,
              })}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />{' '}
          </div>
          <div className='w-1/2 flex flex-col gap-1  flex-grow p-1'>
            <label htmlFor='responsibility'>Responsibility</label>
            <textarea
              id='responsibility'
              {...register('responsibility', {
                //   onChange: debouncedUpdate,
              })}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />{' '}
          </div>
        </div>
        <div className=' flex flex-col gap-1 border-[1px] border-gray-200 p-2'>
          <h2 className='font-semibold'>Select Participants:</h2>
          <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 max-h-screen overflow-auto'>
            {employees?.map((employee) => (
              <label
                key={employee._id.toString()}
                htmlFor={`employee-${employee._id}`}
                className='flex items-center gap-2 border-[.5px] p-1 px-2 border-gray-200 lowercase hover:bg-gray-100 text-gray-700'
              >
                <input
                  type='checkbox'
                  id={`employee-${employee._id}`}
                  checked={formData.allowedCandidates.includes(employee._id)}
                  onChange={() => handleCheckboxChange(employee._id)}
                />
                {employee.name} ({employee.code})
              </label>
            ))}
          </div>
        </div>
        <div>
          <h2 className='font-semibold'>Create Questions:</h2>
        </div>
      </form>
    </section>
  );
};

export default CreateTraining;

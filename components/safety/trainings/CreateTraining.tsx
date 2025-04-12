import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, Plus } from 'lucide-react';
import mongoose from 'mongoose';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const trainingSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  trainer: z.instanceof(mongoose.Types.ObjectId),
  trainingDate: z.date(),
  responsibility: z.string().optional(),
});
type TrainingFormData = z.infer<typeof trainingSchema>;

const CreateTraining = ({
  reloadMonthlyTraining = () => {
    console.log('Running default function to load monthly trainings');
  },
}: {
  reloadMonthlyTraining?: () => void;
}) => {
  const session = useSession();

  // Use the Zod schema with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema), // Integrate Zod resolver
    defaultValues: {
      trainer: new mongoose.Types.ObjectId(),
      responsibility: '',
      title: '',
      trainingDate: null,
    },
  });

  const [loadingStates, setLoadingStates] = useState<{
    creatingTraining: boolean;
  }>({
    creatingTraining: false,
  });
  useEffect(() => {
    if (session && session?.data?.user._id) {
      setValue(
        'trainer',
        new mongoose.Types.ObjectId(session?.data?.user?._id)
      );
    }
  }, [session]);

  const onSubmit = async (submittedFormData: TrainingFormData) => {
    try {
      setLoadingStates((prev) => ({ ...prev, creatingTraining: true }));
      console.log('Submitted Data', submittedFormData);

      const { data, status, success, message, error } =
        await trainingActions.CREATE.createTraining(submittedFormData);

      if (success) {
        toast.success(message);
        reset();
        reloadMonthlyTraining();
      }
      if (!success) {
        toast.error(message);
      }
    } catch (error) {
      console.log('errrrrrrrr', error);
      toast.error(
        error.message ||
          JSON.stringify(error) ||
          'Unexpected error occurred, Please try later'
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, creatingTraining: false }));
    }
  };
  return (
    <section className='border-[1px] border-gray-300 rounded p-2'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <h2 className='text-blue-500 font-semibold'>
          Fill details to create training:
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <div className='flex flex-col gap-1 flex-grow p-1'>
            <label className='text-sm' htmlFor='title'>
              Title:
            </label>
            <input
              id='title'
              type='text'
              {...register('title', { required: true })}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />
            {errors.title && (
              <p className='text-red-500 text-sm'>{errors.title.message}</p>
            )}
          </div>
          <div className='flex flex-col gap-1 flex-grow p-1'>
            <label className='text-sm' htmlFor='trainingDate'>
              Date:
            </label>
            <input
              id='trainingDate'
              type='date'
              {...register('trainingDate', {
                valueAsDate: true,
                required: true,
              })}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />
            {errors.trainingDate && (
              <p className='text-red-500 text-sm'>
                {errors.trainingDate.message}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-1 col-span-2 p-1'>
            <label className='text-sm' htmlFor='responsibility'>
              Responsibility (optional):
            </label>
            <textarea
              id='responsibility'
              {...register('responsibility')}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />
          </div>
        </div>

        <button
          disabled={loadingStates.creatingTraining}
          type='submit'
          className='bg-green-700 disabled:bg-green-500 flex justify-center items-center gap-2 text-white p-2 rounded w-fit px-3 py-1 mx-auto my-4'
        >
          {loadingStates.creatingTraining && (
            <Loader2Icon className='animate-spin' />
          )}
          <>Create Training</>
        </button>
      </form>
    </section>
  );
};

export default CreateTraining;

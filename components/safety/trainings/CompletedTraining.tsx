'use client';
import { ICompletedTrainingsResponse } from '@/lib/actions/safety/training/fetch';
import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import { Loader2Icon, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CompletedTraining = () => {
  const [completedTrainings, setCompletedTrainings] =
    useState<ICompletedTrainingsResponse[]>(null);
  const [loadingStates, setLoadingStates] = useState({
    loadingCompletedTrainings: true,
  });
  const fetchCompletedTraining = async () => {
    try {
      setLoadingStates((prev) => ({
        ...prev,
        loadingCompletedTrainings: true,
      }));
      const { data, status, success, message, error } =
        await trainingActions.FETCH.fetchCompletedTrainings();
      // console.log('Upcoming trainings', data);

      if (success) {
        setCompletedTrainings(data);
      }
      if (!success) {
        toast.error(message);
      }
    } catch (error) {
      toast.error(
        error.message || 'Unexpected error occurred, Please try later'
      );
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        loadingCompletedTrainings: false,
      }));
    }
  };
  useEffect(() => {
    fetchCompletedTraining();
  }, []);

  console.log('Upcoming trainings', completedTrainings);
  return (
    <section className='flex flex-col gap-2'>
      <div className='flex justify-between items-center'>
        <h2 className='font-semibold text-blue-500'>All Upcoming Trainings:</h2>
        <button
          onClick={fetchCompletedTraining}
          className='flex gap-2 justify-center items-center bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-3'
        >
          {loadingStates.loadingCompletedTrainings ? (
            <Loader2Icon className='animate-spin' />
          ) : (
            <RefreshCcw />
          )}
          <>Refresh</>
        </button>{' '}
      </div>
      {loadingStates.loadingCompletedTrainings ? (
        <div className='flex justify-center items-center p-4 gap-2'>
          <p>Loading Trainings...</p>
          <Loader2Icon className='text-blue-500 animate-spin' />
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center gap-2'>
          {completedTrainings?.map((training, index) => (
            <Link
              target='_blank'
              href={`/safety/trainings/trainingDetails?trainingId=${training._id}`}
              key={training.title}
              className='flex justify-start gap-6 items-center w-full border-b-[1px] border-gray-200 p-2 mt-2 hover:bg-gray-50'
            >
              {/* <div className=' rounded flex justify-start items-center gap-6'> */}
              <div className='flex justify-start items-center gap-2'>
                <p className='text-sm text-gray-600'>Title:</p>
                <p className='font-semibold capitalize text-gray-900'>
                  {training.title}
                </p>
              </div>
              <div className='flex justify-start items-center gap-2'>
                <p className='text-sm text-gray-600'>Allowed candidates:</p>
                <p className='font-semibold capitalize text-gray-900'>
                  {training.allowedCandidates.length}
                </p>
              </div>
              <div className='flex justify-start items-center gap-2'>
                <p className='text-sm text-gray-600'>Created on:</p>
                <p className='font-semibold capitalize text-gray-900'>
                  {new Date(training.createdAt).toLocaleDateString()}
                </p>
              </div>
              {/* </div> */}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CompletedTraining;

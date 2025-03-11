'use client';
import { ITrainingDetailWithExamsResponse } from '@/lib/actions/safety/training/fetch';
import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import { Loader2Icon, RefreshCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const TrainingDetails = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const trainingId = searchParams.trainingId || undefined;
  const [trainingDetails, setTrainingDetails] =
    useState<ITrainingDetailWithExamsResponse>(null);
  const [loadingStates, setLoadingStates] = useState({
    loadingTrainingDetails: true,
  });
  const fetchTrainingDetails = async () => {
    try {
      setLoadingStates((prev) => ({
        ...prev,
        loadingTrainingDetails: true,
      }));
      const { data, status, success, message, error } =
        await trainingActions.FETCH.fetchTrainingDetailWithExamsById(
          trainingId
        );
      if (success) {
        setTrainingDetails(data);
        toast.success(message);
      }
      if (!success) {
        toast.error(message);
      }
    } catch (error) {
      console.log('Fetching Training Exam Details failed', error);
      toast.error(
        error.message || 'Unexpected error occurred, Please try later'
      );
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        loadingTrainingDetails: false,
      }));
    }
  };

  useEffect(() => {
    if (!trainingId) return;
    fetchTrainingDetails();
  }, [trainingId]);

  console.log('Training details', trainingDetails);
  return (
    <section>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        Training Details
      </h1>
      <div className='flex justify-between items-center'>
        <h2 className='font-semibold text-blue-500'>All Upcoming Trainings:</h2>
        <button
          onClick={fetchTrainingDetails}
          className='flex gap-2 justify-center items-center bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-3'
        >
          {loadingStates.loadingTrainingDetails ? (
            <Loader2Icon className='animate-spin' />
          ) : (
            <RefreshCcw />
          )}
          <>Refresh</>
        </button>{' '}
      </div>
      {JSON.stringify(searchParams)}
      {JSON.stringify(trainingDetails)}
    </section>
  );
};

export default TrainingDetails;

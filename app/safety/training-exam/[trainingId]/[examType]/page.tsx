'use client';
import React, { useState } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import toast from 'react-hot-toast';
import { ArrowRight, Loader2Icon } from 'lucide-react';
import mongoose from 'mongoose';
import TrainingQuestionsForms from '@/components/safety/trainings/TrainingQuestionForm';
import { ExamTypes } from '@/lib/models/Safety/training.model';

const ExamPage = ({
  params,
}: {
  params: { [key: string]: string | undefined };
}) => {
  const trainingId = params?.trainingId || undefined;
  const examType = params.examType || undefined;
  const [isCandidateAllowed, setIsCandidateAllowed] = useState(false);
  const [checkEligibility, setCheckEligibility] = useState(false);
  const [candidateId, setCandidateId] = useState<mongoose.Types.ObjectId>(null);
  const { setValue, register, handleSubmit, formState, watch } = useForm<{
    employeeCode: string;
  }>({
    defaultValues: {
      employeeCode: null,
    },
  });

  const formData = watch();

  if (!trainingId) {
    return (
      <div className=' mt-16 min-h-screen'>
        <span className='text-red-400 flex justify-center items-center gap-2'>
          <ExclamationTriangleIcon className='w-[20px] h-[20px]' />
          <p>No Exam Found</p>
        </span>
      </div>
    );
  }

  const checkIfCandidateAllowed = async (submittedFormData: {
    employeeCode: string;
  }) => {
    console.log('submittedFormData', submittedFormData);
    try {
      setCheckEligibility(true);
      const { data, success, error, status, message } =
        await trainingActions.CHECKS.checkEmployeeTrainingExamEligibility(
          submittedFormData.employeeCode,
          trainingId,
          examType as ExamTypes
        );
      if (success && data) {
        setCandidateId(data._id);
        setIsCandidateAllowed(true);
      }
      if (!data?.eligible) {
        return toast.error(message);
      }
      console.log('response', success, data);
    } catch (error) {
    } finally {
      setCheckEligibility(false);
    }
  };
  return (
    <div className=' mt-16 min-h-[90vh] flex flex-col justify-between '>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        Training Exam
      </h1>
      {isCandidateAllowed ? (
        <TrainingQuestionsForms
          employeeCode={formData.employeeCode}
          trainingId={trainingId}
          candidate={candidateId}
          examType={examType}
        />
      ) : (
        <div className=' h-full flex-grow flex justify-center items-center'>
          {/* Little form to check eligibility */}
          <form
            onSubmit={handleSubmit(checkIfCandidateAllowed)}
            className='shadow p-3 border-[1px] border-gray-300 flex flex-col gap-3  rounded'
          >
            <div className='flex flex-col gap-2 flex-grow p-1'>
              <label htmlFor='employeeCode' className='font-semibold'>
                Enter your employee code to proceed:
              </label>
              <input
                id='employeeCode'
                type='text'
                {...register('employeeCode', { required: true, minLength: 1 })}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />
              {formState.errors.employeeCode && (
                <p className='text-red-500 text-sm'>
                  {formState.errors.employeeCode.message}
                </p>
              )}
            </div>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded flex justify-between items-center gap-8 text-white shadow'
            >
              <>Proceed to Test</>
              {checkEligibility ? (
                <Loader2Icon className='animate-spin' />
              ) : (
                <ArrowRight />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExamPage;

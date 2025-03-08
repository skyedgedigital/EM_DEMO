'use client';
import React, { useEffect, useState } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { ITrainingExam } from '../../../../lib/models/Safety/training.model';
import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  ArrowUpRightFromSquareIcon,
  Loader2Icon,
} from 'lucide-react';
import { checkEmployeeTrainingExamEligibility } from '../../../../lib/actions/safety/training/checks';

const ExamPage = ({
  params,
}: {
  params: { [key: string]: string | undefined };
}) => {
  const examId = params?.examId || undefined;
  const [isCandidateAllowed, setIsCandidateAllowed] = useState(false);
  const [checkEligibility, setCheckEligibility] = useState(false);
  {
  }
  const { setValue, register, handleSubmit, formState } = useForm<{
    employeeCode: string;
  }>({
    defaultValues: {
      employeeCode: null,
    },
  });

  if (!examId) {
    return (
      <div className='border-2 border-red-500 mt-16 min-h-screen'>
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
          examId
        );
      if (success) {
        data.eligible && setIsCandidateAllowed(true);
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
    <div className='border-2 border-red-500 mt-16 min-h-[90vh] flex flex-col justify-between '>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        Training Exam
      </h1>
      <div className='border-2 border-blue-600 h-full flex-grow flex justify-center items-center'>
        {isCandidateAllowed ? (
          <QuestionsForms examId={examId} />
        ) : (
          // Little form to check eligibility
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
        )}
      </div>
    </div>
  );
};

export default ExamPage;

const QuestionsForms = ({ examId }) => {
  const [exam, setExam] = useState<Partial<ITrainingExam>>(null);
  useEffect(() => {
    const fn = async () => {
      try {
        console.log('fetching exam');
        const { data, status, success, message, error } =
          await trainingActions.FETCH.fetchSelectedInfosOfExamByExamId(examId, [
            'title',
            'questions',
            'responsibility',
            'targetDate',
            'allowedCandidates',
          ]);
        console.log(data);
        if (success) {
          console.log('received exam', exam);
          setExam(data);
        }
        if (!success) {
          console.log('error', message);
          toast.error(message || 'Failed to load exam questions');
        }
      } catch (error) {
        console.error('ERROR', error);
        toast.error(
          error.message || 'Something went wrong Failed to load exam'
        );
      }
    };
    if (examId) fn();
  }, [examId]);
  return (
    <div>
      {' '}
      <div className='w-full'>ExamPage {examId}</div>
      <div>{JSON.stringify(exam)}</div>
    </div>
  );
};

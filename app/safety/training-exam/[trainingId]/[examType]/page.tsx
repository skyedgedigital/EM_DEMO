'use client';
import React, { FormEvent, FormEventHandler, useEffect, useState } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { ITrainingExamAttempt } from '../../../../../lib/models/Safety/training.model';
import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import toast from 'react-hot-toast';
import { ArrowRight, Loader2Icon } from 'lucide-react';
import mongoose from 'mongoose';
import { IEmployeeData } from '@/interfaces/HR/EmployeeData.interface';
import EmployeeDataAction from '@/lib/actions/HR/EmployeeData/employeeDataAction';
import { IRequiredDetailsForATrainingExam } from '@/lib/actions/safety/training/fetch';

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
          trainingId
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
        <QuestionsForms
          employeeCode={formData.employeeCode}
          trainingId={trainingId}
          candidate={candidateId}
          examType={examType}
        />
      ) : (
        <div className='border-2 border-blue-600 h-full flex-grow flex justify-center items-center'>
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

const QuestionsForms = ({ trainingId, candidate, employeeCode, examType }) => {
  const [exam, setExam] = useState<IRequiredDetailsForATrainingExam>(null);
  const [employee, setEmployee] = useState<Partial<IEmployeeData>>();
  const [attemptedAnswers, setAttemptedAnswers] = useState<
    Partial<ITrainingExamAttempt>
  >({
    candidate,
    exam: trainingId,
    responses: [],
  });
  const [loadingStates, setLoadingStates] = useState({
    submittingAnswer: false,
  });
  // console.log('ATTEMPTED ANSWER', attemptedAnswers);
  useEffect(() => {
    if (attemptedAnswers.responses.length > 0 || !exam) return;
    setAttemptedAnswers((prev) => ({
      ...prev,
      responses: Array.from({ length: exam.questions.length }, () => ({
        selectedAnswer: null,
      })),
    }));
  }, [exam]);

  useEffect(() => {
    const fn = async () => {
      const { data, error, message, status, success } =
        await EmployeeDataAction.FETCH.fetchEmployeeSelectedFieldByCode(
          employeeCode,
          ['name', 'code', 'fathersName']
        );

      if (!success) {
        return toast.error('Failed to load your details');
      }
      if (success) {
        setEmployee(data);
      }
    };
    if (employeeCode) fn();
  }, [employeeCode]);

  useEffect(() => {
    const fn = async () => {
      try {
        console.log('fetching exam');
        const { data, status, success, message, error } =
          await trainingActions.FETCH.fetchRequiredDetailsForATrainingExam(
            trainingId,
            examType
          );
        console.log('received combined details', data);
        if (success) {
          setExam(data);
          setAttemptedAnswers((prev) => ({ ...prev, exam: data.examId }));
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
    if (trainingId) fn();
  }, [trainingId]);

  const handleOptionChange = (quNo: number, opNo: number) => {
    const currentAnswers = [...attemptedAnswers.responses];
    currentAnswers[quNo].selectedAnswer = opNo;
    setAttemptedAnswers((prev) => ({
      ...prev,
      responses: currentAnswers,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (let i = 0; i < attemptedAnswers.responses.length; i++) {
      if (!attemptedAnswers.responses[i].selectedAnswer) {
        return toast.error('Please attempt all questions');
      }
    }
    try {
      setLoadingStates((prev) => ({ ...prev, submittingAnswer: true }));
      console.log('Submitted Answer', attemptedAnswers);
      const { data, status, success, message, error } =
        await trainingActions.CREATE.createExamAttempt(attemptedAnswers);

      if (!success) {
        toast.error(message);
      }
      if (success) {
        toast.success(message);
      }
    } catch (error) {
      toast.error(
        error.message || 'Attempt could not be saved, Please try later'
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, submittingAnswer: false }));
    }

    // SEND DATA TO BACKEND
  };
  return (
    <div className='h-full flex-grow p-6 flex flex-col gap-4'>
      {/* <div>EXAM DETAILS - {JSON.stringify(exam)}</div>
      ------------------------------------------ <br />
      {JSON.stringify(employee)}
      ------------------------------------------ <br />
      */}
      {/* ATTEMPTED ANSWER:-{JSON.stringify(attemptedAnswers)} */}
      {employee && (
        <div className='w-full flex flex-col gap-2 border-[1px] border-gray-200 rounded shadow-sm p-3'>
          <h1 className='text-blue-500 font-semibold'>Candidate Details:</h1>
          <div className='w-full flex justify-start items-start gap-6'>
            <span className='flex justify-center items-center gap-1'>
              <label className='text-sm text-gray-500'>Name:</label>
              <p>{employee?.name}</p>
            </span>
            <span className='flex justify-center items-center gap-1'>
              <label className='text-sm text-gray-500'>Code:</label>
              <p>{employee?.code}</p>
            </span>
            <span className='flex justify-center items-center gap-1'>
              <label className='text-sm text-gray-500'>Father Name:</label>
              <p>{employee?.fathersName}</p>
            </span>
          </div>
        </div>
      )}
      {exam && (
        <div className='w-full flex flex-col gap-2 border-[1px] border-gray-200 rounded shadow-sm p-3'>
          <h1 className='text-blue-500 font-semibold'>Exam:</h1>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex justify-center items-center gap-3'>
              <div className='w-full'>
                <label className='text-sm text-gray-500'>Title:</label>
                <p>{exam?.title}</p>
              </div>
              <div className='w-full'>
                <label className='text-sm text-gray-500'>Responsibility:</label>
                <p>{exam?.responsibility}</p>
              </div>
              <div className='w-full'>
                <label className='text-sm text-gray-500'>Exam Date:</label>
                <p>{exam?.targetDate?.toString()}</p>
              </div>
            </div>
            <div className='flex flex-col gap-6'>
              <h1 className='font-semibold border-b-[1px] border-gray-200'>
                Questions (All questions are must to answer):
              </h1>
              <div className='flex flex-col gap-4'>
                {exam.questions.map((ques, qNo) => (
                  <div key={ques.text} className='flex flex-col gap-1'>
                    <p className='font-semibold'>
                      Q{qNo + 1}: {ques.text}
                    </p>
                    <div className='flex items-start gap-4'>
                      {ques.options.map((op, opNo) => (
                        <span
                          key={op.text}
                          className='border-[1px] border-gray-200 rounded p-1 px-2 gap-2 hover:bg-gray-200 flex justify-center items-center'
                        >
                          <label
                            className='capitalize flex justify-center items-center gap-2'
                            htmlFor={`${qNo}-${opNo}`}
                          >
                            <input
                              id={`${qNo}-${opNo}`}
                              name={`question-${qNo}`}
                              type='radio'
                              onChange={() => handleOptionChange(qNo, opNo)}
                            />
                            {op.text}
                          </label>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              type='submit'
              className='bg-green-500 text-white p-2 rounded w-fit px-2 py-1 mx-auto my-4'
            >
              {loadingStates.submittingAnswer ? (
                <Loader2Icon className='animate-spin' />
              ) : (
                <>Submit Answer</>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

'use client';
import React, { FormEvent, useEffect, useState } from 'react';

import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import toast from 'react-hot-toast';
import { Loader2Icon } from 'lucide-react';
import { IEmployeeData } from '@/interfaces/HR/EmployeeData.interface';
import EmployeeDataAction from '@/lib/actions/HR/EmployeeData/employeeDataAction';
import { IRequiredDetailsForATrainingExam } from '@/lib/actions/safety/training/fetch';
import { useRouter } from 'next/navigation';
import { ITrainingExamAttempt } from '@/lib/models/Safety/training.model';

const TrainingQuestionsForms = ({
  trainingId,
  candidate,
  employeeCode,
  examType,
}) => {
  const router = useRouter();
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
      if (attemptedAnswers.responses[i].selectedAnswer === null) {
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
        // router.replace(`/safety/training-exam/${trainingId}/${examType}`);
        setTimeout(() => {
          toast.success('Redirecting to home page...');
        }, 1000);
        setTimeout(() => {
          router.replace('/');
        }, 3000);
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
                <p>{new Date(exam?.targetDate).toLocaleDateString()}</p>
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

export default TrainingQuestionsForms;

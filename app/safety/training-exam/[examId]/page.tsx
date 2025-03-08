'use client';
import React, { FormEvent, FormEventHandler, useEffect, useState } from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import {
  IAttempt,
  IQuestion,
  ITrainingExam,
} from '../../../../lib/models/Safety/training.model';
import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import toast from 'react-hot-toast';
import { ArrowRight, Loader2Icon } from 'lucide-react';
import { z } from 'zod';
import mongoose from 'mongoose';
import { IEmployeeData } from '@/interfaces/HR/EmployeeData.interface';

const ExamPage = ({
  params,
}: {
  params: { [key: string]: string | undefined };
}) => {
  const examId = params?.examId || undefined;
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
    <div className='border-2 border-red-500 mt-16 min-h-[90vh] flex flex-col justify-between '>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        Training Exam
      </h1>
      {isCandidateAllowed ? (
        <QuestionsForms
          employeeCode={formData.employeeCode}
          examId={examId}
          candidate={candidateId}
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

const attemptSchema = z.object({
  candidate: z.instanceof(mongoose.Types.ObjectId),
  exam: z.instanceof(mongoose.Types.ObjectId),
  score: z.number().default(0),
  responses: z.array(
    z.object({
      selectedAnswers: z.array(z.number()),
    })
  ),
});
const QuestionsForms = ({ examId, candidate, employeeCode }) => {
  const [exam, setExam] = useState<Partial<ITrainingExam>>(null);
  const [employee, setEmployee] = useState<IEmployeeData>();
  const [attemptedAnswers, setAttemptedAnswers] = useState<IAttempt>({
    candidate,
    exam: examId,
    responses: [],
    score: 0,
  });
  console.log('ATTEMPTED ANSWER', attemptedAnswers);
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

  const handleOptionChange = (quNo: number, opNo: number) => {
    const currentAnswers = [...attemptedAnswers.responses];
    currentAnswers[quNo].selectedAnswer = opNo;
    setAttemptedAnswers((prev) => ({
      ...prev,
      responses: currentAnswers,
    }));
    calculateScore();
  };

  const calculateScore = async () => {
    const allQuestions: IQuestion[] = exam.questions;
    const submittedAnswer: Pick<IAttempt, 'responses'> = {
      responses: attemptedAnswers.responses,
    };

    let point = 0;
    // correctAnswer holding the index of correct option in options array
    allQuestions.forEach((ques, index) => {
      if (
        ques.correctAnswer === submittedAnswer.responses[index].selectedAnswer
      ) {
        point++;
      }
    });
    setAttemptedAnswers((prev) => ({ ...prev, score: point }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (let i = 0; i < attemptedAnswers.responses.length; i++) {
      if (attemptedAnswers.responses[i].selectedAnswer === -1) {
        return toast.error('Please attempt all questions');
      }
    }

    // SEND DATA TO BACKEND
  };
  return (
    <div className='border-2 border-green-500 h-full flex-grow p-6'>
      <div>EXAM DETAILS - {JSON.stringify(exam)}</div>
      ------------------------------------------ <br />
      ATTEMPTED ANSWER:-{JSON.stringify(attemptedAnswers)}
      {exam && (
        <div>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex justify-center items-center gap-3'>
              <div className='w-full'>
                <label>Exam Id:</label>
                <p>{examId}</p>
              </div>
              <div className='w-full'>
                <label>Employee Code:</label>
                <p>{employeeCode}</p>
              </div>
              <div className='w-full'>
                <label>Exam Date:</label>
                <p>{exam?.targetDate?.toString()}</p>
              </div>
              <div className='w-full'>
                <label>Responsibility:</label>
                <p>{exam?.responsibility}</p>
              </div>
            </div>
            <div className='flex flex-col gap-6'>
              {exam.questions.map((ques, qNo) => (
                <div key={ques.text} className='flex flex-col gap-1'>
                  <p className='font-semibold'>
                    Q{qNo + 1} {ques.text}
                  </p>
                  <div className='flex items-start gap-4'>
                    {ques.options.map((op, opNo) => (
                      <span
                        key={op.text}
                        className='border-[1px] border-gray-200 rounded p-1 px-2 gap-2 hover:bg-gray-200 flex justify-center items-center'
                      >
                        <input
                          id={`${qNo}-${opNo}`}
                          name={`question-${qNo}`}
                          type='radio'
                          onChange={() => handleOptionChange(qNo, opNo)}
                        />
                        <label
                          className='capitalize flex justify-center items-center gap-2'
                          htmlFor={`${qNo}-${opNo}`}
                        >
                          {op.text}
                        </label>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              type='submit'
              className='bg-green-500 text-white p-2 rounded w-fit px-2 py-1 mx-auto my-4'
            >
              Submit Answer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

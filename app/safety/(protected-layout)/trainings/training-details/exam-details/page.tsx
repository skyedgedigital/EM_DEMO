'use client';
import { IExamAllAttemptsResponse } from '@/lib/actions/safety/training/fetch';
// import { IExamAttemptDetailsResponse } from '@/lib/actions/safety/training/fetch';
import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import { Loader2Icon, RefreshCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const TrainingExamDetailsPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const examId = searchParams?.examId || undefined;
  const [examDetails, setExamDetails] =
    useState<IExamAllAttemptsResponse>(null);
  const [loadingStates, setLoadingStates] = useState({
    loadingExamDetails: true,
  });
  const fetchExamDetails = async () => {
    try {
      setLoadingStates((prev) => ({
        ...prev,
        loadingExamDetails: true,
      }));
      const { data, status, success, message, error } =
        await trainingActions.FETCH.fetchExamAttemptDetails(examId);

      if (success) {
        setExamDetails(data);
        toast.success(message);
      }
      if (!success) {
        toast.error(message);
      }
    } catch (error) {
      console.log('Fetching Exam details failed', error);
      toast.error(
        error.message ||
          'Unexpected error occurred,Failed to fetch exam details, Please try later'
      );
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        loadingExamDetails: false,
      }));
    }
  };

  useEffect(() => {
    if (!examId) {
      toast.error('Invalid ExamId');
      return;
    }
    fetchExamDetails();
  }, [examId]);
  console.log('exam details', examDetails);
  return (
    <section className='px-2'>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        Exam Details
      </h1>
      <div className='flex justify-between items-center'>
        <h2 className='font-semibold text-blue-500 text-nowrap'>
          Exam type: {examDetails?.exam.examType}
        </h2>
        {loadingStates.loadingExamDetails && (
          <div className='w-full flex justify-center items-center'>
            <p>Loading exam details...</p>
            <Loader2Icon className='animate-spin text-blue-500' />
          </div>
        )}
        <button
          onClick={fetchExamDetails}
          className='flex gap-2 justify-center items-center bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-3'
        >
          {loadingStates.loadingExamDetails ? (
            <Loader2Icon className='animate-spin' />
          ) : (
            <RefreshCcw />
          )}
          <>Refresh</>
        </button>{' '}
      </div>
      {/* {JSON.stringify(searchParams)}
      {JSON.stringify(examDetails)} */}

      {examDetails && (
        <div className='w-full flex flex-col gap-4 '>
          <div className='flex flex-col gap-1 border-b-[1px] pb-4 border-gray-200 mt-4'>
            <div className='flex justify-between items-start w-full'>
              <div className='w-full flex justify-start items-center gap-6'>
                <div className=' flex justify-center items-center gap-1'>
                  <label className='text-sm text-gray-600'>Exam Type:</label>
                  <p className='font-semibold'>Pre Training Exam</p>
                </div>
                <div className=' flex justify-center items-center gap-1'>
                  <label className='text-sm text-gray-600'>
                    Responsibility:
                  </label>
                  <p>{examDetails.exam?.responsibility}</p>
                </div>
                <div className=' flex justify-center items-center gap-1'>
                  <label className='text-sm text-gray-600'>Dated for:</label>
                  <p>
                    {new Date(examDetails.exam.targetDate).toLocaleDateString()}
                  </p>
                </div>
                <div className=' flex justify-center items-center gap-1'>
                  <label className='text-sm text-gray-600'>
                    Total Candidate Appeared:
                  </label>
                  <p>{examDetails.submittedAttempts.length}</p>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <h2 className='font-semibold'>Questions:</h2>
              <div className='flex flex-col gap-3'>
                {examDetails.exam.questions.map((question, qno) => (
                  <div
                    key={question.text}
                    className={`flex justify-start items-start p-1 gap-1
                      }`}
                  >
                    <label className='text-sm font-semibold pt-1'>
                      {qno + 1}.
                    </label>
                    <div className='flex flex-col gap-1'>
                      <p>{question.text}</p>
                      <div className='flex flex-col gap-1'>
                        <h4>Options:</h4>
                        <div className='flex justify-start items-center gap-6'>
                          {question.options.map((option, opNo) => (
                            <span
                              key={option.text}
                              className={`flex justify-center items-center gap-1 border-[1px] rounded-full px-3 py-1 capitalize ${
                                opNo === question.correctAnswer
                                  ? ' border-green-700 text-green-700'
                                  : ' border-gray-300 text-gray-600'
                              }`}
                            >
                              <p>{option.text}</p>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-3 border-[1px] border-gray-200 rounded p-2'>
            <h2 className='font-semibold'>Candidates Attempts:</h2>
            <div className='w-full'>
              <table>
                <thead>
                  <tr>
                    <th className='px-4 py-2 text-left'>Sl.</th>
                    <th className='px-4 py-2 text-left'>Employee Code</th>
                    <th className='px-4 py-2 text-left'>Employee Name</th>
                    {examDetails.exam.questions.map((_, qno) => (
                      <th className='px-4 py-2 text-left'>Ans.{qno + 1}</th>
                    ))}
                    <th className='px-4 py-2 text-left'>Scored</th>
                    <th className='px-4 py-2 text-left'>Attempted On</th>
                  </tr>
                </thead>
                <tbody>
                  {examDetails.submittedAttempts.map((ans, i) => (
                    <tr className={`${i % 2 == 0 && 'bg-gray-100'}`}>
                      <td className='px-4 py-2 text-left'>{i + 1}</td>
                      <td className='px-4 py-2 text-left'>
                        {ans.candidate.code}
                      </td>
                      <td className='px-4 py-2 text-left'>
                        {ans.candidate.name}
                      </td>
                      {ans.responses.map((resp, ansNo) => (
                        <td
                          className={`px-4 py-2 text-left ${
                            examDetails.exam.questions[ansNo].correctAnswer !==
                              resp.selectedAnswer && 'text-red-500'
                          }`}
                        >
                          {resp.selectedAnswer + 1}
                        </td>
                      ))}
                      <td className='px-4 py-2 text-left'>{ans.score}</td>
                      <td className='px-4 py-2 text-left'>
                        {new Date(ans.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrainingExamDetailsPage;

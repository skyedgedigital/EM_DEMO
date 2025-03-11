'use client';
import { ITrainingDetailWithExamsResponse } from '@/lib/actions/safety/training/fetch';
import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Loader2Icon, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const TrainingDetails = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const trainingId = searchParams?.trainingId || undefined;
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
  const preTrainingExam = trainingDetails?.exams.find(
    (exam) => exam.examType === 'pre-training-exam'
  );
  const postTrainingExam = trainingDetails?.exams.find(
    (exam) => exam.examType === 'pre-training-exam'
  );
  return (
    <section>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        Training Details
      </h1>
      {/* {JSON.stringify(trainingDetails)} */}
      <div className='flex justify-between items-center px-4'>
        {!trainingDetails && !loadingStates.loadingTrainingDetails && (
          <span className='flex justify-center items-center gap-2 text-red-500'>
            <ExclamationTriangleIcon />
            <>No Training Found</>
          </span>
        )}
        {trainingDetails && !loadingStates.loadingTrainingDetails && (
          <div className='w-full flex justify-start items-center gap-4 '>
            <div className='font-semibold flex justify-center items-center gap-1'>
              <label>Exam title:</label>
              <p className='font-semibold text-blue-500'>
                {trainingDetails.title}
              </p>
            </div>
            <div className='font-semibold flex justify-center items-center gap-1'>
              <label>Created on:</label>
              <p className='font-semibold text-blue-500'>
                {new Date(trainingDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={fetchTrainingDetails}
          className='flex gap-2 justify-center ml-auto items-center bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-3'
        >
          {loadingStates.loadingTrainingDetails ? (
            <Loader2Icon className='animate-spin' />
          ) : (
            <RefreshCcw />
          )}
          <>Refresh</>
        </button>{' '}
      </div>
      {loadingStates.loadingTrainingDetails && (
        <div className='flex justify-center items-center p-4 gap-2'>
          <p>Loading Training Details...</p>
          <Loader2Icon className='text-blue-500 animate-spin' />
        </div>
      )}
      {trainingDetails && (
        <div className='w-full  mt-4 flex flex-col gap-4 p-4'>
          <div className='w-full max-h-screen flex flex-col gap-2 '>
            <h2 className='font-semibold border-b-[1px] border-gray-200 pb-1 text-blue-500'>
              Allowed Candidates:
            </h2>
            <div className='overflow-x-auto w-full'>
              <table className='border-collapse'>
                <thead>
                  <tr>
                    <th className='px-4 py-2 text-left'>Sl.</th>
                    <th className='px-4 py-2 text-left'>Employee Code</th>
                    <th className='px-4 py-2 text-left'>Employee Name</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingDetails.allowedCandidates.map((candidate, i) => (
                    <tr
                      key={candidate.code}
                      className={`${
                        i % 2 === 0 ? 'bg-gray-100' : ''
                      } hover:bg-gray-50`}
                    >
                      <td className='px-4 py-2'>{i + 1}</td>
                      <td className='px-4 py-2'>{candidate.code}</td>
                      <td className='px-4 py-2'>{candidate.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className=' flex flex-col gap-4 py-2'>
            <h2 className='font-semibold border-b-[1px] border-gray-200 text-blue-500'>
              Exams:
            </h2>

            {preTrainingExam ? (
              <div className='flex flex-col gap-1 border-b-[1px] pb-2 border-gray-200 mt-4'>
                <div className='flex justify-between items-start w-full'>
                  <div className='w-full flex justify-start items-center gap-6'>
                    <div className=' flex justify-center items-center gap-1'>
                      <label className='text-sm text-gray-600'>
                        Exam Type:
                      </label>
                      <p className='font-semibold'>Pre Training Exam</p>
                    </div>
                    <div className=' flex justify-center items-center gap-1'>
                      <label className='text-sm text-gray-600'>
                        Responsibility:
                      </label>
                      <p>{preTrainingExam?.responsibility}</p>
                    </div>
                    <div className=' flex justify-center items-center gap-1'>
                      <label className='text-sm text-gray-600'>
                        Dated for:
                      </label>
                      <p>
                        {new Date(
                          preTrainingExam.targetDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className=' flex justify-center items-center gap-1'>
                      <label className='text-sm text-gray-600'>
                        Total Candidate Appeared:
                      </label>
                      <p>{preTrainingExam.totalCandidatesAttempted}</p>
                    </div>
                  </div>
                  <Link
                    href={''}
                    className='flex gap-2 justify-center ml-auto items-center  hover:bg-blue-500 hover:text-white text-blue-500 border-[1px] border-blue-400 text-nowrap rounded py-1 px-3'
                  >
                    See exam details
                  </Link>
                </div>
                <div className='flex flex-col gap-1'>
                  <h2 className='font-semibold'>Questions:</h2>
                  <div className='flex flex-col gap-2'>
                    {preTrainingExam.questions.map((question, qno) => (
                      <div
                        key={question.text}
                        className={`flex justify-start items-start p-1 gap-1 border-b-[1px] border-gray-100
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
                                  className={`flex justify-center items-center gap-1 border-[1px] border-gray-300 rounded px-3 py-1 capitalize ${
                                    opNo === question.correctAnswer &&
                                    'bg-blue-500 text-white'
                                  }`}
                                >
                                  {/* <label className='text-sm text-gray-600'>
                                {opNo + 1}
                              </label> */}
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
            ) : (
              <div className='flex justify-center items-center gap-2 text-red-600'>
                <ExclamationTriangleIcon />
                <p>No Pre training exam found for this training</p>
              </div>
            )}
            {postTrainingExam ? (
              <div className='flex flex-col gap-3 border-b-[1px] pb-2 border-gray-200 mt-4'>
                <div className='flex justify-between items-start w-full'>
                  <div className='w-full flex justify-start items-center gap-6'>
                    <div className=' flex justify-center items-center gap-1'>
                      <label className='text-sm text-gray-600'>
                        Exam Type:
                      </label>
                      <p className='font-semibold'>Post Training Exam</p>
                    </div>
                    <div className=' flex justify-center items-center gap-1'>
                      <label className='text-sm text-gray-600'>
                        Responsibility:
                      </label>
                      <p>{postTrainingExam?.responsibility}</p>
                    </div>
                    <div className=' flex justify-center items-center gap-1'>
                      <label className='text-sm text-gray-600'>
                        Dated for:
                      </label>
                      <p>
                        {new Date(
                          postTrainingExam.targetDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className=' flex justify-center items-center gap-1'>
                      <label className='text-sm text-gray-600'>
                        Total Candidate Appeared:
                      </label>
                      <p>{postTrainingExam.totalCandidatesAttempted}</p>
                    </div>
                  </div>
                  <Link
                    href={''}
                    className='flex gap-2 justify-center ml-auto items-center  hover:bg-blue-500 hover:text-white text-blue-500 border-[1px] border-blue-400 text-nowrap rounded py-1 px-3'
                  >
                    See exam details
                  </Link>
                </div>
                <div className='flex flex-col gap-1'>
                  <h2 className='font-semibold'>Questions:</h2>
                  <div className='flex flex-col gap-2'>
                    {postTrainingExam.questions.map((question, qno) => (
                      <div
                        key={question.text}
                        className={`flex justify-start items-start p-1 gap-1 border-b-[1px] border-gray-100
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
                                  className={`flex justify-center items-center gap-1 border-[1px] border-gray-300 rounded px-3 py-1 capitalize ${
                                    opNo === question.correctAnswer &&
                                    'bg-blue-500 text-white'
                                  }`}
                                >
                                  {/* <label className='text-sm text-gray-600'>
                                {opNo + 1}
                              </label> */}
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
            ) : (
              <div className='flex justify-center items-center gap-2 text-red-600'>
                <ExclamationTriangleIcon />
                <p>No Post training exam found for this training</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TrainingDetails;

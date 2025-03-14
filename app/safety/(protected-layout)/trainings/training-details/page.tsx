'use client';
import { ITrainingDetailWithExamsResponse } from '@/lib/actions/safety/training/fetch';
import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import { ExamTypes } from '@/lib/models/Safety/training.model';
import { storage } from '@/utils/fireBase/config';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Copy, Loader2Icon, RefreshCcw } from 'lucide-react';
import mongoose from 'mongoose';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa6';

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
  console.log('TRAINING DETAILS', trainingDetails);
  useEffect(() => {
    fetchTrainingDetails();
  }, [trainingId]);

  console.log('Training details', trainingDetails);
  const preTrainingExam = trainingDetails?.exams.find(
    (exam) => exam.examType === 'pre-training-exam'
  );
  const postTrainingExam = trainingDetails?.exams.find(
    (exam) => exam.examType === 'post-training-exam'
  );

  const preTrainingExamLink =
    preTrainingExam && window
      ? `${window.location.origin}/safety/training-exam/${trainingId}/${preTrainingExam.examType}`
      : 'Unable to generate link';
  const postTrainingExamLink =
    postTrainingExam && window
      ? `${window.location.origin}/safety/training-exam/${trainingId}/${postTrainingExam.examType}`
      : 'Unable to generate link';

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link: ', err);
      toast.error('Failed to copy link');
    }
  };
  console.log('TDetails');

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
          <div className='w-full max-h-screen flex gap-12'>
            <div className='flex flex-col gap-2'>
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
            <div className='flex flex-col gap-2'>
              <h2 className='font-semibold border-b-[1px] border-gray-200 pb-1 text-blue-500'>
                Attendance Sheet:
              </h2>
              <AttendanceSheetUpload
                trainingId={trainingId}
                attendanceSheetURL={trainingDetails.attendanceSheetURL}
              />
            </div>
          </div>
          <div className=' flex flex-col gap-4 py-2 border-[1px] border-gray-300 shadow rounded p-3'>
            <h2 className='font-semibold border-b-[1px] pb-1 border-gray-200 text-blue-500'>
              Exams:
            </h2>

            {preTrainingExam ? (
              <div className='flex flex-col gap-4 border-b-[1px] pb-4 border-gray-200 mt-4'>
                <div className='flex justify-between items-center w-full'>
                  <div className=' flex justify-center items-center gap-1'>
                    <label className='text-sm text-gray-600'>Exam Type:</label>
                    <p className='font-semibold'>Pre Training Exam</p>
                  </div>
                  <div className='flex justify-start items-center gap-2'>
                    <p className='text-sm text-gray-500'>Exam Link:</p>
                    <p className='text-blue-500'>{preTrainingExamLink}</p>
                    <button
                      onClick={() => copyToClipboard(preTrainingExamLink)}
                      className='text-blue-500  border-[1px] hover:border-blue-400 py-1 px-2 rounded flex justify-center items-center gap-1'
                    >
                      <Copy className='  w-[20px]' />
                      {/* <>copy link</> */}
                    </button>
                  </div>
                </div>
                <div className='flex justify-between items-start w-full'>
                  <div className='flex flex-col gap-3 '>
                    <div className='w-full flex justify-start items-center gap-6'>
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
                  </div>
                  <Link
                    target='_blank'
                    href={(() => {
                      const query: { examId: string } = {
                        examId: preTrainingExam._id.toString(),
                      };
                      const queryString = new URLSearchParams(query).toString();
                      return `/safety/trainings/training-details/exam-details?${queryString}`;
                    })()}
                    className='flex gap-2 justify-center ml-auto items-center  hover:bg-blue-700 bg-blue-500 text-white  text-nowrap rounded py-1 px-3'
                  >
                    See exam details
                  </Link>
                </div>
                <div className='flex flex-col gap-1'>
                  <h2 className='font-semibold'>Questions:</h2>
                  <div className='flex flex-col gap-3'>
                    {preTrainingExam.questions.map((question, qno) => (
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
            ) : (
              <div className='flex justify-between items-center gap-2 text-red-600 py-4'>
                <div className='flex justify-center items-center w-fit gap-2'>
                  <ExclamationTriangleIcon />
                  <p>No Pre training exam found for this training</p>
                </div>
                <Link
                  target='_blank'
                  href={(() => {
                    const query: {
                      trainingId: string;
                      examType: ExamTypes;
                    } = { trainingId, examType: 'pre-training-exam' };
                    const queryString = new URLSearchParams(query).toString();
                    return `/safety/trainings?${queryString}`;
                  })()}
                  className='flex gap-2 justify-center ml-auto items-center bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-3'
                >
                  Create Pre Training Exam
                </Link>
              </div>
            )}
            {postTrainingExam ? (
              <div className='flex flex-col gap-4 pb-4 mt-4'>
                <div className='flex justify-between items-center w-full'>
                  <div className=' flex justify-center items-center gap-1'>
                    <label className='text-sm text-gray-600'>Exam Type:</label>
                    <p className='font-semibold'>Post Training Exam</p>
                  </div>
                  <div className='flex justify-start items-center gap-2'>
                    <p className='text-sm text-gray-500'>Exam Link:</p>
                    <p className='text-blue-500'> {postTrainingExamLink}</p>
                    <button
                      onClick={() => copyToClipboard(postTrainingExamLink)}
                      className='text-blue-500  border-[1px] hover:border-blue-400 py-1 px-2 rounded flex justify-center items-center gap-1'
                    >
                      <Copy className='  w-[20px]' />
                      {/* <>copy link</> */}
                    </button>
                  </div>
                </div>
                <div className='flex justify-between items-start w-full'>
                  <div className='flex flex-col gap-3 '>
                    <div className='w-full flex justify-start items-center gap-6'>
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
                  </div>
                  <Link
                    target='_blank'
                    href={(() => {
                      const query: { examId: string } = {
                        examId: postTrainingExam._id.toString(),
                      };
                      const queryString = new URLSearchParams(query).toString();
                      return `/safety/trainings/training-details/exam-details?${queryString}`;
                    })()}
                    className='flex gap-2 justify-center ml-auto items-center  hover:bg-blue-700 bg-blue-500 text-white  text-nowrap rounded py-1 px-3'
                  >
                    See exam details
                  </Link>
                </div>
                <div className='flex flex-col gap-1'>
                  <h2 className='font-semibold'>Questions:</h2>
                  <div className='flex flex-col gap-3'>
                    {postTrainingExam.questions.map((question, qno) => (
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
            ) : (
              <div className='flex justify-between items-center gap-2 text-red-600 py-4'>
                <div className='flex justify-center items-center w-fit gap-2'>
                  <ExclamationTriangleIcon />
                  <p>No Post training exam found for this training</p>
                </div>
                <Link
                  target='_blank'
                  href={(() => {
                    const query: {
                      trainingId: string;
                      examType: ExamTypes;
                    } = { trainingId, examType: 'post-training-exam' };
                    const queryString = new URLSearchParams(query).toString();
                    return `/safety/trainings?${queryString}`;
                  })()}
                  className='flex gap-2 justify-center ml-auto items-center bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-3'
                >
                  Create Post Training Exam
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TrainingDetails;

const AttendanceSheetUpload = ({ trainingId, attendanceSheetURL }) => {
  const session = useSession();
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [trainerId, setTrainerId] = useState<mongoose.Types.ObjectId>(null);

  useEffect(() => {
    if (session && session?.data?.user._id) {
      setTrainerId(new mongoose.Types.ObjectId(session?.data?.user?._id));
    }
  }, [session]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
  };

  const handleSheetUpload = async (
    file: File,
    storagePath: string,
    fileName: string
  ): Promise<string> => {
    try {
      // Step 1: Convert the file to a Blob
      const blob = new Blob([file], { type: file.type });

      // Step 2: Upload the Blob to Firebase Storage

      const storageRef = ref(storage, `${storagePath}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      const downloadURL = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            setProgress(progress);
          },
          (error) => {
            console.error('Error uploading PDF to Firebase:', error);
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          }
        );
      });

      toast.success('PDF uploaded successfully!');
      return downloadURL;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF. Please try again.');
      throw error;
    }
  };
  const handleUpload = async () => {
    if (!file) {
      toast.error('No file selected');
      return;
    }
    if (!trainerId) {
      toast.error('Failed to load trainer id, Please refresh');
      return;
    }
    try {
      setUploading(true);
      const downloadURL: string = await handleSheetUpload(
        file,
        `safety/training/${trainingId}/attendanceSheet`, // Firebase Storage path
        `${trainingId}-att-sheet` // Unique file name
      );
      console.log('downloadURL', downloadURL);
      if (downloadURL) {
        toast.success('Attendance Photo uploaded');
        const { data, message, error, status, success } =
          await trainingActions.UPDATE.updateTraining({
            trainer: trainerId,
            trainingId,
            updates: {
              attendanceSheetURL: downloadURL,
            },
          });

        if (success) {
          toast.success(message);
        }
        if (!success) {
          toast.error(message);
        }
      }
      // console.log(data, Error, Message, Status, Success);
    } catch (error) {
      toast.error(
        JSON.stringify(error.message || error) ||
          `Failed to upload attendance ${trainingId} image`
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: any) => {
    // const resp = await weeklyAuditAction.DELETE.deleteSiteSecurityUploads(id);
    // if (resp.success) {
    //   toast.success('Deleted,Refresh to view Changes');
    //   //   setResults(prev => prev.filter(item => item.id !== id));
    // } else {
    //   toast.error('Failed');
    // }
  };

  return (
    <form className=' '>
      <div className='w-full flex flex-col items-start justify-center gap-2 p-2'>
        <div className='flex flex-col gap-2'>
          <label>Select attendance sheet to upload:</label>
          <input
            // disabled={!canEditAllDetails}
            type='file'
            onChange={handleFileChange}
            className='border border-gray-300 rounded p-2 mb-4 w-full'
          />
          {/* {file && (
          <div className='mb-4 flex items-center'>
            <span className='mr-4 text-green-600'>{file.name}</span>
            <button
              onClick={handleRemoveFile}
              className='bg-red-500 text-white text-nowrap p-2 rounded hover:bg-red-700'
            >
              Remove File
            </button>
          </div>
        )} */}
          <button
            disabled={uploading}
            type='submit'
            onClick={(e: React.FormEvent) => {
              e.preventDefault();
              handleUpload();
            }}
            className='bg-blue-500 disabled:bg-blue-400 text-white px-2 w-full py-1 rounded hover:bg-blue-700 flex justify-center items-center gap-2'
          >
            {uploading ? (
              <>
                Uploading {progress.toFixed(0)}%
                <Loader2Icon className='animate-spin' />
              </>
            ) : (
              'Upload'
            )}
          </button>
          {attendanceSheetURL && (
            <Link
              target='_blank'
              href={attendanceSheetURL}
              className='border-[1px] border-blue-500 mt-2 text-blue-500 px-2 py-1 rounded flex justify-center items-center gap-2'
            >
              See uploaded attendance sheet
            </Link>
          )}
        </div>
        <div className='flex flex-col gap-2'></div>
      </div>
      <div className='w-full justify-center items-center flex my-6 gap-2 flex-col'>
        {!attendanceSheetURL && (
          <span className='text-red-400 flex justify-center items-center gap-2'>
            <ExclamationTriangleIcon className='w-[20px] h-[20px]' />{' '}
            <p>No Attendance Sheet Were Uploaded</p>
          </span>
        )}
      </div>
    </form>
  );
};

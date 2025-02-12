'use client';
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useCallback,
} from 'react';
import {
  IQA,
  IToolboxTalk,
  IToolboxTalkVersion,
  IToolboxTalkVersionWithRevNo,
} from '@/lib/models/Safety/toolboxtalk.model';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import { IEnterpriseBase } from '@/interfaces/enterprise.interface';
import logo from '@/public/assets/dark-logo.png';

type IFromIToolBoxTalk = Pick<IToolboxTalk, 'documentNo' | 'effectiveDate'>;
type IFromIToolboxTalkVersion = Pick<
  IToolboxTalkVersion,
  'feedback' | 'uploadDate'
>;
type IFromIToolboxTalkVersionWithRevNo = Pick<
  IToolboxTalkVersionWithRevNo,
  'revNo'
>;

interface IFeedbackForm
  extends IFromIToolBoxTalk,
    IFromIToolboxTalkVersion,
    IFromIToolboxTalkVersionWithRevNo {
  updateFeedback: () => void;
  enterPriseInfo: IEnterpriseBase;
  canEditImportantDetails?: boolean;
  canEditAllDetails?: boolean;
}

const Feedback = forwardRef(
  (
    {
      feedback = [{ answer: 'N/A', question: 'N/A' }],
      documentNo = 'N/A',
      revNo = -1,
      effectiveDate,
      uploadDate,
      updateFeedback = async () => {
        console.error(
          'FRONTEND LOAD ERROR : running default update feedback function'
        );
        toast.error(
          'FRONTEND LOAD ERROR : running default update feedback function'
        );
      },
      enterPriseInfo,
      canEditAllDetails,
      canEditImportantDetails,
    }: IFeedbackForm,
    ref
  ) => {
    console.log('feedback');
    const [feedbackData, setFeedbackData] = useState<IQA[]>(feedback); // Local state for feedback data

    // Expose the local state to the parent component
    useImperativeHandle(ref, () => ({
      getFeedbackData: () => feedbackData, // Function to return the current feedback data
    }));

    // Stabilize the debounced function with useCallback
    const debounceFeedbackUpdate = useCallback(
      debounce(() => {
        updateFeedback();
      }, 400), // calling updateFeedback only after 0.4 sec user stops writing
      []
    );

    // Call the debounced function whenever feedbackData changes
    useEffect(() => {
      debounceFeedbackUpdate();
      return () => debounceFeedbackUpdate.cancel();
    }, [feedbackData]);

    // Handle input changes
    const handleInputChange = (index, value) => {
      const updatedFeedback = [...feedbackData];
      updatedFeedback[index].answer = value;
      setFeedbackData(updatedFeedback);
    };

    return (
      <section className='m-8'>
        <div>
          canEditImportantDetails:{JSON.stringify(canEditImportantDetails)}
          canEditAllDetails:{JSON.stringify(canEditAllDetails)}
        </div>
        <form className='border-2 border-gray-500'>
          <div className='flex border-b-2 border-gray-500 gap-2'>
            {/* Form header */}
            <div className='flex w-1/2 p-2 justify-start gap-2 items-center'>
              <Image src={logo} alt='logo' width={50} />
              <h1>{enterPriseInfo.name}</h1>
            </div>
            <div className='border-x-2 border-gray-700 flex-grow flex justify-center items-center font-bold'>
              Form & Formats <br />
              Site Safety <br />
              Feedback of Tool Box Talk
            </div>
            <div className='flex-grow flex-col flex justify-around p-2 gap-2'>
              <div className='w-full flex justify-start items-center gap-3 flex-grow px-1'>
                <p>Sheet No.:</p>
                <p>XX PROGRAM</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3 flex-grow px-1'>
                <p>Revision No:</p>
                <p>{revNo}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3 flex-grow px-1'>
                <p>Effective Date:</p>
                <p>{effectiveDate?.toLocaleDateString()}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3 flex-grow px-1'>
                <p>Document No.:</p>
                <p>{documentNo}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3 flex-grow px-1'>
                <p>Date:</p>
                <p>{uploadDate?.toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4 mt-4 p-3'>
            {feedbackData.map((qna, i) => (
              <div key={qna.question} className='flex flex-col gap-1'>
                <span className='flex gap-2'>
                  <p>{i + 1}</p>
                  <label htmlFor={qna.question}>{qna.question}</label>
                </span>
                <textarea
                  disabled={!canEditAllDetails}
                  id={qna.question}
                  defaultValue={qna.answer}
                  onChange={(e) => handleInputChange(i, e.target.value)} // Update local state
                  className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
                />
              </div>
            ))}
          </div>
        </form>
      </section>
    );
  }
);

Feedback.displayName = 'Feedback'; // Required for forwardRef
export default Feedback;

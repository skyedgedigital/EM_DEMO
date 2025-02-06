import Image from 'next/image';
import React from 'react';

// TEMPORARY FEEDBACK MODAL
const feedbackData = [
  {
    q: 'QNA: Feedback /Suggestion With Date and Signature ',
    a: 'ANS Feedback /Suggestion With Date and Signature ',
  },
  {
    q: 'QNA: Action/Compliance With Date and Signture ',
    a: 'ANS Action/Compliance With Date and Signture ',
  },
  {
    q: 'QNA: Informed To the Suggest or /Concerned Persons ',
    a: 'ANS Informed To the Suggest or /Concerned Persons ',
  },
  {
    q: 'QNA: PDCA Staus.(PLAN - DO - CHECK-ACT) ',
    a: 'ANS PDCA Staus.(PLAN - DO - CHECK-ACT) ',
  },
];
const Feedback = () => {
  return (
    <section className='mt-6'>
      {/* border */}
      <form className='border-2 border-gray-500'>
        <div className='flex border-b-2 border-gray-500 gap-2'>
          {/* two section */}
          <div className='flex flex-grow p-2'>
            <Image
              src='/public/assets/dark-logo.png'
              alt='logo'
              width={100}
              height={100}
            />
            <h1>Enterprise management demo</h1>
          </div>
          <div className='border-x-2 border-gray-700  flex-grow flex justify-center items-center font-bold'>
            Form & Formats <br />
            Site Safety <br />
            Feedback of Tool Box Talk
          </div>

          <div className='flex-grow flex-col flex justify-around p-2 gap-2 '>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <p>Sheet No.:</p>
              <p>XX PROGRAM</p>
            </div>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <p>Revision No:</p>
              <p>1</p>
            </div>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <p>Effective Date:</p>
              <p>XX PROGRAM</p>
            </div>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <label htmlFor='documentNo'>Document No.:</label>
              <input
                id='documentNo'
                type='text'
                // {...register('documentNo')}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />
            </div>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <p>Date:</p>
              <p>XX PROGRAM</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 mt-4 p-3'>
          {feedbackData.map((qna, i) => (
            <div key={qna.q} className='flex flex-col gap-1'>
              <span className='flex gap-2'>
                <p>{i + 1}</p>
                <label>{qna.q}</label>
              </span>
              <textarea
                value={qna.a}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
              />
            </div>
          ))}
        </div>
        <div className=' flex gap-8 mt-6 p-3'>
          <div>
            <label>Signature of Supervisor/Line Manager </label>
            <p>______________________________</p>
          </div>
          <div>
            <label>Dated </label>
            <p>______________________________</p>
          </div>
        </div>
      </form>
      <div className='w-full justify-center items-center flex'>
        <button
          type='button'
          className='bg-green-500 text-white px-4 py-2 rounded mt-2'
        >
          save{' '}
        </button>
      </div>
    </section>
  );
};

export default Feedback;

import React from 'react';

const ExamPage = ({
  params,
}: {
  params: { [key: string]: string | undefined };
}) => {
  return (
    <div className='border-2 border-red-500 mt-16 min-h-screen'>
      ExamPage {JSON.stringify(params)}
    </div>
  );
};

export default ExamPage;

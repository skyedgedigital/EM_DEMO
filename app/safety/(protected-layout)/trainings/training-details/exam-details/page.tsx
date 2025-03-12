import React from 'react';

const TrainingExamDetailsPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  return (
    <div>
      TrainingExamDetailsPage
      {JSON.stringify(searchParams)}
    </div>
  );
};

export default TrainingExamDetailsPage;

'use client';

import SinglePDFUpload from '@/components/SinglePDFUpload';

import React from 'react';

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  console.log(searchParams);
  const { documentType, category, documentURL } = searchParams;

  const handleUpload = async ({
    documentType,
    fileUrl,
    category,
  }: {
    documentType: string;
    fileUrl: string;
    category?: string;
  }) => {
    console.log(documentType, 'received download url', fileUrl, category);
  };

  return (
    <SinglePDFUpload
      documentType={documentType}
      onUpload={handleUpload}
      initialFileUrl={documentURL}
      documentCategory={category}
    />
  );
};

export default Page;

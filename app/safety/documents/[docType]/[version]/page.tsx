'use client';

import SinglePDFUpload from '@/components/SinglePDFUpload';
import {
  DocNameTypes,
  DocsCategoryTypes,
} from '@/lib/models/Safety/document.model';

import React from 'react';

const Page = ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | DocsCategoryTypes | DocNameTypes | undefined;
  };
}) => {
  console.log(searchParams);
  const { documentType, category, documentURL } = searchParams;

  return (
    <SinglePDFUpload
      documentType={documentType as DocNameTypes}
      initialFileUrl={documentURL}
      documentCategory={category as DocsCategoryTypes}
    />
  );
};

export default Page;

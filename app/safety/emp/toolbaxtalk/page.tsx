'use client';
import ToolBoxTalkHome from '@/components/safety/emp/toolBoxTalkHome';
import toolboxTalkActions from '@/lib/actions/safety/toolboxtalk/toolboxtalkActions';
import { IToolboxTalk } from '@/lib/models/Safety/toolboxtalk.model';
import { LoaderIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ToolBoxTalk = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  console.log('Page View Tool box talk');

  const { documentNo } = searchParams;
  const [loading, setLoading] = useState<boolean>(true);
  const [allDocVersions, setAllDocVersions] = useState<IToolboxTalk>(null);
  const fnLoadDocs = async () => {
    try {
      const { data, error, message, status, success } =
        await toolboxTalkActions.FETCH.getAllVersionsOfToolboxTalk(documentNo);
      if (success) {
        console.log(data);
        setAllDocVersions(data);
        toast.success(message);
      }
      if (!success) {
        console.log(error);
        toast.error(JSON.stringify(error) || message);
      }
    } catch (error) {
      toast.error(
        error.message ||
          `Failed to load all versions of ${documentNo}. Please try later`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fnLoadDocs();
  }, []);
  return (
    <section className='min-h-screen'>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        Tool Box Talk Details
      </h1>
      {loading && (
        <div className='min-h-screen flex justify-center items-center'>
          <div className='flex justify-center items-center flex-col'>
            <LoaderIcon />
            <p>Loading Data...</p>
          </div>
        </div>
      )}
      {!loading && (
        <ToolBoxTalkHome
          canEditImportantDetails={false}
          receivedToolBoxTalk={allDocVersions}
        />
      )}
    </section>
  );
};

export default ToolBoxTalk;

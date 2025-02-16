'use client';
import toolBoxTalkAction from '@/lib/actions/SafetyEmp/daily/toolBoxTalk/toolBoxTalkAction';
import React, { useEffect, useState } from 'react';
import toast, { LoaderIcon } from 'react-hot-toast';
import { ICurrentVersionToolboxTalk } from '@/lib/actions/safety/toolboxtalk/fetch';
import toolboxTalkActions from '@/lib/actions/safety/toolboxtalk/toolboxtalkActions';
import Link from 'next/link';
import { Loader2Icon, RefreshCcw } from 'lucide-react';

const ViewToolBoxTalk = () => {
  console.log('ViewToolBox');

  const [allToolBoxTalkDocs, setAllToolBoxTalkDocs] =
    useState<ICurrentVersionToolboxTalk[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const { data, error, message, status, success } =
        await toolboxTalkActions.FETCH.fetchCurrentVersionOfAllToolboxTalk();
      if (success) {
        toast.success(message);
        console.log(data);
        setAllToolBoxTalkDocs(data);
      }
      if (!success) {
        console.log(error);
        toast.error(message);
      }
    } catch (error) {
      toast.error(
        JSON.stringify(error) || 'Failed to fetch All Tool box talk documents'
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async (id: any) => {
    const resp = await toolBoxTalkAction.DELETE.deleteToolBoxTalk(id);
    if (resp.success) {
      toast.success('Deleted');
    } else {
      toast.error('Error while Deleting');
    }
  };
  return (
    <>
      <>
        <div className='flex flex-col items-center justify-center my-4'>
          <div className='flex justify-between items-center w-full'>
            <h2 className='text-2xl my-4'>List Of Tool Box Forms:</h2>
            {allToolBoxTalkDocs?.length === 0 && (
              <span className='mt-4'>No Audit Present</span>
            )}

            <button
              onClick={fetchDocs}
              className='flex gap-2 justify-center items-center bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-3'
            >
              {loading ? (
                <Loader2Icon className='animate-spin' />
              ) : (
                <RefreshCcw />
              )}
              <>Refresh</>
            </button>
          </div>
          {loading && (
            <div className='flex justify-center min-h-[50vh] items-center'>
              <div className='flex justify-center items-center flex-col'>
                <LoaderIcon />
                <p>Loading Data...</p>
              </div>
            </div>
          )}
          {!loading && (
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    sheet NO:
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Program Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Rev No:
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Date
                  </th>

                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {allToolBoxTalkDocs.map((ele) => (
                  <tr key={ele.documentNo} className='hover:bg-gray-100'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {ele.documentNo}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {ele.programName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {ele.currentVersion}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {ele.effectiveDate.toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Link
                        target='_blank'
                        href={`/safety/emp/toolbaxtalk?${new URLSearchParams({
                          documentNo: ele.documentNo,
                        }).toString()}`}
                        className='text-blue-500 p-1'
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
    </>
  );
};

export default ViewToolBoxTalk;

'use client';
import toolboxTalkActions from '@/lib/actions/safety/toolboxtalk/toolboxtalkActions';
import { IToolboxTalk } from '@/lib/models/Safety/toolboxtalk.model';
import { LoaderIcon, PlusCircle } from 'lucide-react';
import Link from 'next/link';
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
        <div className='w-full flex flex-col gap-6 p-2'>
          <div className='w-full flex flex-col gap-2 '>
            <h2 className='text-blue-500 font-semibold text-lg'>
              Document Details:
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
              <span className='flex gap-2 justify-start border-[1px] border-gray-200 px-2 py-1 rounded items-center'>
                <p className='text-gray-600 text-sm'>Document No:</p>
                <p>{allDocVersions?.documentNo}</p>
              </span>
              <span className='flex gap-2 justify-start border-[1px] border-gray-200 px-2 py-1 rounded items-center'>
                <p className='text-gray-600 text-sm'>Program Name:</p>
                <p>{allDocVersions?.programName}</p>
              </span>
              <span className='flex gap-2 justify-start border-[1px] border-gray-200 px-2 py-1 rounded items-center'>
                <p className='text-gray-600 text-sm'>Latest Updated Version:</p>
                <p>{allDocVersions?.currentVersion}</p>
              </span>
              <span className='flex gap-2 justify-start border-[1px] border-gray-200 px-2 py-1 rounded items-center'>
                <p className='text-gray-600 text-sm'>
                  Contractor Representative:
                </p>
                <p>{allDocVersions?.contractorRepresentative}</p>
              </span>
              <span className='flex gap-2 justify-start border-[1px] border-gray-200 px-2 py-1 rounded items-center'>
                <p className='text-gray-600 text-sm'>Safety Representative:</p>
                <p>{allDocVersions?.safetyRepresentative}</p>
              </span>
              <span className='flex gap-2 justify-start border-[1px] border-gray-200 px-2 py-1 rounded items-center'>
                <p className='text-gray-600 text-sm'>Effective Date:</p>
                <p>{allDocVersions?.effectiveDate.toLocaleDateString()}</p>
              </span>
              <span className='flex gap-2 justify-start border-[1px] border-gray-200 px-2 py-1 rounded items-center'>
                <p className='text-gray-600 text-sm'>Vendor Code:</p>
                <p>{allDocVersions?.vendorCode}</p>
              </span>
              <span className='flex gap-2 justify-start border-[1px] border-gray-200 px-2 py-1 rounded items-center'>
                <p className='text-gray-600 text-sm'>Total Updated versions:</p>
                <p>{allDocVersions?.versions.length}</p>
              </span>
            </div>
          </div>
          <div className='w-full flex flex-col gap-2 '>
            <div className='flex justify-between items-center'>
              <h2 className='text-blue-500 font-semibold text-lg'>
                All {allDocVersions?.versions.length} updated versions:
              </h2>
              <Link
                href={`/safety/emp/toolbaxtalk/document/add-new-version?${new URLSearchParams(
                  {
                    documentNo: allDocVersions.documentNo,
                  }
                ).toString()}`}
                className='flex gap-2 justify-center items-center bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-3'
              >
                <PlusCircle />
                <>Add New Version</>
              </Link>
            </div>
            <div className='flex flex-col gap-2'>
              <table>
                <thead>
                  <tr className='border-[1px] border-gray-200 bg-gray-600 text-white py-1'>
                    <th className='text-center py-2'>Rev No</th>
                    <th className='text-center py-2'>Total Man Power</th>
                    <th className='text-center py-2'>Total Workers</th>
                    <th className='text-center py-2'>Total Supervisors</th>
                    <th className='text-center py-2'>Total Engineers</th>
                    <th className='text-center py-2'>Total Safety</th>
                    <th className='text-center py-2'>Attendance URL</th>
                    <th className='text-center py-2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allDocVersions?.versions.map((vs, i) => (
                    <tr
                      key={vs.revNo}
                      className={`border-[1px] border-gray-200 ${
                        i % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                      }`}
                    >
                      <td className='text-center py-2'>{vs.revNo}</td>
                      <td className='text-center py-2'>{vs.totalManPower}</td>
                      <td className='text-center py-2'>{vs.totalWorkers}</td>
                      <td className='text-center py-2'>
                        {vs.totalSupervisors}
                      </td>
                      <td className='text-center py-2'>{vs.totalEngineers}</td>
                      <td className='text-center py-2'>{vs.totalSafety}</td>
                      <td className='text-center '>
                        <Link
                          target='_blank'
                          href={vs.attendance.attendanceFileURL}
                          className='py-2 px-2 rounded hover:underline text-blue-500'
                        >
                          See Image
                        </Link>
                      </td>
                      <td className='text-center'>
                        <Link
                          target='_blank'
                          className='py-2 px-2 rounded hover:underline text-blue-500'
                          href={`/safety/emp/toolbaxtalk/document?${new URLSearchParams(
                            {
                              documentNo: allDocVersions.documentNo,
                              version: vs.revNo.toString(),
                            }
                          ).toString()}`}
                        >
                          Version Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ToolBoxTalk;

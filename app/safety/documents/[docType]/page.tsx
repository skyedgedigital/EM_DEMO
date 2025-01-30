'use client';
import React, { useEffect, useState } from 'react';
import {
  DocNameTypes,
  DocsCategoryTypes,
  IDocument,
} from '@/lib/models/Safety/document.model';
import toast from 'react-hot-toast';
import DocumentUploadForm from './DocumentUploadForm';
import documentActions from '@/lib/actions/safety/document/documentActions';
import { Loader } from 'lucide-react';

const Documents = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { documentType, category } = searchParams;
  const [docs, setDocs] = useState<IDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchAllDocs = async () => {
    try {
      const docs = await documentActions.FETCH.getAllVersionsOfDocument(
        category,
        documentType as DocNameTypes
      );
      console.log(docs);
      if (docs.success) {
        const parsedData = docs.data;
        console.log('parderd docs', parsedData);
        setDocs(parsedData);
        toast.success(docs.message);
      }
    } catch (error) {
      toast.error(
        error.message || 'Failed to fetch documents, please try later'
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllDocs();
  }, []);
  const handleDelete = async () => {
    //  const resp = await designationAction.DELETE.deleteDesignation(id);
    //  if (resp.status === 200) {
    //    toast.success('Deleted,Reload to view Changes');
    //    fetchDesignations();
    //  } else {
    //    toast.error('An Error Occurred');
    //  }
  };

  return (
    <section className='flex flex-col h-screen'>
      <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4'>
        {}
      </h1>
      <div className='flex-1 overflow-y-auto p-4'>
        <div className='flex flex-col-reverse gap-6 lg:flex-row'>
          <div className='flex-1'>
            <div className='w-full flex flex-col gap-1 border-[1px] border-gray-300 rounded p-2 justify-start items-center lg:min-h-[calc(100vh-2rem)]'>
              <div className='flex justify-between items-center w-full px-3 mb-3'>
                <h2 className='flex justify-center text-xl'>
                  All {documentType}s
                </h2>
                {
                  <p className='text-gray-400'>
                    ({docs ? <>{docs?.versions.length} uploads</> : ''})
                  </p>
                }
              </div>{' '}
              {loading ? (
                <div className='flex justify-center items-center w-full min-h-48'>
                  <Loader className='text-blue-500' />{' '}
                  <p className='text-blue-500'>Loading Documents...</p>
                </div>
              ) : (
                <div className='flex flex-col w-full'>
                  {docs?.versions.map((ele) => {
                    return (
                      <div
                        key={ele.versionNumber}
                        className='p-2 flex justify-between items-center rounded-sm border-b hover:bg-gray-200'
                      >
                        <div className='flex flex-col gap-1 justify-start items-start'>
                          <div className='flex justify-start items-start gap-2'>
                            <span>Document Version: {ele.versionNumber}</span>

                            {ele.versionNumber === docs.currentVersion && (
                              <span className='text-xs flex justify-center items-center bg-blue-500 py-[0.2rem] px-2 text-white rounded-full capitalize'>
                                latest upload
                              </span>
                            )}
                          </div>
                          <div className='flex flex-col gap-1'>
                            <div className='text-gray-500 text-xs flex gap-1'>
                              <span>uploaded on:</span>
                              <span>
                                {new Date(ele.uploadDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='flex w-fit justify-center items-center gap-2'>
                          <button
                            className='px-2 py-1 bg-white rounded-sm text-blue-500'
                            onClick={() => {
                              const query = {
                                documentType: documentType,
                                version: ele.versionNumber.toString(),
                                category: 'General',
                                documentURL: ele.documentURL,
                              };

                              const queryString = new URLSearchParams(
                                query
                              ).toString();
                              // console.log('query string', queryString);
                              window.open(
                                `/safety/documents/${documentType}/version?${queryString}`
                              );
                            }}
                          >
                            View
                          </button>
                          {/* <button className='px-2 py-1 bg-white rounded-sm text-orange-500'>
                          Edit
                        </button>
                        <button className='px-2 py-1 bg-white rounded-sm text-red-500'>
                          Delete
                        </button> */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>{' '}
          </div>

          <DocumentUploadForm
            documentType={documentType as DocNameTypes}
            documentCategory={category as DocsCategoryTypes}
          />
        </div>
      </div>
    </section>
  );
};

export default Documents;

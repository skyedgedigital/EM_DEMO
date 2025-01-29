'use client';
import React, { useEffect, useState } from 'react';
import {
  DocNameTypes,
  docsEnums,
  IDocument,
} from '@/lib/models/Safety/document.model';
import { fetchCurrentVersionOfAllDocuments } from '@/lib/actions/safety/document/fetch';
import toast from 'react-hot-toast';
import { Types } from 'mongoose';
import DocumentUploadForm from './DocumentUploadForm';

const Documents = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { documentType, category } = searchParams;
  const [docs, setDocs] = useState<IDocument>({
    documentType: 'Safety Manual',
    versions: [
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 1,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 2,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 3,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 4,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 1,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 2,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 3,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 4,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 1,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 2,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 3,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 4,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 1,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 2,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 3,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 4,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 1,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 2,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 3,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 4,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 1,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 2,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 3,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 4,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 1,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 2,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 3,
        uploadedBy: new Types.ObjectId(),
      },
      {
        uploadDate: new Date(),
        documentURL:
          'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
        versionNumber: 4,
        uploadedBy: new Types.ObjectId(),
      },
    ],
    category: 'General',
    currentVersion: 4,
  });

  const fetchAllDocs = async () => {
    try {
      const docs = await fetchCurrentVersionOfAllDocuments();
      if (docs.success) {
        const parsedData = docs.data;
        console.log('parderd docs', parsedData);
        toast.success(docs.message);
      }
    } catch (error) {
      toast.error(
        error.message || 'Failed to fetch documents, please try later'
      );
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
        <div className='flex flex-col lg:flex-row lg:gap-6'>
          <div className='flex-1'>
            <div className='w-full flex flex-col gap-1 border-[1px] border-gray-300 rounded p-2 justify-start items-center lg:min-h-[calc(100vh-2rem)]'>
              <div className='flex justify-between items-center w-full px-3'>
                <h2 className='flex justify-center text-xl'>
                  All {documentType} uploads
                </h2>
                {
                  <p className='text-gray-400'>
                    ({docs ? <>{docs?.versions.length} uploads</> : ''})
                  </p>
                }
              </div>{' '}
              <div className='flex flex-col w-full'>
                {docs?.versions.map((ele) => {
                  return (
                    <div
                      key={ele.versionNumber}
                      className='p-2 flex justify-between items-center rounded-sm border-b hover:bg-gray-200'
                    >
                      <span>{ele.versionNumber}</span>
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
                        <button className='px-2 py-1 bg-white rounded-sm text-orange-500'>
                          Edit
                        </button>
                        <button
                          className='px-2 py-1 bg-white rounded-sm text-red-500'
                          //   onClick={() => {
                          //     setSelectedWorkOrder(ele);
                          //     setDialogOpen(true);
                          //   }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>{' '}
          </div>

          <DocumentUploadForm
            documentType={documentType}
            documentCategory={category}
          />
        </div>
      </div>
    </section>
  );
};

export default Documents;

'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useEffect, useState } from 'react';
import { docsEnums } from '@/lib/models/Safety/document.model';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { fetchCurrentVersionOfAllDocuments } from '@/lib/actions/safety/document/fetch';
import toast from 'react-hot-toast';

type DocName = (typeof docsEnums)[number];
interface DocItem {
  _id?: string;
  documentType: DocName;
  docUrl: string;
}

const Documents = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  // const [showViewModal, setShowViewModal] = useState<boolean>(false);
  // const [showModal, setShowModal] = useState<boolean>(false);
  // const [file, setFile] = useState<File | null>(null);

  // const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [safetyDocs, setSafetyDocs] = useState<DocItem[]>([
    {
      documentType: 'Safety Manual',
      docUrl:
        'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
    },
    {
      documentType: 'Policy & Principal',
      docUrl:
        'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
    },
    {
      documentType: 'Organization Structure',
      docUrl: '',
    },
    {
      documentType: 'Safety Plan',
      docUrl: '',
    },
    {
      documentType: 'Objective & Target',
      docUrl: '',
    },
    {
      documentType: 'PPE Replacement Policy',
      docUrl: '',
    },
    {
      documentType: 'Tool Replacement Policy',
      docUrl: '',
    },
    {
      documentType: 'Campaign Calendar',
      docUrl: '',
    },
    {
      documentType: 'Emergency Preparedness Plan',
      docUrl: '',
    },
    {
      documentType: 'Employee List',
      docUrl: '',
    },
    {
      documentType: 'First-aider Certificate',
      docUrl: '',
    },
    {
      documentType: 'Safety Professional Certificate',
      docUrl: '',
    },
    {
      documentType: 'Top Management Certificate',
      docUrl: '',
    },
    {
      documentType: 'Appointment Letter',
      docUrl: '',
    },
    {
      documentType: 'Sponsorship Letter',
      docUrl: '',
    },
  ]);
  const [sopJhaHiraDocs, setSopJhaHira] = useState<DocItem[]>([
    {
      documentType: 'SOP',
      docUrl:
        'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fsafety-manual.pdf?alt=media&token=fa1cf6e2-b311-4db8-821c-0a3281e28f69',
    },
    {
      documentType: 'JHA',
      docUrl:
        'https://firebasestorage.googleapis.com/v0/b/em-webapp.appspot.com/o/safety-management-documents%2Fpolicy-%26-principal.pdf?alt=media&token=64e324ce-76f4-4e84-ad92-6a3f12b0ba8f',
    },
    {
      documentType: 'HIRA',
      docUrl: '',
    },
  ]);

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
    <>
      <Tabs defaultValue='documents' className='relative'>
        <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4 w-full'>
          Safety Management Documentation
        </h1>
        <TabsList className='w-full flex  justify-center items-center bg-white '>
          <TabsTrigger value='documents'> Documents</TabsTrigger>
          <TabsTrigger value='sop/jha/hira'>SOP/JHA/ HIRA</TabsTrigger>
        </TabsList>
        <TabsContent value='documents'>
          <section className='flex flex-col h-screen'>
            <div className='w-full grid grid-cols-4 gap-5'>
              {safetyDocs?.map((doc) => (
                <div
                  key={doc.documentType}
                  className='rounded border-[1px] border-gray-300 flex flex-col gap-4 justify-center items-center h-fit'
                >
                  <h2 className='text-lg bg-gray-100 w-full p-1'>
                    {doc.documentType}
                  </h2>
                  {doc?.docUrl ? (
                    <div className=' h-[180px]  rounded p-2'>
                      {/* <p>{doc.docUrl}</p> */}
                      <embed
                        // height={180}
                        // width={200}
                        // alt={doc.documentType}
                        src={doc.docUrl}
                        className='w-fit h-[180px] border-none'
                      />
                    </div>
                  ) : (
                    <div className='w-[200px] h-[180px] flex justify-center items-center'>
                      <p className='text-gray-400 text-center w-full '>
                        No uploaded document found
                      </p>
                    </div>
                  )}
                  <div className='flex items-center justify-center p-1 pb-3 gap-2'>
                    <button
                      onClick={() => {
                        const query = {
                          documentType: doc.documentType,
                          docId: doc?._id,
                          docUrl: doc.docUrl,
                          category: 'General',
                        };
                        const queryString = new URLSearchParams(
                          query
                        ).toString();
                        // console.log('query string', queryString);
                        window.open(
                          `/safety/documents/${doc.documentType}?${queryString}`
                        );
                      }}
                      className='bg-blue-500 text-white hover:bg-blue-400 px-2 py-1 rounded'
                    >
                      see doc
                    </button>
                    <button className='bg-red-500 text-white hover:bg-red-400 px-2 py-1 rounded'>
                      delete{' '}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>
        <TabsContent value='sop/jha/hira'>
          <section className='flex flex-col h-screen'>
            {/* <div className='w-full rounded p-2 flex flex-col gap-2'>
            <h2 className='text-lg font-semibold'>
              Safety Management Documentation:
            </h2> */}
            <div className='w-full grid grid-cols-4 gap-5'>
              {sopJhaHiraDocs?.map((doc) => (
                <div
                  key={doc.documentType}
                  className='rounded border-[1px] border-gray-300 flex flex-col gap-4 justify-center items-center h-fit'
                >
                  <h2 className='text-lg bg-gray-100 w-full p-1'>
                    {doc.documentType}
                  </h2>
                  {doc?.docUrl ? (
                    <div className=' h-[180px]  rounded p-2'>
                      {/* <p>{doc.docUrl}</p> */}
                      <embed
                        // height={180}
                        // width={200}
                        // alt={doc.documentType}
                        src={doc.docUrl}
                        className='w-fit h-[180px] border-none'
                      />
                    </div>
                  ) : (
                    <div className='w-[200px] h-[180px] flex justify-center items-center'>
                      <p className='text-gray-400 text-center w-full '>
                        No uploaded document found
                      </p>
                    </div>
                  )}
                  <div className='flex items-center justify-center p-1 pb-3 gap-2'>
                    <button
                      onClick={() => {
                        const query = {
                          documentType: doc.documentType,
                          docId: doc?._id,
                          docUrl: doc.docUrl,
                          category: 'General',
                        };
                        const queryString = new URLSearchParams(
                          query
                        ).toString();
                        // console.log('query string', queryString);
                        window.open(
                          `/safety/documents/${doc.documentType}?${queryString}`
                        );
                      }}
                      className='bg-blue-500 text-white hover:bg-blue-400 px-2 py-1 rounded'
                    >
                      see doc
                    </button>
                    <button className='bg-red-500 text-white hover:bg-red-400 px-2 py-1 rounded'>
                      delete{' '}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* </div> */}
          </section>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-red-500'>
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Designation? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-500'
              onClick={() => handleDelete()}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Documents;

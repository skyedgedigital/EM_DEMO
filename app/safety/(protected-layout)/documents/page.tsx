'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useEffect, useState } from 'react';
import {
  DocNameTypes,
  DocsCategoryTypes,
  docsEnums,
} from '@/lib/models/Safety/document.model';
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
import {
  fetchCurrentVersionOfAllDocuments,
  ICurrentVersionOfAllDocumentsResponse,
} from '@/lib/actions/safety/document/fetch';
import toast from 'react-hot-toast';
import { Types } from 'mongoose';

const Documents = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [generalDocs, setGeneralDocs] = useState<
    ICurrentVersionOfAllDocumentsResponse[]
  >([
    {
      documentType: 'Safety Manual',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Appointment Letter',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Campaign Calendar',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Emergency Preparedness Plan',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Employee List',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'First-aider Certificate',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Objective & Target',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Organization Structure',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'PPE Replacement Policy',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Policy & Principal',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Safety Plan',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Safety Professional Certificate',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Sponsorship Letter',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Tool Replacement Policy',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
    {
      documentType: 'Top Management Certificate',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'General',
    },
  ]);
  const [sopJhaHiraDocs, setSopJhaHira] = useState<
    ICurrentVersionOfAllDocumentsResponse[]
  >([
    {
      documentType: 'SOP',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'SOP/JHA/HIRA',
    },
    {
      documentType: 'JHA',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'SOP/JHA/HIRA',
    },
    {
      documentType: 'HIRA',
      currentVersionDocument: {
        uploadDate: null,
        documentURL: '',
        versionNumber: null,
        uploadedBy: new Types.ObjectId(),
      },
      category: 'SOP/JHA/HIRA',
    },
  ]);

  const fetchAllDocs = async () => {
    try {
      const docs = await fetchCurrentVersionOfAllDocuments();
      if (docs.success) {
        const parsedData = docs.data;
        console.log('parderd docs', parsedData);
        toast.success(docs.message);
        const fetchedGeneralDocs = parsedData.filter(
          (docs) => docs.category === 'General'
        );
        // to show even those empty tiles which is not uploaded even once we have to find and save data

        console.log('genralDocs', fetchedGeneralDocs);
        let tempGeneralDocs: ICurrentVersionOfAllDocumentsResponse[] = [];
        generalDocs.forEach((docs) => {
          const foundDocs = fetchedGeneralDocs.find(
            (fetchedDocs) => fetchedDocs.documentType === docs.documentType
          );
          if (foundDocs) {
            tempGeneralDocs.push(foundDocs);
          } else tempGeneralDocs.push(docs);
        });
        console.log('tempGenealDocs', tempGeneralDocs);
        setGeneralDocs(tempGeneralDocs);

        const fetchedSopHiraJhaDocs = parsedData.filter(
          (docs) => docs.category === 'SOP/JHA/HIRA'
        );
        let tempSOPHIRAJHADocs: ICurrentVersionOfAllDocumentsResponse[] = [];
        sopJhaHiraDocs.forEach((docs) => {
          const foundDocs = fetchedSopHiraJhaDocs.find(
            (fetchedDocs) => fetchedDocs.documentType === docs.documentType
          );
          if (foundDocs) {
            tempSOPHIRAJHADocs.push(foundDocs);
          } else tempSOPHIRAJHADocs.push(docs);
        });
        console.log('tempSOPHIRAJHADocs', tempSOPHIRAJHADocs);

        setSopJhaHira(tempSOPHIRAJHADocs);

        // setSopJhaHira(sopHiraJhaDocs);
        console.log('sopHiraJhaDocs', sopJhaHiraDocs);
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
      <Tabs defaultValue='documents' className='relative flex flex-col gap-2'>
        <h1 className='font-bold text-blue-500 border-b-2 border-blue-500 text-center py-2 mb-4 w-full'>
          Safety Management Documentation
        </h1>
        <TabsList className='w-full flex  justify-center items-center bg-white '>
          <TabsTrigger value='documents'>Safety Documents</TabsTrigger>
          <TabsTrigger value='sop/jha/hira'>SOP/JHA/HIRA</TabsTrigger>
        </TabsList>
        <TabsContent value='documents'>
          <section className='flex flex-col'>
            <div className='w-full grid md:grid-cols-2 lg:grid-cols-4 gap-5'>
              {generalDocs?.map((doc) => (
                // <div
                //   key={doc.documentType}
                //   className='rounded border-[1px] border-gray-300 flex flex-col gap-4 justify-center items-center h-fit'
                // >
                //   <h2 className='text-lg bg-gray-100 w-full p-1'>
                //     {doc.documentType}
                //   </h2>
                //   {doc?.currentVersionDocument.documentURL ? (
                //     <div className=' h-[180px]  rounded border-[1px] border-gray-200'>
                //       {/* <p>{doc.docUrl}</p> */}
                //       <embed
                //         // height={180}
                //         // width={200}
                //         // alt={doc.documentType}
                //         src={doc.currentVersionDocument?.documentURL}
                //         className='w-fit h-full border-none'
                //       />
                //     </div>
                //   ) : (
                //     <div className='w-[200px] h-[180px] flex justify-center items-center'>
                //       <p className='text-gray-400 text-center w-full '>
                //         No uploaded document found
                //       </p>
                //     </div>
                //   )}
                //   <div className='flex items-center justify-between w-full p-1 px-2 pb-3 gap-2'>
                //     <div>
                //       <div>
                //         <span>
                //           Latest Document Version:{' '}
                //           {doc.currentVersionDocument.versionNumber}
                //         </span>
                //       </div>
                //     </div>
                //     <button
                //       onClick={() => {
                //         const query: {
                //           documentType: DocNameTypes;
                //           category: DocsCategoryTypes;
                //         } = {
                //           documentType: doc.documentType,
                //           category: 'General',
                //         };
                //         const queryString = new URLSearchParams(
                //           query
                //         ).toString();
                //         // console.log('query string', queryString);
                //         window.open(
                //           `/safety/documents/${doc.documentType}?${queryString}`
                //         );
                //       }}
                //       className='bg-blue-500 text-white hover:bg-blue-400 px-2 py-1 rounded'
                //     >
                //       see PDFs
                //     </button>
                //   </div>
                // </div>
                <TileBox key={doc.documentType} doc={doc} />
              ))}
            </div>
          </section>
        </TabsContent>
        <TabsContent value='sop/jha/hira'>
          <section className='flex flex-col '>
            {/* <div className='w-full rounded p-2 flex flex-col gap-2'>
            <h2 className='text-lg font-semibold'>
              Safety Management Documentation:
            </h2> */}
            <div className='w-full grid grid-cols-4 gap-5'>
              {sopJhaHiraDocs?.map((doc) => (
                // <div
                //   key={doc.documentType}
                //   className='rounded border-[1px] border-gray-300 flex flex-col gap-4 justify-center items-center h-fit'
                // >
                //   <h2 className='text-lg bg-gray-100 w-full p-1'>
                //     {doc.documentType}
                //   </h2>
                //   {doc?.currentVersionDocument.documentURL ? (
                //     <div className=' h-[180px]  rounded p-2'>
                //       {/* <p>{doc.docUrl}</p> */}
                //       <embed
                //         // height={180}
                //         // width={200}
                //         // alt={doc.documentType}
                //         src={doc.currentVersionDocument?.documentURL}
                //         className='w-fit h-[180px] border-none'
                //       />
                //     </div>
                //   ) : (
                //     <div className='w-[200px] h-[180px] flex justify-center items-center'>
                //       <p className='text-gray-400 text-center w-full '>
                //         No uploaded document found
                //       </p>
                //     </div>
                //   )}
                //   <div className='flex items-center justify-center p-1 pb-3 gap-2'>
                //     <button
                //       onClick={() => {
                //         const query: {
                //           documentType: DocNameTypes;
                //           category: DocsCategoryTypes;
                //         } = {
                //           documentType: doc.documentType,
                //           category: 'SOP/JHA/HIRA',
                //         };
                //         const queryString = new URLSearchParams(
                //           query
                //         ).toString();
                //         // console.log('query string', queryString);
                //         window.open(
                //           `/safety/documents/${doc.documentType}?${queryString}`
                //         );
                //       }}
                //       className='bg-blue-500 text-white hover:bg-blue-400 px-2 py-1 rounded'
                //     >
                //       see doc
                //     </button>
                //     <button className='bg-red-500 text-white hover:bg-red-400 px-2 py-1 rounded'>
                //       delete{' '}
                //     </button>
                //   </div>
                // </div>
                <TileBox key={doc.documentType} doc={doc} />
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

const TileBox = ({ doc }: { doc: ICurrentVersionOfAllDocumentsResponse }) => {
  const doesAnyPdfExist = !!doc?.currentVersionDocument.versionNumber;
  return (
    <div
      key={doc.documentType}
      className='rounded border-[1px] border-gray-300 flex flex-col gap-4 justify-center items-center h-fit'
    >
      <h2 className='text-lg bg-gray-100 w-full py-1 px-2'>
        {doc.documentType}
      </h2>
      <div className='flex flex-col gap-2 p-2 w-full'>
        <div className='flex items-end justify-between w-full gap-2'>
          <div className='flex flex-col gap-1'>
            <div className='text-xs flex justify-start items-center gap-1'>
              <span className='text-gray-500'>Latest PDF Version:</span>
              <span>
                {doc.currentVersionDocument.versionNumber
                  ? doc.currentVersionDocument.versionNumber
                  : 'N/A'}
              </span>
            </div>
            <div className='text-xs flex justify-start items-center gap-1'>
              <span className='text-gray-500'> Uploaded On:</span>
              <span>
                {doc?.currentVersionDocument?.uploadDate
                  ? new Date(
                      doc.currentVersionDocument.uploadDate
                    ).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
          {doesAnyPdfExist && (
            <button
              onClick={() => {
                const query: {
                  documentType: DocNameTypes;
                  category: DocsCategoryTypes;
                } = {
                  documentType: doc.documentType,
                  category: 'General',
                };
                const queryString = new URLSearchParams(query).toString();
                // console.log('query string', queryString);
                window.open(
                  `/safety/documents/${doc.documentType}?${queryString}`
                );
              }}
              className='text-blue-500 hover:underline rounded text-sm'
            >
              See All PDFs
            </button>
          )}
        </div>
        {doesAnyPdfExist ? (
          <button
            className='border-[1px] border-blue-100 text-blue-500 w-full rounded py-1'
            onClick={() => {
              const query = {
                documentType: doc.documentType.toString(),
                version: doc.currentVersionDocument.versionNumber.toString(),
                category: doc.category.toString(),
                documentURL: doc?.currentVersionDocument.documentURL.toString(),
              };

              const queryString = new URLSearchParams(query).toString();
              // console.log('query string', queryString);
              window.open(
                `/safety/documents/${doc.documentType}/version?${queryString}`
              );
            }}
          >
            See Latest PDF
          </button>
        ) : (
          <button
            className='border-[1px] border-blue-100 text-blue-500 w-full rounded py-1'
            onClick={() => {
              const query: {
                documentType: DocNameTypes;
                category: DocsCategoryTypes;
              } = {
                documentType: doc.documentType,
                category: 'General',
              };
              const queryString = new URLSearchParams(query).toString();
              // console.log('query string', queryString);
              window.open(
                `/safety/documents/${doc.documentType}?${queryString}`
              );
            }}
          >
            Upload PDF
          </button>
        )}
      </div>
    </div>
  );
};

// EMBED IF NEEDED
// <h2 className='text-lg bg-gray-100 w-full py-1 px-2'>
//   {doc.documentType}
// </h2>;

// {
//   doc?.currentVersionDocument.documentURL ? (
//     <div className=' h-[180px]  rounded border-[1px] border-gray-200'>
//       {/* <p>{doc.docUrl}</p> */}
//       <embed
//         src={doc.currentVersionDocument?.documentURL}
//         className='w-fit h-full border-none'
//       />
//     </div>
//   ) : (
//     <div className='w-[98%] h-[180px] flex justify-center items-center border-[1px] border-gray-200 '>
//       <p className='text-gray-400 text-center w-full '>
//         No uploaded document found
//       </p>
//     </div>
//   );
// }

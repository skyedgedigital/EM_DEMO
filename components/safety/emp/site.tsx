import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { storage } from '@/utils/fireBase/config';
import {
  ref as firebaseStorageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import toast from 'react-hot-toast';
import Image from 'next/image';
import {
  IToolboxTalkVersion,
  IToolboxTalkVersionWithRevNo,
} from '../../../lib/models/Safety/toolboxtalk.model';
import { IToolboxTalk } from '@/lib/models/Safety/toolboxtalk.model';
import { IWorkOrderHr } from '@/lib/models/HR/workOrderHr.model';
import toolboxTalkActions from '@/lib/actions/safety/toolboxtalk/toolboxtalkActions';
import { FaSpinner } from 'react-icons/fa6';
import { IEnterpriseBase } from '@/interfaces/enterprise.interface';
import logo from '@/public/assets/dark-logo.png';
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

type IFromIToolboxTalkFields = Pick<
  IToolboxTalk,
  | 'programName'
  | 'documentNo'
  | 'effectiveDate'
  | 'contractorRepresentative'
  | 'vendorCode'
>;
type IFromIToolboxTalkVersion = Pick<IToolboxTalkVersion, 'uploadDate'>;
export type TSiteFileUrl = Pick<IToolboxTalkVersion, 'siteFileURL'>;
type IFromIToolboxTalkVersionWithRevNo = Pick<
  IToolboxTalkVersionWithRevNo,
  'revNo' | 'siteFileURL'
>;
type IFromIWorkOrderHr = Pick<IWorkOrderHr, 'workOrderNumber'>;
interface ISiteForm
  extends IFromIToolboxTalkFields,
    IFromIToolboxTalkVersion,
    IFromIToolboxTalkVersionWithRevNo,
    IFromIWorkOrderHr {
  updateSiteURL: () => void;
  enterPriseInfo: IEnterpriseBase;
  canEditImportantDetails?: boolean;
  canEditAllDetails?: boolean;
}

const SiteUploads = forwardRef(
  (
    {
      siteFileURL = '',
      documentNo = 'N/A',
      effectiveDate,
      revNo = -1,
      workOrderNumber = 'N/A',
      programName = 'N/A',
      uploadDate,
      contractorRepresentative = 'N/A',
      vendorCode = 'N/A',
      updateSiteURL = async () => {
        console.error(
          'FRONTEND LOAD ERROR : running default update attendance function'
        );
        toast.error(
          'FRONTEND LOAD ERROR : running default update attendance function'
        );
      },
      enterPriseInfo,
      canEditAllDetails,
      canEditImportantDetails,
    }: ISiteForm,
    ref
  ) => {
    console.log('SiteUploads');

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [siteFileUrl, setSitFileUrl] = useState<TSiteFileUrl>({
      siteFileURL: siteFileURL,
    });

    // Expose the local state to the parent component
    useImperativeHandle(ref, () => ({
      getFeedbackData: (): TSiteFileUrl => siteFileUrl, // Function to return the current attendance data
    }));

    useEffect(() => {
      updateSiteURL();
    }, [siteFileUrl]);

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    const handleRemoveFile = () => {
      setFile(null);
    };

    const handlePDFUpload = async (
      file: File,
      storagePath: string,
      fileName: string
    ): Promise<string> => {
      try {
        // Step 1: Convert the file to a Blob
        const blob = new Blob([file], { type: file.type });

        // Step 2: Upload the Blob to Firebase Storage

        const storageRef = firebaseStorageRef(
          storage,
          `${storagePath}/${fileName}`
        );
        const uploadTask = uploadBytesResumable(storageRef, blob);
        const downloadURL = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              console.error('Error uploading PDF to Firebase:', error);
              reject(error);
            },
            async () => {
              try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              } catch (error) {
                console.error('Error getting download URL:', error);
                reject(error);
              }
            }
          );
        });

        toast.success('PDF uploaded successfully!');
        return downloadURL;
      } catch (error) {
        console.error('Error uploading PDF:', error);
        toast.error('Failed to upload PDF. Please try again.');
        throw error;
      }
    };
    const handleUpload = async () => {
      if (!file) {
        toast.error('No file selected');
        return;
      }
      try {
        setUploading(true);
        const { data, error, success, message } =
          await toolboxTalkActions.FETCH.getNextToolboxTalkVersion(documentNo);
        if (!success) {
          return toast.error(
            message ||
              JSON.stringify(error) ||
              'Filed to generate next version for new upload. Please try later'
          );
        }
        const { nextVersion } = data;
        if (!nextVersion) {
          return toast.error(
            JSON.stringify(error) ||
              'Filed to generate next version for new upload. Please try later'
          );
        }

        console.log('next version', nextVersion);
        const downloadURL: string = await handlePDFUpload(
          file,
          `toolboxtalk/sitefile/${documentNo}/${nextVersion}`, // Firebase Storage path
          `${documentNo}${nextVersion}.pdf` // Unique file name
        );

        console.log('downloadURL', downloadURL);
        if (downloadURL) {
          toast.success('Attendance Photo uploaded');
          setSitFileUrl({ siteFileURL: downloadURL });
        }
        // console.log(data, Error, Message, Status, Success);
      } catch (error) {
        toast.error(
          JSON.stringify(error) ||
            `Failed to upload attendance ${documentNo} image`
        );
      } finally {
        setUploading(false);
      }
    };

    return (
      <form className='border-[1px] border-gray-400 rounded flex flex-col gap-2 m-8'>
        {/* log0 & all top */}
        <div className='grid grid-cols-3 p-2'>
          {/* two section */}
          <div className=' col-span-2'>
            <div className='flex'>
              <div className='flex w-1/2 p-2 justify-start gap-2 items-center'>
                <Image src={logo} alt='logo' width={50} />
                <h1 className='text-lg font-bold text-blue-500'>
                  {enterPriseInfo.name}
                </h1>{' '}
              </div>
              <p className='p-1 w-1/2 flex justify-center items-center font-bold text-lg'>
                Form & Formats <br />
                Site Safety <br />
                Site Sheet
              </p>
            </div>
            <div className=' flex flex-col'>
              <div className='w-full flex justify-start items-center gap-3 flex-grow p-1'>
                <p>Name of the program:</p>
                <p>{programName}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3 flex-grow p-1'>
                <p>Work Order Number:</p>
                <p>{workOrderNumber}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3 flex-grow p-1'>
                <label htmlFor='location'>Location:</label>
                <p>location</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3 flex-grow p-1'>
                <p>Contractor Representative</p>
                <p>{contractorRepresentative}</p>
              </div>
            </div>
          </div>
          <div className=' flex-col flex justify-around gap-2 p-2'>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <p>Sheet No.:</p>
              <p>XX PROGRAM</p>
            </div>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <p>Revision No:</p>
              <p>{revNo}</p>
            </div>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <p>Effective Date:</p>
              <p>{effectiveDate?.toLocaleDateString()}</p>
            </div>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <p>Document No.:</p>
              <p>{documentNo}</p>
            </div>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <p>Date:</p>
              <p>{uploadDate?.toLocaleDateString()}</p>
            </div>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <p>Time:</p>
              <p>{uploadDate?.toTimeString()}</p>
            </div>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <label htmlFor='vendorCode'>Vendor Code:</label>
              <p>{vendorCode}</p>
            </div>
          </div>
        </div>
        <div className='w-full flex items-center justify-center gap-2 p-2'>
          <div className='flex gap-2 w-1/2'>
            <input
              disabled={!canEditAllDetails}
              type='file'
              onChange={handleFileChange}
              className='border border-gray-300 rounded p-2 mb-4 w-full'
            />
            {file && (
              <div className='mb-4 flex items-center'>
                <span className='mr-4 text-green-600'>{file.name}</span>
                <button
                  onClick={handleRemoveFile}
                  className='bg-red-500 text-white text-nowrap p-2 rounded hover:bg-red-700'
                >
                  Remove File
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='w-full justify-center items-center flex my-6 gap-2'>
          {!canEditAllDetails && !canEditImportantDetails && !siteFileURL && (
            <span className='text-red-400 flex justify-center items-center gap-2'>
              <ExclamationTriangleIcon className='w-[20px] h-[20px]' />{' '}
              <p>No Site File Were Uploaded</p>
            </span>
          )}
          {canEditAllDetails && (
            <button
              type='submit'
              onClick={(e: React.FormEvent) => {
                e.preventDefault();
                handleUpload();
              }}
              className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 flex justify-center items-center gap-2'
            >
              {uploading ? (
                <>
                  <FaSpinner />
                  Uploading
                </>
              ) : (
                'Upload'
              )}
            </button>
          )}
          {siteFileURL && (
            <Link
              target='_blank'
              href={siteFileURL}
              className='border-[1px] border-blue-500 text-blue-500 px-2 py-1 rounded flex justify-center items-center gap-2'
            >
              See Uploaded Site File
            </Link>
          )}
        </div>
      </form>
    );
  }
);

SiteUploads.displayName = 'SiteUploads';
export default SiteUploads;

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
  IAttendance,
  IToolboxTalkVersion,
  IToolboxTalkVersionWithRevNo,
} from '../../../lib/models/Safety/toolboxtalk.model';
import { IToolboxTalk } from '@/lib/models/Safety/toolboxtalk.model';
import { IWorkOrderHr } from '@/lib/models/HR/workOrderHr.model';
import toolboxTalkActions from '@/lib/actions/safety/toolboxtalk/toolboxtalkActions';
import { FaSpinner } from 'react-icons/fa6';

type IFromIToolboxTalkFields = Pick<
  IToolboxTalk,
  | 'programName'
  | 'documentNo'
  | 'effectiveDate'
  | 'contractorRepresentative'
  | 'vendorCode'
>;
type IFromIToolboxTalkVersion = Pick<IToolboxTalkVersion, 'uploadDate'>;
type IFromIToolboxTalkVersionWithRevNo = Pick<
  IToolboxTalkVersionWithRevNo,
  'revNo'
>;
type IFromIWorkOrderHr = Pick<IWorkOrderHr, 'workOrderNumber'>;
interface IAttendanceForm
  extends IFromIToolboxTalkFields,
    IFromIToolboxTalkVersion,
    IFromIToolboxTalkVersionWithRevNo,
    IFromIWorkOrderHr,
    IAttendance {
  updateAttendance: () => void;
}

const AttendanceUploads = forwardRef(
  (
    {
      documentNo = 'N/A',
      effectiveDate,
      revNo = -1,
      workOrderNumber = 'N/A',
      programName = 'N/A',
      uploadDate,
      contractorRepresentative = 'N/A',
      vendorCode = 'N/A',
      permitNo = 'N/A',
      remarks = 'N/A',
      attendanceFileURL,
      updateAttendance = async () => {
        console.error(
          'FRONTEND LOAD ERROR : running default update attendance function'
        );
        toast.error(
          'FRONTEND LOAD ERROR : running default update attendance function'
        );
      },
    }: IAttendanceForm,
    ref
  ) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [attendanceData, setAttendanceData] = useState<IAttendance>({
      permitNo: permitNo,
      attendanceFileURL: attendanceFileURL,
      remarks: remarks,
    });

    // Expose the local state to the parent component
    useImperativeHandle(ref, () => ({
      getFeedbackData: (): IAttendance => attendanceData, // Function to return the current attendance data
    }));

    useEffect(() => {
      updateAttendance();
    }, [attendanceData]);

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
        const {
          data: { nextVersion },
          error,
        } = await toolboxTalkActions.FETCH.getNextToolboxTalkVersion(
          documentNo
        );

        if (!nextVersion) {
          return toast.error(
            JSON.stringify(error) ||
              'Filed to generate next version for new upload. Please try later'
          );
        }

        console.log('next version', nextVersion);
        const downloadURL: string = await handlePDFUpload(
          file,
          `toolboxtalk/attendance/${documentNo}/${nextVersion}`, // Firebase Storage path
          `${documentNo}${nextVersion}.pdf` // Unique file name
        );

        console.log('downloadURL', downloadURL);
        if (downloadURL) {
          toast.success('Attendance Photo uploaded');
          setAttendanceData((prev) => ({
            ...prev,
            attendanceFileURL: downloadURL,
          }));
        }
        // console.log(data, Error, Message, Status, Success);
      } catch (error) {
        toast.error(`Failed to upload attendance ${documentNo} image`);
      } finally {
        setUploading(false);
      }
    };

    return (
      <form className='border-2 border-black flex flex-col gap-2 m-8'>
        {/* log0 & all top */}
        {/* <div>{JSON.stringify(attendanceData)}</div> */}
        <div className='grid grid-cols-3'>
          {/* two section */}
          <div className=' col-span-2'>
            <div className='flex'>
              <div className='flex w-1/2'>
                <Image
                  src='/public/assets/dark-logo.png'
                  alt='logo'
                  width={100}
                  height={100}
                />
                <h1>Enterprise management demo</h1>
              </div>
              <p className=' border-l-2 border-gray-700 w-1/2 flex justify-center items-center font-bold'>
                Form & Formats <br />
                Site Safety <br />
                Attendance Sheet
              </p>
            </div>
            <div className=' flex flex-col'>
              <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
                <p>Name of the program:</p>
                <p>{programName}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
                <p>Work Order Number:</p>
                <p>{workOrderNumber}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
                <label htmlFor='location'>Location:</label>
                <p>location</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
                <p>Contractor Representative</p>
                <p>{contractorRepresentative}</p>
              </div>
            </div>
          </div>
          <div className=' flex-col flex justify-around border-[1px] border-gray-700'>
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
          <div className='w-fit flex justify-start items-center gap-3  flex-grow p-1'>
            <label htmlFor='permitNo' className='text-nowrap'>
              Permit no
            </label>
            <input
              defaultValue={permitNo}
              onChange={(e) =>
                setAttendanceData((prev) => ({
                  ...prev,
                  permitNo: e.target.value,
                }))
              }
              id='permitNo'
              type='text'
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />
          </div>
          <div className='w-full flex justify-start items-center gap-3  flex-grow p-1'>
            <label htmlFor='remarks'>Remarks</label>
            <textarea
              defaultValue={remarks}
              onChange={(e) => {
                setAttendanceData((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }));
              }}
              id='remarks'
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />
          </div>
          <div className='flex gap-2 w-full'>
            <input
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
        <div className='w-full justify-center items-center flex my-6'>
          <button
            type='submit'
            onClick={(e: React.FormEvent) => {
              e.preventDefault();
              handleUpload();
            }}
            className='bg-blue-500 text-white p-2 rounded hover:bg-blue-700'
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
        </div>
      </form>
    );
  }
);

AttendanceUploads.displayName = 'AttendanceUploads';
export default AttendanceUploads;

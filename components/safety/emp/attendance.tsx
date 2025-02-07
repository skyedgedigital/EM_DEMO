import React, { useEffect, useState } from 'react';
import { storage } from '@/utils/fireBase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import toolBoxTalkAction from '@/lib/actions/SafetyEmp/daily/toolBoxTalk/toolBoxTalkAction';
import toast from 'react-hot-toast';
import Image from 'next/image';

const AttendanceUploads = () => {
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResults] = useState([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await toolBoxTalkAction.FETCH.fetchAttendanceUploads();
      setResults(JSON.parse(res.data));
    };
    fetchData();
  }, []);

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
  };

  const handleUpload = () => {
    if (!file || !fileName) {
      alert('Please enter a file name and choose a file.');
      return;
    }

    const storageRef = ref(storage, `files/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const obj = {
          link: downloadURL,
          name: fileName,
          date: date,
        };
        const resp = await toolBoxTalkAction.CREATE.createAttendanceUpload(
          JSON.stringify(obj)
        );
        if (resp.success) {
          toast.success('Upload Saved');
          setResults((prev) => [...prev, obj]);
          handleRemoveFile();
        } else {
          toast.error('Upload Failed');
        }
      }
    );
  };

  const handleDelete = async (id: any) => {
    const resp = await toolBoxTalkAction.DELETE.deleteAttendanceUpload(id);
    if (resp.success) {
      toast.success('Deleted,Refresh to view Changes');
      //   setResults(prev => prev.filter(item => item.id !== id));
    } else {
      toast.error('Failed');
    }
  };

  return (
    <form className='border-2 border-black flex flex-col gap-2'>
      {/* log0 & all top */}
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
              <label htmlFor='programName'>Name of the program:</label>
              <input
                id='programName'
                type='text'
                // {...register('programName')}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />{' '}
            </div>
            <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
              <label htmlFor='workOrder'>Work Order Number:</label>
              <input
                id='workOrder'
                type='text'
                // {...register('versions.0.workOrderNo')}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />
            </div>
            <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
              <label htmlFor='location'>Location:</label>
              <p>location</p>
            </div>
            <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
              <label htmlFor='contractorRepresentative'>
                Contractor Representative
              </label>
              <input
                id='contractorRepresentative'
                type='text'
                // {...register('contractorRepresentative')}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />
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
            <p>1</p>
          </div>
          <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
            <p>Effective Date:</p>
            <p>XX PROGRAM</p>
          </div>
          <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
            <label htmlFor='documentNo'>Document No.:</label>
            <input
              id='documentNo'
              type='text'
              // {...register('documentNo')}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />
          </div>
          <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
            <p>Date:</p>
            <p>XX PROGRAM</p>
          </div>
          <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
            <p>Time:</p>
            <p>XX PROGRAM</p>
          </div>
          <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
            <label htmlFor='vendorCode'>Vendor Code:</label>
            <input
              id='vendorCode'
              type='text'
              // {...register('vendorCode')}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />
          </div>
        </div>
      </div>
      <div className='w-full flex items-center justify-center gap-2 p-2'>
        <div className='w-fit flex justify-start items-center gap-3  flex-grow p-1'>
          <label htmlFor='permitNo' className='text-nowrap'>
            Permit no
          </label>
          <input
            id='permitNo'
            type='text'
            // {...register('permitNo')}
            className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
          />
        </div>
        <div className='w-full flex justify-start items-center gap-3  flex-grow p-1'>
          <label htmlFor='remarks'>Remarks</label>
          <textarea
            id='remarks'
            // {...register('remarks')}
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
          onClick={handleUpload}
          className='bg-blue-500 text-white p-2 rounded hover:bg-blue-700'
        >
          Upload
        </button>
      </div>
    </form>
    // <div className='p-6 mx-auto'>
    // </div>
  );
};

export default AttendanceUploads;

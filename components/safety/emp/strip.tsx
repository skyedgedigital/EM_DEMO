import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  IStripPoint,
  StripColorsNames,
} from '../../../lib/models/Safety/toolboxtalk.model';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaCircle } from 'react-icons/fa6';
import { debounce } from 'lodash';
import { storage } from '@/utils/fireBase/config';
import {
  ref as firebaseStorageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import toast, { LoaderIcon } from 'react-hot-toast';
import toolboxTalkActions from '@/lib/actions/safety/toolboxtalk/toolboxtalkActions';
import { CheckCircle, Link2Icon } from 'lucide-react';
import Link from 'next/link';
import { MdCancel } from 'react-icons/md';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface IStripsUploads {
  stripPoints: IStripPoint[];
  updateStripsPoints: () => void;
  canEditImportantDetails?: boolean;
  canEditAllDetails?: boolean;
  documentNo: string;
}
const StripUploads = forwardRef(
  (
    {
      stripPoints,
      updateStripsPoints,
      canEditAllDetails,
      canEditImportantDetails,
      documentNo,
    }: IStripsUploads,
    ref
  ) => {
    const [uploadingPointFile, setUploadingPointFile] =
      useState<boolean>(false);
    const { control, watch, register, setValue } = useForm<{
      stripPoints: IStripPoint[];
    }>({
      defaultValues: { stripPoints },
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: 'stripPoints',
    });

    const formData = watch();

    useImperativeHandle(ref, () => ({
      getUpdatedStripPoints: () => {
        console.log('from strip point imperative', formData);
        return formData;
      },
    }));

    const debouncePointUpdate = debounce(() => {
      updateStripsPoints();
      cancelDebounce();
    }, 500);

    const cancelDebounce = () => debouncePointUpdate.cancel();

    const handleImageUpload = async (
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

        toast.success('Image uploaded successfully!');
        3;
        return downloadURL;
      } catch (error) {
        console.error('Error uploading PDF:', error);
        toast.error('Failed to upload PDF. Please try again.');
        throw error;
      }
    };
    const handleFileChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const pointNo = index + 1;
      if (!documentNo) {
        return toast.error('Document no is must to upload file');
      }
      const file = e.target.files[0];
      if (!file) return;
      try {
        setUploadingPointFile(true);
        const { data, error, success, status, message } =
          await toolboxTalkActions.FETCH.getNextToolboxTalkVersion(documentNo);
        if (!success) {
          return toast.error(
            message ||
              JSON.stringify(error) ||
              'Filed to generate next version for new upload. Please try later'
          );
        }
        const { nextVersion } = data;
        console.log('next version', nextVersion);
        const downloadURL = await handleImageUpload(
          file,
          `toolboxtalk/${documentNo}/${nextVersion}/stripPoints/pointNo${pointNo}`,
          `point${pointNo}`
        );
        const updatedPoints = [...formData.stripPoints];
        updatedPoints[index].pointFileUrl = downloadURL;
        setValue('stripPoints', updatedPoints);
        debouncePointUpdate();
      } catch (error) {
        console.log(error);
        toast.error(
          JSON.stringify(error) ||
            `Failed to upload attendance ${documentNo} image`
        );
      } finally {
        setUploadingPointFile(false);
      }
    };

    return (
      <section className=' w-full md:w-[90%] lg:w-[80%] mx-auto flex flex-col gap-3 my-5 border-[1px] border-gray-300 p-4 rounded-md shadow-sm'>
        <h2 className='text-lg font-semibold text-blue-500'>
          All Raised Points
        </h2>

        <form className='flex flex-col gap-2' onChange={debouncePointUpdate}>
          {fields.map(({ id, color, point }, index) => (
            <div
              key={id}
              className='flex flex-col md:flex-row justify-start items-end gap-6 border-b-[1px] border-gray-200 py-2 '
            >
              <span className='flex flex-col gap-1 flex-grow w-full md:w-auto'>
                <label className='text-gray-500' htmlFor={`point${index}`}>
                  Point {index + 1}
                </label>
                <input
                  type='text'
                  disabled={!canEditAllDetails}
                  defaultValue={point}
                  className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full '
                  {...register(`stripPoints.${index}.point`)}
                />
              </span>
              <span className='flex flex-col gap-1 items-start w-full md:w-[30%] lg:w-[20%]'>
                <label className='text-gray-500' htmlFor={`color${index}`}>
                  Priority Colour
                </label>
                <span className='flex gap-1 items-center justify-center relative w-full'>
                  <select
                    disabled={!canEditAllDetails}
                    id={`color${index}`}
                    defaultValue={color}
                    className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
                    {...register(`stripPoints.${index}.color`)}
                  >
                    {StripColorsNames.map((color) => (
                      <option key={color}>{color}</option>
                    ))}
                  </select>
                  <FaCircle
                    className={`text-${formData.stripPoints[index].color}-500 border-0 p-0 text-p`}
                    style={{ width: 24, height: 24 }}
                  />
                </span>
              </span>
              <span className='flex flex-col gap-1 items-start w-full md:w-[30%] lg:w-[20%]'>
                <label className='text-gray-500' htmlFor={`file${index}`}>
                  Upload File
                </label>
                <span className='flex flex-col gap-1 justify-start items-center'>
                  <span className='flex justify-center items-center gap-2'>
                    <input
                      type='file'
                      id={`file${index}`}
                      onChange={(e) => handleFileChange(e, index)}
                      className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
                      disabled={!canEditAllDetails}
                    />
                    {formData.stripPoints[index].pointFileUrl && (
                      <CheckCircle className='text-green-500' />
                    )}
                  </span>
                  {formData.stripPoints[index].pointFileUrl && (
                    <Link
                      aria-label='Open link in new tab'
                      target='_blank'
                      href={formData.stripPoints[index].pointFileUrl}
                      className='hover:underline text-blue-500 text-nowrap text-sm px-2 py-1 rounded flex justify-center items-center gap-2'
                    >
                      <Link2Icon /> See uploaded image
                    </Link>
                  )}
                </span>
              </span>
              <button
                type='button'
                disabled={!canEditAllDetails}
                onClick={() => remove(index)}
                className='text-red-500 disabled:text-red-400 border-red-300 border-[1px] rounded p-1 text-nowrap text-sm'
              >
                <MdCancel style={{ height: 22, width: 22 }} />
              </button>
            </div>
          ))}
          <div className='flex justify-center md:justify-end items-center'>
            <button
              disabled={uploadingPointFile || !canEditAllDetails}
              type='button'
              onClick={() =>
                append({ point: '', color: 'orange', pointFileUrl: '' })
              }
              className='bg-blue-500 disabled:bg-blue-400 text-white p-2 hover:bg-blue-700 w-fit px-3 py-2 rounded text-nowrap'
            >
              Add Point
            </button>
          </div>
          {!canEditAllDetails &&
            !canEditImportantDetails &&
            formData.stripPoints.length === 0 && (
              <span className='text-red-400 flex justify-center items-center gap-2'>
                <ExclamationTriangleIcon className='w-[20px] h-[20px]' />{' '}
                <p>No Points were raised</p>
              </span>
            )}{' '}
        </form>
        <div className='w-full justify-center items-center flex'>
          {uploadingPointFile && (
            <p className='w-fit text-nowrap flex justify-center items-center gap-2 p-1 px-3 rounded bg-blue-50 text-blue-600'>
              <LoaderIcon className='text-blue-500 w-[24px]' />
              &nbsp;Uploading Image...
            </p>
          )}
        </div>
      </section>
    );
  }
);

StripUploads.displayName = 'StripUploads';
export default StripUploads;

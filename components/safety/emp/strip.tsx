import React, { forwardRef, useImperativeHandle } from 'react';
import {
  IStripPoint,
  StripColorsNames,
} from '../../../lib/models/Safety/toolboxtalk.model';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaCircle } from 'react-icons/fa6';
import { debounce } from 'lodash';

interface IStripsUploads {
  stripPoints: IStripPoint[];
  updateStripsPoints: () => void;
  canEditImportantDetails?: boolean;
  canEditAllDetails?: boolean;
}
const StripUploads = forwardRef(
  ({ stripPoints, updateStripsPoints }: IStripsUploads, ref) => {
    const { control, watch, register } = useForm<{
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
    return (
      <section className=' w-full md:w-[80%] lg:w-[70%] mx-auto flex flex-col gap-3 my-5'>
        <h2 className='text-lg font-semibold text-blue-500'>
          All Raised Points
        </h2>
        <form className='flex flex-col gap-2' onChange={debouncePointUpdate}>
          {fields.map(({ id, color, point }, index) => (
            <div
              key={id}
              className='flex flex-col md:flex-row justify-start items-center gap-6 '
            >
              <span className='flex flex-col gap-1 flex-grow w-full md:w-auto'>
                <label className='text-gray-500' htmlFor={`point${index}`}>
                  Point {index + 1}
                </label>
                <textarea
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
              <button
                type='button'
                onClick={() => remove(index)}
                className='text-red-500 border-red-300 border-[1px] rounded px-2 py-1 text-nowrap text-sm'
              >
                Remove Point
              </button>
            </div>
          ))}
          <div className='flex justify-center md:justify-end items-center'>
            <button
              type='button'
              onClick={() => append({ point: '', color: 'blue' })}
              className='bg-blue-500 text-white p-2 hover:bg-blue-700 w-fit px-3 py-2 rounded text-nowrap'
            >
              Add Point
            </button>
          </div>
        </form>
      </section>
    );
  }
);

StripUploads.displayName = 'StripUploads';
export default StripUploads;
// <div className='p-6 max-w-4xl mx-auto'>
//   <h2 className='text-2xl text-center mb-6'>Upload Strip File</h2>
//   <div className='mb-6 bg-white p-4 rounded-lg shadow-md'>
//     <input
//       type='text'
//       placeholder='Enter file name'
//       value={fileName}
//       onChange={handleFileNameChange}
//       className='border border-gray-300 rounded p-2 mb-4 w-full'
//     />
//     <input
//       type='date'
//       placeholder='Enter file name'
//       value={date}
//       onChange={(e) => setDate(e.target.value)}
//       className='border border-gray-300 rounded p-2 mb-4 w-full'
//     />
//     <input
//       type='file'
//       onChange={handleFileChange}
//       className='border border-gray-300 rounded p-2 mb-4 w-full'
//     />
//     {file && (
//       <div className='mb-4 flex items-center'>
//         <span className='mr-4 text-green-600'>{file.name}</span>
//         <button
//           onClick={handleRemoveFile}
//           className='bg-red-500 text-white p-2 rounded hover:bg-red-700'
//         >
//           Remove File
//         </button>
//       </div>
//     )}
//     <button
//       onClick={handleUpload}
//       className='bg-blue-500 text-white p-2 rounded hover:bg-blue-700'
//     >
//       Upload
//     </button>
//     {progress > 0 && (
//       <progress
//         value={progress}
//         max='100'
//         className='w-full mt-4 h-2 rounded-lg overflow-hidden'
//       >
//         <div
//           className='bg-blue-500 h-full'
//           style={{ width: `${progress}%` }}
//         ></div>
//       </progress>
//     )}
//   </div>

//   <h2 className='text-2xl text-center mb-6'>Uploaded Files</h2>
//   <table className='min-w-full bg-white border border-gray-300 rounded-lg shadow-md'>
//     <thead>
//       <tr>
//         <th className='py-3 px-6 border-b font-medium text-gray-700'>
//           File Name
//         </th>
//         <th className='py-3 px-6 border-b font-medium text-gray-700'>
//           Date
//         </th>
//         <th className='py-3 px-6 border-b font-medium text-gray-700'>
//           Link
//         </th>
//         <th className='py-3 px-6 border-b font-medium text-gray-700'>
//           Actions
//         </th>
//       </tr>
//     </thead>
//     <tbody>
//       {result?.map((item, index) => (
//         <tr key={index} className='hover:bg-gray-100'>
//           <td className='py-3 px-6 border-b text-center'>{item.name}</td>
//           <td className='py-3 px-6 border-b text-center'>{item.date}</td>
//           <td className='py-3 px-6 border-b text-center'>
//             <a
//               href={item.link}
//               target='_blank'
//               rel='noopener noreferrer'
//               className='text-blue-500 underline'
//             >
//               View
//             </a>
//           </td>
//           <td className='py-3 px-6 border-b flex justify-center'>
//             <button
//               onClick={() => handleDelete(item._id)}
//               className='bg-red-500 text-white p-2 rounded hover:bg-red-700'
//             >
//               Delete
//             </button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>

// const [fileName, setFileName] = useState('');
// const [file, setFile] = useState(null);
// const [progress, setProgress] = useState(0);
// const [result, setResults] = useState([]);
// const [date, setDate] = useState('');

// useEffect(() => {
//   const fetchData = async () => {
//     const res = await toolBoxTalkAction.FETCH.fetchStripUploads();
//     setResults(JSON.parse(res.data));
//   };
//   fetchData();
// }, []);

// const handleFileNameChange = (e) => {
//   setFileName(e.target.value);
// };

// const handleFileChange = (e) => {
//   setFile(e.target.files[0]);
// };

// const handleRemoveFile = () => {
//   setFile(null);
//   setProgress(0);
// };

// const handleUpload = () => {
//   if (!file || !fileName) {
//     alert('Please enter a file name and choose a file.');
//     return;
//   }

//   const storageRef = ref(storage, `files/${fileName}`);
//   const uploadTask = uploadBytesResumable(storageRef, file);

//   uploadTask.on(
//     'state_changed',
//     (snapshot) => {
//       const progress =
//         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       setProgress(progress);
//     },
//     (error) => {
//       console.error('Upload failed:', error);
//     },
//     async () => {
//       const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//       const obj = {
//         link: downloadURL,
//         name: fileName,
//         date: date,
//       };
//       const resp = await toolBoxTalkAction.CREATE.createStripUpload(
//         JSON.stringify(obj)
//       );
//       if (resp.success) {
//         toast.success('Upload Saved');
//         setResults((prev) => [...prev, obj]);
//         handleRemoveFile();
//       } else {
//         toast.error('Upload Failed');
//       }
//     }
//   );
// };

// const handleDelete = async (id: any) => {
//   const resp = await toolBoxTalkAction.DELETE.deleteStripUpload(id);
//   if (resp.success) {
//     toast.success('Deleted,Refresh to view Changes');
//     //   setResults(prev => prev.filter(item => item.id !== id));
//   } else {
//     toast.error('Failed');
//   }
// };

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { storage } from '@/utils/fireBase/config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import toast from 'react-hot-toast';
import toolBoxTalkAction from '@/lib/actions/SafetyEmp/daily/toolBoxTalk/toolBoxTalkAction';
import Image from 'next/image';
import mongoose from 'mongoose';
import {
  IToolboxTalk,
  RecordStatusNames,
  SupervisorNames,
} from '@/lib/models/Safety/toolboxtalk.model';
import { useForm, useFieldArray } from 'react-hook-form';
// import { SupervisorNames } from '../../../lib/models/Safety/toolboxtalk.model';

const superVisors: typeof SupervisorNames = [
  'Company Supervisor',
  'Line Manager',
];
const toolboxTalkExample: IToolboxTalk = {
  documentNo: 'TBT-2024-001',
  programName: 'Working at Heights Safety Program',
  effectiveDate: new Date('2024-03-20'),
  vendorCode: 'VENDOR123',
  safetyRepresentative: 'John Smith',
  contractorRepresentative: 'Mike Johnson',
  currentVersion: 1,
  versions: [
    {
      revNo: 1,
      workOrderNo: new mongoose.Types.ObjectId('64f8c3e5d52a9b1c72a0b123'),
      totalManPower: 25,
      totalWorkers: 20,
      totalEmployees: 23,
      totalSafety: 2,
      supervisor: 'Company Supervisor',
      questions: [
        {
          question:
            'Safety contact and review of action items from last meeting?',
          answer:
            'Falls, falling objects, weather conditions, unstable surfaces',
        },
        {
          question: `Items of General Safety Importance to the Total Work Site:
                (ask employees to mention any incidents/nearmiss during the past
                day which may have resulted in damage to property or injury to
                Company or Contractor personnel)?`,
          answer:
            'Safety harness, hard hat, safety shoes, high-visibility vest',
        },
        {
          question: `Items of Safety Interest to this Group: (e.g. Red Stripes,
                Orange stripes, Green stripe, safety alert tips safety
                communications, hazards or safety conditions applicable to this
                group's work area)?`,
          answer:
            'Safety harness, hard hat, safety shoes, high-visibility vest',
        },
        {
          question: `Safety Message Hand Outs/circulars to be shared with contract employee?`,
          answer:
            'Safety harness, hard hat, safety shoes, high-visibility vest',
        },
      ],
      records: [
        {
          actionBy: 'Inspect all safety harnesses',
          when: 'Before each shift',
          targetDate: new Date('2024-03-20'),
          status: 'Completed',
          item: 'Newly added item',
        },
        {
          actionBy: 'Check weather conditions',
          when: 'Every 2 hours',
          targetDate: new Date('2024-03-20'),
          status: 'In Progress',
          item: 'Newly added item two',
        },
      ],
      points: [
        {
          point: 'Always maintain three points of contact on ladders',
          color: 'red',
        },
        {
          point: 'Inspect all equipment before use',
          color: 'yellow',
        },
        {
          point: 'Report any safety concerns immediately',
          color: 'green',
        },
      ],
      uploadDate: new Date('2024-03-20'),
      suggestion: 'Consider implementing a buddy system for height work',
      feedback: 'Good participation from all attendees',
      attendanceFileURL:
        'https://storage.firebase.com/attendance-sheet-001.pdf',
      siteFileURL: 'https://storage.firebase.com/site-photos-001.pdf',
    },
  ],
};
const AddToolBoxTalk = () => {
  // const [selectedDate, setSelectedDate] = useState('');

  // const [formData, setFormData] = useState({
  //   sheetNo: '',
  //   revNo: '',
  //   effectiveDate: '',
  //   documentNo: '',
  //   programName: '',
  //   workOrderNo: '',
  //   time: '',
  //   safetyRep: '',
  //   vendorCode: '',
  //   contractorRep: '',
  //   supervisor: '',
  //   totalManpower: '',
  //   workers: '',
  //   supervisors: '',
  //   emps: '',
  //   safety: '',
  //   q1: '',
  //   q2: '',
  //   q3: '',
  //   q4: '',
  //   options: {
  //     option1: false,
  //     option2: false,
  //     option3: false,
  //     option4: false,
  //     option5: false,
  //     option6: false,
  //     option7: false,
  //     option8: false,
  //     option9: false,
  //   },
  //   q5: '',
  //   suggestion: '',
  //   feedback: '',
  // });

  // const [tableData, setTableData] = useState([]);
  // const [newAction, setNewAction] = useState('');
  // const [newWhen, setNewWhen] = useState('');
  // const [newDate, setNewDate] = useState('');
  // const [newStatus, setNewStatus] = useState('');

  // const handleAddRow = () => {
  //   if (newAction && newWhen && newDate && newStatus) {
  //     setTableData([
  //       ...tableData,
  //       { action: newAction, when: newWhen, date: newDate, status: newStatus },
  //     ]);
  //     setNewAction('');
  //     setNewWhen('');
  //     setNewDate('');
  //     setNewStatus('');
  //   }
  // };

  // const handleDeleteRow = (index) => {
  //   const updatedData = tableData.filter((_, i) => i !== index);
  //   setTableData(updatedData);
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  // };

  // const handleCheckboxChange = (e) => {
  //   const { name, checked } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     options: {
  //       ...prevData.options,
  //       [name]: checked,
  //     },
  //   }));
  // };

  // const generateExcel = () => {
  //   console.log(tableData);
  //   const wb = XLSX.utils.book_new();
  //   const ws = XLSX.utils.aoa_to_sheet([
  //     ['Label', 'Value'],
  //     ['Sheet No.', formData.sheetNo],
  //     ['Rev No.', formData.revNo],
  //     ['Effective Date', formData.effectiveDate],
  //     ['Document No.', formData.documentNo],
  //     ['Name of the Program', formData.programName],
  //     ['Work Order Number', formData.workOrderNo],
  //     ['Time', formData.time],
  //     ['Safety Representative', formData.safetyRep],
  //     ['Vendor Code', formData.vendorCode],
  //     ['Contractor Representative', formData.contractorRep],
  //     ['Supervisor', formData.supervisor],
  //     ['Total Manpower', formData.totalManpower],
  //     ['Workers', formData.workers],
  //     ['Supervisors', formData.supervisors],
  //     ['Emps', formData.emps],
  //     ['Safety', formData.safety],
  //     ['First Question', formData.q1],
  //     ['Second Question', formData.q2],
  //     ['Third Question', formData.q3],
  //     ['Fourth Question', formData.q4],
  //     ['Options'],
  //     ['Option 1', formData.options.option1],
  //     ['Option 2', formData.options.option2],
  //     ['Option 3', formData.options.option3],
  //     ['Option 4', formData.options.option4],
  //     ['Option 5', formData.options.option5],
  //     ['Option 6', formData.options.option6],
  //     ['Option 7', formData.options.option7],
  //     ['Option 8', formData.options.option8],
  //     ['Option 9', formData.options.option9],
  //     ['Fifth Question', formData.q5],
  //     ['Suggestion', formData.suggestion],
  //     ['Feedback', formData.feedback],
  //     ['Actions Taken'],
  //     ['Action', 'When', 'Date', 'Status'],
  //   ]);

  //   // Determine the starting row index for tableData
  //   const startingRowIndex = 38; // Hardcoded based on observed issue

  //   tableData.forEach((row, index) => {
  //     const currentRowIndex = startingRowIndex + index;
  //     ws[`A${currentRowIndex}`] = { v: row.action };
  //     ws[`B${currentRowIndex}`] = { v: row.when };
  //     ws[`C${currentRowIndex}`] = { v: row.date };
  //     ws[`D${currentRowIndex}`] = { v: row.status };
  //   });

  //   // Manually set the !ref to ensure worksheet dimensions include the new data
  //   ws['!ref'] = `A1:D${startingRowIndex + tableData.length - 1}`;

  //   ws['!cols'] = [
  //     { wch: 20 }, // Column A width
  //     { wch: 20 }, // Column B width
  //     { wch: 20 }, // Column C width
  //     { wch: 20 }, // Column D width
  //   ];

  //   XLSX.utils.book_append_sheet(wb, ws, 'Form Data');
  //   XLSX.writeFile(wb, `Tool_Box_Talk${selectedDate || 'No_Date'}.xlsx`);

  //   const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   const blob = new Blob([wbout], { type: 'application/octet-stream' });

  //   const storageRef = ref(
  //     storage,
  //     `excel/Tool_Box_Talk${selectedDate || 'No_Date'}.xlsx`
  //   );
  //   const uploadTask = uploadBytesResumable(storageRef, blob);

  //   uploadTask.on(
  //     'state_changed',
  //     (snapshot) => {
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log(`Upload is ${progress}% done`);
  //     },
  //     (error) => {
  //       console.error('Error uploading Excel to Firebase:', error);
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
  //         const obj = {
  //           link: downloadURL,
  //           sheetNo: formData.sheetNo,
  //           revNo: formData.revNo,
  //           date: selectedDate,
  //         };
  //         const resp = await toolBoxTalkAction.CREATE.createToolBoxTalk(
  //           JSON.stringify(obj)
  //         );
  //         if (resp.success) {
  //           toast.success('Excel Saved');
  //         } else {
  //           toast.error('Error Occurred');
  //         }
  //         console.log('Excel available at', downloadURL);
  //       });
  //     }
  //   );
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle form submission here
  //   console.log(formData);
  //   // generatePDF();
  //   generateExcel();
  // };

  // ------------------------------------------------------------------------------------------------------------------

  const { control, formState, register, reset, watch, handleSubmit } =
    useForm<IToolboxTalk>({
      defaultValues: toolboxTalkExample,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'versions.0.records',
  });

  const values = watch(); // Get current form values

  const addNewRow = () => {
    append({
      item: '',
      actionBy: '',
      when: '',
      targetDate: new Date(),
      status: 'Issued',
    });
  };

  return (
    <section className='m-8 rounded'>
      {/* boundary */}
      <div className='border-2 border-black py-1 flex flex-col gap-2'>
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
                Tool Box Talk (Meeting)
              </p>
            </div>
            <div className=' flex flex-col'>
              <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
                <label htmlFor='programName'>Name of the program:</label>
                <input
                  id='programName'
                  type='text'
                  {...register('programName')}
                  className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
                />{' '}
              </div>
              <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
                <label htmlFor='workOrder'>Work Order Number:</label>
                <input
                  id='workOrder'
                  type='text'
                  {...register('versions.0.workOrderNo')}
                  className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
                />
              </div>
              <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
                <label htmlFor='location'>Location:</label>
                <p>location</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
                <label htmlFor='safetyRepresentative'>
                  Safety Representative:
                </label>
                <input
                  id='safetyRepresentative'
                  type='text'
                  {...register('safetyRepresentative')}
                  className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
                />
              </div>
              <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
                <label htmlFor='contractorRepresentative'>
                  Contractor Representative
                </label>
                <input
                  id='contractorRepresentative'
                  type='text'
                  {...register('contractorRepresentative')}
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
                {...register('documentNo')}
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
                {...register('vendorCode')}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />
            </div>
            <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
              <p>Company Supervisor /Line Manager:</p>
              <select
                value={values.versions[0].supervisor}
                {...register('versions.0.supervisor')}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              >
                {/* <option value='#'>select supervisor type</option> */}
                {superVisors.map((sn) => (
                  <option value={sn} key={sn}>
                    {sn}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className='flex justify-around items-center p-1 border-[1px] border-black'>
          <span className='flex-grow flex justify-between items-center'>
            <p>Total Man Power:</p>
            <p className='border-b-[1px] border-gray-600'></p>
          </span>
          <span className='flex-grow flex justify-between items-center'>
            <p>Workers:</p>
            <p className='border-b-[1px] border-gray-600'></p>
          </span>
          <span className='flex-grow flex justify-between items-center'>
            <p>Supervisors:</p>
            <p className='border-b-[1px] border-gray-600'></p>
          </span>
          <span className='flex-grow flex justify-between items-center'>
            <p>Engineers:</p>
            <p className='border-b-[1px] border-gray-600'></p>
          </span>
          <span className='flex-grow flex justify-between items-center'>
            <p>Safety:</p>
            <p className='border-b-[1px] border-gray-600'></p>
          </span>
        </div>

        <div className='my-3 flex flex-col gap-3 p-3'>
          <p className='font-semibold'>
            ITEMS DISCUSSED: (Indicate if not discussed)
          </p>

          <div className='flex flex-col gap-3'>
            {toolboxTalkExample?.versions[0].questions.map((qna, index) => (
              <div key={qna.question} className='flex flex-col gap-2'>
                <label className='font-semibold' htmlFor={qna.question}>
                  {qna.question}
                </label>
                <textarea
                  id={qna.question}
                  {...register(`versions.0.questions.${index}.question`)}
                  className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded h-fit'
                />
              </div>
            ))}
          </div>
          <div>
            <p className='font-semibold p-1'>
              7. Actions resulting from this Meeting and point raised by
              contract employee & supervisor:
            </p>

            <table className='border-[1px] border-gray-500 w-full'>
              <thead className='border-[1px] border-gray-500 '>
                <tr>
                  <th className='border-[1px] border-gray-500 py-1 px-2'>
                    Item
                  </th>
                  <th className='border-[1px] border-gray-500 py-1 px-2'>
                    Action By
                  </th>
                  <th className='border-[1px] border-gray-500 py-1 px-2'>
                    when
                  </th>
                  <th className='border-[1px] border-gray-500 p-1'>
                    Target Date
                  </th>
                  <th className='border-[1px] border-gray-500 py-1 px-2'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr
                    key={field.id}
                    className='border-[1px] border-gray-500 py-1 px-2'
                  >
                    <td className='border-[1px] border-gray-500 py-1 px-2'>
                      <input
                        type='text'
                        {...register(`versions.0.records.${index}.item`)}
                        className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
                      />
                    </td>
                    <td className='border-[1px] border-gray-500 py-1 px-2'>
                      <input
                        type='text'
                        {...register(`versions.0.records.${index}.actionBy`)}
                        className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
                      />
                    </td>
                    <td className='border-[1px] border-gray-500 py-1 px-2'>
                      <input
                        type='text'
                        {...register(`versions.0.records.${index}.when`)}
                        className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
                      />
                    </td>
                    <td className='border-[1px] border-gray-500 py-1 px-2'>
                      <input
                        type='text'
                        {...register(`versions.0.records.${index}.targetDate`)}
                        className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
                      />
                    </td>
                    <td className='border-[1px] border-gray-500 py-1 px-2'>
                      <select
                        {...register(`versions.0.records.${index}.status`)}
                        className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
                      >
                        {/* <option value='#'>select supervisor type</option> */}
                        {RecordStatusNames.map((sn) => (
                          <option value={sn} key={sn}>
                            {sn}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='border-[1px] border-gray-500 py-1 px-2'>
                      <button
                        type='button'
                        onClick={() => remove(index)}
                        className='text-red-500 hover:text-red-700'
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex justify-end items-center  w-full col-span-6'>
              <button
                type='button'
                onClick={addNewRow}
                className='bg-blue-500 text-white px-4 py-2 rounded mt-2'
              >
                Add Row
              </button>
            </div>
          </div>
        </div>
        <div className='flex justify-start  gap-1 px-3 items-start'>
          <label htmlFor='suggestion' className='font-semibold'>
            Suggestion:
          </label>
          <textarea
            id='suggestion'
            {...register('versions.0.suggestion')}
            className='border-[1px] border-gray-500 bg-gray-50 p-1 rounded w-full'
          />
        </div>
        <div className='flex justify-start  gap-1 px-3 items-start'>
          <label htmlFor='feedback' className='font-semibold'>
            Feedback:
          </label>
          <textarea
            id='feedback'
            {...register('versions.0.feedback')}
            className='border-[1px] border-gray-500 bg-gray-50 p-1 rounded w-full'
          />
        </div>
      </div>
    </section>
  );
};

export default AddToolBoxTalk;

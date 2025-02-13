import React, { forwardRef, useImperativeHandle } from 'react';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
import Image from 'next/image';
import mongoose from 'mongoose';
import {
  IToolboxTalk,
  RecordStatusNames,
  SupervisorNames,
} from '@/lib/models/Safety/toolboxtalk.model';
import { useForm, useFieldArray } from 'react-hook-form';
import { debounce } from 'lodash';
import { IWorkOrderHr } from '@/lib/models/HR/workOrderHr.model';
import { IEnterpriseBase } from '@/interfaces/enterprise.interface';
import logo from '@/public/assets/dark-logo.png';

interface IMainToolBoxTalk {
  toolBoxTalkData: IToolboxTalk;
  updateMainToolBoxTalk: () => void;
  workOrderHr: (IWorkOrderHr & { _id: mongoose.Types.ObjectId })[];
  enterPriseInfo: IEnterpriseBase;
  canEditImportantDetails?: boolean;
  canEditAllDetails?: boolean;
}
const AddToolBoxTalk = forwardRef(
  (
    {
      toolBoxTalkData,
      updateMainToolBoxTalk = () => {
        console.error(
          'FRONTEND LOAD ERROR : running default update tool box talk main form function'
        );
        toast.error(
          'FRONTEND LOAD ERROR : running default update tool box talk main form function'
        );
      },
      workOrderHr,
      enterPriseInfo,
      canEditImportantDetails = true,
      canEditAllDetails = true,
    }: IMainToolBoxTalk,
    ref
  ) => {
    console.log('AddToolBoxTalk');

    const { control, formState, register, reset, watch, handleSubmit } =
      useForm<IToolboxTalk>({
        defaultValues: toolBoxTalkData,
      });

    const { fields, append, remove } = useFieldArray({
      control,
      name: 'versions.0.records',
    });

    const formData = watch(); // Get current form values
    // Expose the form state to the parent component
    useImperativeHandle(ref, () => ({
      getFeedbackData: () => {
        console.log('from imperative', formData);
        return formData;
      }, // Function to return the current form data
    }));

    const debouncedUpdate = debounce(() => {
      updateMainToolBoxTalk();
      cancelDebounce();
    }, 300); // 300ms delay
    const cancelDebounce = () => debouncedUpdate.cancel();

    const addNewRow = () => {
      append({
        item: '',
        actionBy: '',
        when: '',
        targetDate: new Date(),
        status: 'Issued',
      });
      // debouncedUpdate();
    };

    return (
      <section className='m-8 rounded'>
        {/* boundary */}
        {/* <div>{JSON.stringify(formData)}</div> */}
        <div>
          canEditImportantDetails:{JSON.stringify(canEditImportantDetails)}
          canEditAllDetails:{JSON.stringify(canEditAllDetails)}
        </div>

        <form className='border-2 border-black py-1 flex flex-col gap-2'>
          {/* log0 & all top */}
          <div className='grid grid-cols-3'>
            {/* two section */}
            <div className=' col-span-2'>
              <div className='flex'>
                <div className='flex w-1/2 p-2 justify-start gap-2 items-center'>
                  <Image src={logo} alt='logo' width={50} />
                  <h1>{enterPriseInfo.name}</h1>
                </div>
                <p className=' border-l-2 border-gray-700 w-1/2 flex justify-center items-center font-bold'>
                  Form & Formats <br />
                  Site Safety <br />
                  Tool Box Talk (Meeting)
                </p>
              </div>
              <div className=' flex flex-col'>
                <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
                  <label htmlFor='programName'>
                    Name of the program:(required)
                  </label>
                  <input
                    id='programName'
                    type='text'
                    {...register('programName', {
                      required: true,
                      onChange: debouncedUpdate,
                    })}
                    disabled={!canEditImportantDetails}
                    className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
                  />{' '}
                </div>
                <div className='w-full flex justify-start items-center gap-3 border-[1px] border-gray-800 flex-grow p-1'>
                  <label htmlFor='workOrder'>
                    Work Order Number:(required)
                  </label>
                  <select
                    id='workOrder'
                    {...register('versions.0.workOrderNo', {
                      required: true,
                      onChange: debouncedUpdate,
                    })}
                    disabled={!canEditAllDetails}
                    className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
                  >
                    <option value={null}>select work order</option>
                    {workOrderHr.map((wo) => (
                      <option key={wo._id.toString()} value={wo._id.toString()}>
                        {wo.workOrderNumber}
                      </option>
                    ))}
                  </select>
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
                    {...register('safetyRepresentative', {
                      onChange: debouncedUpdate,
                    })}
                    disabled={!canEditImportantDetails}
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
                    {...register('contractorRepresentative', {
                      onChange: debouncedUpdate,
                    })}
                    disabled={!canEditImportantDetails}
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
                <p>{toolBoxTalkData.versions[0].revNo}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
                <p>Effective Date:</p>
                <p>{toolBoxTalkData.effectiveDate.toLocaleDateString()}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
                <label htmlFor='documentNo'>Document No.(required):</label>
                <input
                  id='documentNo'
                  type='text'
                  disabled={!canEditImportantDetails}
                  {...register('documentNo', {
                    onChange: debouncedUpdate,
                  })}
                  className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
                />
              </div>
              <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
                <p>Date:</p>
                <p>{toolBoxTalkData.effectiveDate.toLocaleDateString()}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
                <p>Time:</p>
                <p>{toolBoxTalkData.effectiveDate.toLocaleTimeString()}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
                <p>Vendor Code:</p>
                <p>{toolBoxTalkData.vendorCode}</p>
              </div>
              <div className='w-full flex justify-start items-center gap-3  flex-grow px-1'>
                <p>Company Supervisor /Line Manager:</p>
                <select
                  // defaultValue={formData.versions[0].supervisor}
                  {...register('versions.0.supervisor', {
                    onChange: debouncedUpdate,
                  })}
                  disabled={!canEditAllDetails}
                  className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
                >
                  {/* <option value='#'>select supervisor type</option> */}
                  {SupervisorNames.map((sn) => (
                    <option value={sn} key={sn}>
                      {sn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className='flex justify-around items-center p-1 '>
            <span className='flex-col flex-grow flex justify-center items-start'>
              <label htmlFor='totalManPower'>Total Man Power:</label>
              <p className='border-b-[1px] border-gray-600'></p>
              <input
                id='totalManPower'
                type='text'
                {...register('versions.0.totalManPower', {
                  valueAsNumber: true,
                  onChange: debouncedUpdate,
                })}
                disabled={!canEditAllDetails}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />
            </span>
            <span className='flex-col flex-grow flex justify-center items-start'>
              <label htmlFor='totalWorkers'>Workers:</label>
              <p className='border-b-[1px] border-gray-600'></p>
              <input
                id='totalWorkers'
                type='number'
                {...register('versions.0.totalWorkers', {
                  valueAsNumber: true,
                  onChange: debouncedUpdate,
                })}
                disabled={!canEditAllDetails}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />
            </span>
            <span className='flex-col flex-grow flex justify-center items-start'>
              <label htmlFor='Supervisors'>Supervisors:</label>
              <p className='border-b-[1px] border-gray-600'></p>
              <input
                id='Supervisors'
                type='number'
                {...register('versions.0.totalSupervisors', {
                  valueAsNumber: true,
                  onChange: debouncedUpdate,
                })}
                disabled={!canEditAllDetails}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />
            </span>
            <span className='flex-col flex-grow flex justify-center items-start'>
              <label htmlFor='totalEngineers'>Engineers:</label>
              <p className='border-b-[1px] border-gray-600'></p>
              <input
                id='totalEngineers'
                type='number'
                {...register('versions.0.totalEngineers', {
                  valueAsNumber: true,
                  onChange: debouncedUpdate,
                })}
                disabled={!canEditAllDetails}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />
            </span>
            <span className='flex-col flex-grow flex justify-center items-start'>
              <label htmlFor='totalSafety'>Safety:</label>
              <p className='border-b-[1px] border-gray-600'></p>
              <input
                id='totalSafety'
                type='number'
                {...register('versions.0.totalSafety', {
                  valueAsNumber: true,
                  onChange: debouncedUpdate,
                })}
                disabled={!canEditAllDetails}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />
            </span>
          </div>

          <div className='my-3 flex flex-col gap-3 p-3'>
            <p className='font-semibold'>
              ITEMS DISCUSSED: (Indicate if not discussed)
            </p>

            <div className='flex flex-col gap-3'>
              {toolBoxTalkData?.versions[0].questions.map((qna, index) => (
                <div key={qna.question} className='flex flex-col gap-2'>
                  <label className='font-semibold' htmlFor={qna.question}>
                    {qna.question}
                  </label>
                  <textarea
                    id={qna.question}
                    {...register(`versions.0.questions.${index}.answer`, {
                      onChange: debouncedUpdate,
                    })}
                    disabled={!canEditAllDetails}
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
                          {...register(`versions.0.records.${index}.item`, {
                            onChange: debouncedUpdate,
                          })}
                          disabled={!canEditAllDetails}
                          className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
                        />
                      </td>
                      <td className='border-[1px] border-gray-500 py-1 px-2'>
                        <input
                          type='text'
                          {...register(`versions.0.records.${index}.actionBy`, {
                            onChange: debouncedUpdate,
                          })}
                          disabled={!canEditAllDetails}
                          className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
                        />
                      </td>
                      <td className='border-[1px] border-gray-500 py-1 px-2'>
                        <input
                          type='text'
                          {...register(`versions.0.records.${index}.when`, {
                            onChange: debouncedUpdate,
                          })}
                          disabled={!canEditAllDetails}
                          className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
                        />
                      </td>
                      <td className='border-[1px] border-gray-500 py-1 px-2'>
                        <input
                          type='date'
                          value={
                            formData.versions[0].records[index].targetDate
                              ? new Date(
                                  formData.versions[0].records[index].targetDate
                                )
                                  .toISOString()
                                  .split('T')[0]
                              : ''
                          }
                          {...register(
                            `versions.0.records.${index}.targetDate`,
                            {
                              onChange: debouncedUpdate,
                            }
                          )}
                          disabled={!canEditAllDetails}
                          className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded w-full'
                        />
                      </td>
                      <td className='border-[1px] border-gray-500 py-1 px-2'>
                        <select
                          {...register(`versions.0.records.${index}.status`, {
                            onChange: debouncedUpdate,
                          })}
                          disabled={!canEditAllDetails}
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
                          disabled={!canEditAllDetails}
                          type='button'
                          onClick={() => {
                            remove(index);
                            debouncedUpdate();
                          }}
                          className='text-red-500 hover:text-red-700 disabled:text-red-300'
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
                  disabled={!canEditAllDetails}
                  type='button'
                  onClick={addNewRow}
                  className='bg-blue-500 text-white px-4 py-2 rounded mt-2 disabled:bg-blue-300'
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
              {...register('versions.0.suggestion', {
                onChange: debouncedUpdate,
              })}
              disabled={!canEditAllDetails}
              className='border-[1px] border-gray-500 bg-gray-50 p-1 rounded w-full'
            />
          </div>
          {/* <button type='submit'> submit</button> */}
        </form>
      </section>
    );
  }
);

AddToolBoxTalk.displayName = 'AddToolBoxTalk';
export default AddToolBoxTalk;

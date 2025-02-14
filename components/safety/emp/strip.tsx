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
  (
    {
      stripPoints,
      updateStripsPoints,
      canEditAllDetails,
      canEditImportantDetails,
    }: IStripsUploads,
    ref
  ) => {
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
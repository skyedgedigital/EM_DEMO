import { IEmployeeData } from '@/interfaces/HR/EmployeeData.interface';
import EmployeeDataAction from '@/lib/actions/HR/EmployeeData/employeeDataAction';
import { Loader2Icon, Plus, RefreshCcw } from 'lucide-react';
import mongoose from 'mongoose';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { MdClose, MdDeleteForever } from 'react-icons/md';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { trainingActions } from '@/lib/actions/safety/training/trainingActions';
import { CreateTrainingExamParams } from '@/lib/actions/safety/training/create';
import { ExamTypeNames, ExamTypes } from '@/lib/models/Safety/training.model';
import WorkOrderHrAction from '@/lib/actions/HR/workOrderHr/workOrderAction';
import { IWorkOrderHr } from '@/lib/models/HR/workOrderHr.model';
import { IEmployeesBySelectedHRWorkOrderIDResponse } from '@/lib/actions/HR/EmployeeData/fetch';

// Define the Zod schema for the form
const trainingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  targetDate: z.date(),
  responsibility: z.string().optional(),
  allowedCandidates: z.array(z.instanceof(mongoose.Types.ObjectId)),
  // .nonempty('Select at-least one participant'),
  questions: z.array(
    z.object({
      text: z.string().min(1, 'Question text is required'),
      options: z
        .array(
          z.object({
            text: z.string().min(1, 'Option text is required'),
          })
        )
        .nonempty('At-least one option is necessary'),
      correctAnswer: z.number(),
      // .nonempty('At-least one option should be correct'),
    })
  ),
  trainer: z.instanceof(mongoose.Types.ObjectId),
  examType: z.enum(ExamTypeNames).default('pre-training-exam'),
  trainingId: z.instanceof(mongoose.Types.ObjectId).nullable().default(null),
});

type TrainingFormData = z.infer<typeof trainingSchema>;

interface IEmployee extends Pick<IEmployeeData, 'code' | 'name'> {
  _id: mongoose.Types.ObjectId;
}

interface ICreateTraining {
  presetTrainingId: string;
  presetExamType: ExamTypes;
}
const CreateTraining = ({
  presetExamType,
  presetTrainingId,
}: ICreateTraining) => {
  const presetAlreadyProvided = !!(presetExamType && presetTrainingId);
  const session = useSession();
  const [employees, setAllEmployees] = React.useState<
    IEmployeesBySelectedHRWorkOrderIDResponse[]
  >([]);
  const [
    selectedWorkOrderFilterForEmployees,
    setSelectedWorkOrderFilterForEmployees,
  ] = useState<string>(null);
  const [hrWorkOrders, setHrWorkOrders] =
    useState<(IWorkOrderHr & { _id: string })[]>(null);

  const [loadingStates, setLoadingStates] = useState<{
    loadingEmployees: boolean;
    creatingTraining: boolean;
    loadingPreTrainingExamQuestion: boolean;
  }>({
    loadingEmployees: true,
    creatingTraining: false,
    loadingPreTrainingExamQuestion: false,
  });
  // Use the Zod schema with react-hook-form
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema), // Integrate Zod resolver
    defaultValues: {
      allowedCandidates: [],
      questions: [],
      trainer: new mongoose.Types.ObjectId(), // Initialize with a valid ObjectId
      targetDate: new Date(), // Initialize with current date
      responsibility: '',
      examType: presetAlreadyProvided ? presetExamType : 'pre-training-exam',
      trainingId: null,
    },
  });

  const formData = watch();

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });
  useEffect(() => {
    if (session && session?.data?.user._id) {
      setValue(
        'trainer',
        new mongoose.Types.ObjectId(session?.data?.user?._id)
      );
    }
  }, [session]);

  useEffect(() => {
    if (presetAlreadyProvided) {
      setValue('trainingId', new mongoose.Types.ObjectId(presetTrainingId));
    }
  }, [presetAlreadyProvided, presetTrainingId]);

  const fetchEmployee = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, loadingEmployees: true }));
      const { data, message, success } =
        await EmployeeDataAction.FETCH.fetchEmployeesBySelectedHRWorkOrderID(
          selectedWorkOrderFilterForEmployees,
          ['name', 'code']
        );

      if (success) {
        const empData = data;
        setAllEmployees(empData);
      } else {
        toast.error(message || 'Failed to load employees, Please try later');
      }
    } catch (error) {
      toast.error('An error occurred while fetching employees');
    } finally {
      setLoadingStates((prev) => ({ ...prev, loadingEmployees: false }));
    }
  };

  useEffect(() => {
    if (presetAlreadyProvided) return;
    fetchEmployee();
  }, [presetAlreadyProvided, selectedWorkOrderFilterForEmployees]);

  useEffect(() => {
    const fetchHrWorkOrders = async () => {
      try {
        const { data, error, message, status, success } =
          await WorkOrderHrAction.FETCH.fetchAllValidWorkOrderHr([
            'workOrderNumber',
          ]);
        if (success) {
          const parsedData = await JSON.parse(data);
          // console.log("fetched workorder hr", parsedData.length, parsedData);
          setHrWorkOrders(parsedData);
        }
        if (!success) {
          toast.error('Failed to load HR WorkOrders to filter employee', {
            duration: 5000,
          });
        }
      } catch (error) {
        console.log('Fetching Work order Failed', error);
      }
    };
    fetchHrWorkOrders();
  }, []);

  const fetchPreTrainingExamQuestion = async () => {
    try {
      setLoadingStates((prev) => ({
        ...prev,
        loadingPreTrainingExamQuestion: true,
      }));
      const { data, message, status, success, error } =
        await trainingActions.FETCH.fetchExamQuestionsByExamId(
          presetTrainingId,
          'pre-training-exam'
        );
      if (success) {
        // setPreTrainingQuestions(data);
        console.log('data', data);
        setValue('questions', data.questions as any);

        toast.success(message);
      }
      if (!success) {
        toast.error(message);
      }
    } catch (error) {
      toast.error(
        error.message ||
          'Unexpected error occurred, Failed to Load pre-training exam question, You can still continue by adding question on your own'
      );
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        loadingPreTrainingExamQuestion: false,
      }));
    }
  };
  const handleCheckboxChange = (_id: string) => {
    const allowedCandidates = watch('allowedCandidates');
    const receivedId = new mongoose.Types.ObjectId(_id); // Convert _id to ObjectId

    const updatedCandidates = allowedCandidates.some((id) =>
      id.equals(receivedId)
    )
      ? allowedCandidates.filter((id) => !id.equals(receivedId)) // Remove if already exists
      : [...allowedCandidates, receivedId]; // Add if not exists

    setValue('allowedCandidates', updatedCandidates);
  };

  const onSubmit = async (submittedFormData: TrainingFormData) => {
    try {
      setLoadingStates((prev) => ({ ...prev, creatingTraining: true }));

      console.log('Submitted Data', submittedFormData);
      const { data, error, message, status, success } =
        await trainingActions.CREATE.createTrainingExamWithQuestions(
          (await JSON.parse(
            JSON.stringify(submittedFormData)
          )) as CreateTrainingExamParams
        );
      if (success) {
        console.log('response data', data);
        toast.success(message);
      }
      if (!success) {
        toast.error(message || 'Failed to create training exam try later');
        console.log(error);
      }
    } catch (error) {
      console.log('errrrrrrrr', error);
      toast.error(
        error.message || 'Unexpected error occurred, Please try later'
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, creatingTraining: false }));
    }
  };

  return (
    <section>
      {/* <div>{JSON.stringify(formData)}</div> */}
      <h2 className='text-lg text-blue-500 font-semibold'>
        Fill details to create training
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
        <div className='flex flex-col md:flex-row gap-2 items-center'>
          <div className='flex flex-col gap-1 flex-grow p-1'>
            <label htmlFor='examType'>Exam Type:</label>
            <select
              disabled={presetAlreadyProvided}
              {...register('examType', { required: true })}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            >
              {ExamTypeNames.map((exTy) => (
                <option key={exTy}>{exTy}</option>
              ))}
            </select>
            {errors.title && (
              <p className='text-red-500 text-sm'>{errors.title.message}</p>
            )}
          </div>
          <div className='flex flex-col gap-1 flex-grow p-1'>
            <label htmlFor='title'>Title:</label>
            <input
              id='title'
              type='text'
              {...register('title', { required: true })}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />
            {errors.title && (
              <p className='text-red-500 text-sm'>{errors.title.message}</p>
            )}
          </div>
          <div className='flex flex-col gap-1 flex-grow p-1'>
            <label htmlFor='targetDate'>Date:</label>
            <input
              id='targetDate'
              type='date'
              {...register('targetDate', { valueAsDate: true, required: true })}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />
            {errors.targetDate && (
              <p className='text-red-500 text-sm'>
                {errors.targetDate.message}
              </p>
            )}
          </div>
          <div className='w-1/2 flex flex-col gap-1 flex-grow p-1'>
            <label htmlFor='responsibility'>Responsibility:</label>
            <textarea
              id='responsibility'
              {...register('responsibility')}
              className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
            />
          </div>
        </div>

        <div className='flex flex-col gap-1 border-[1px] border-gray-200 p-2 rounded'>
          <div className='w-full justify-between items-center'>
            <h2 className='font-semibold'>Create Questions:</h2>
            {presetAlreadyProvided && (
              <button
                type='button'
                onClick={fetchPreTrainingExamQuestion}
                className=' bg-blue-500 text-white p-1 rounded flex justify-center items-center gap-1 px-3 py-1 border-[1px] border-blue-400 ml-0 md:ml-auto'
              >
                <>Use Pre-Training Exam Questions</>
                {loadingStates.loadingPreTrainingExamQuestion && (
                  <Loader2Icon className='animate-spin' />
                )}
              </button>
            )}
          </div>
          {questionFields.map((question, questionIndex) => (
            <div key={question.id}>
              <Question
                control={control}
                questionIndex={questionIndex}
                question={question}
                register={register}
                setValue={setValue}
                watch={watch}
                removeQuestion={removeQuestion}
                errors={errors.questions?.[questionIndex]} // Pass errors for each question
              />
            </div>
          ))}
          <button
            type='button'
            onClick={() =>
              appendQuestion({
                text: '',
                options: [{ text: '' }],
                correctAnswer: -1,
              })
            }
            className=' bg-blue-500 text-white p-1 rounded flex justify-center items-center gap-1 px-3 py-1  ml-0 md:ml-auto'
          >
            <Plus />
            <>Add Question</>
          </button>
        </div>
        {!presetAlreadyProvided ? (
          <div className='flex flex-col gap-3 border-[1px] border-gray-200 rounded p-2'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <h2 className='font-semibold'>Select Participants:</h2>
              <div className='flex flex-col md:flex-row gap-1 items-end'>
                <div className='flex flex-col gap-1 p-1 '>
                  <label htmlFor='woHr'>
                    Select Work Order to Filter Employee:
                  </label>
                  <select
                    id='woHr'
                    className='border-[1px] flex-grow border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
                    onChange={(e) =>
                      setSelectedWorkOrderFilterForEmployees(
                        e.currentTarget.value
                      )
                    }
                  >
                    {' '}
                    <option value={''}>All Employees</option>
                    {hrWorkOrders?.map((wo) => (
                      <option value={wo?._id} key={wo?._id}>
                        {wo.workOrderNumber}
                      </option>
                    ))}
                  </select>
                  {errors.title && (
                    <p className='text-red-500 text-sm'>
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={fetchEmployee}
                  type='button'
                  className='flex justify-center items-center gap-2 px-2 py-2 border-[1px] border-blue-400 rounded bg-white text-blue-500 text-nowrap text-sm font-semibold mb-1'
                >
                  <RefreshCcw
                    className={`${
                      loadingStates.loadingEmployees && `animate-spin`
                    } w-[16px] h-[16px] `}
                  />
                  <>Reload Employees</>
                </button>
              </div>
            </div>
            {employees.length === 0 ? (
              <div className='w-full h-full flex justify-center items-center'>
                <p>No employees found</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 max-h-screen overflow-auto'>
                {employees.map((employee) => (
                  <label
                    key={employee._id.toString()}
                    htmlFor={`employee-${employee._id}`}
                    className='flex items-center gap-2 border-[.5px] p-1 px-2 border-gray-200 lowercase hover:bg-gray-100 text-gray-700'
                  >
                    <input
                      type='checkbox'
                      id={`employee-${employee._id}`}
                      checked={formData.allowedCandidates.some((id) =>
                        id.equals(new mongoose.Types.ObjectId(employee._id))
                      )}
                      onChange={() =>
                        handleCheckboxChange(employee._id.toString())
                      }
                    />
                    {employee.name} ({employee.code})
                  </label>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col gap-3 border-[1px] border-gray-200 rounded p-2'>
            <h2 className='font-semibold'>Select Participants:</h2>
            <p className='text-gray-500'>
              All allowed candidate for pre-training-exam will be allowed for
              post-training-exam
            </p>
          </div>
        )}

        <button
          disabled={loadingStates.creatingTraining}
          type='submit'
          className='bg-green-700 disabled:bg-green-500 flex justify-center items-center gap-2 text-white p-2 rounded w-fit px-2 py-1 mx-auto my-4'
        >
          <>Create Training</>
          {loadingStates.creatingTraining && (
            <Loader2Icon className='animate-spin' />
          )}
        </button>
      </form>
    </section>
  );
};

export default CreateTraining;

const Question = ({
  control,
  questionIndex,
  question,
  register,
  setValue,
  watch,
  removeQuestion,
  errors,
}) => {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  // Handle checkbox change for correct answers
  const handleCorrectAnswerChange = (optionIndex: number) => {
    // const currentCorrectAnswers =
    //   watch(`questions.${questionIndex}.correctAnswers`) || [];
    // let updatedCorrectAnswers;

    // if (currentCorrectAnswers.includes(optionIndex)) {
    //   updatedCorrectAnswers = currentCorrectAnswers.filter(
    //     (idx) => idx !== optionIndex
    //   );
    // } else {
    //   updatedCorrectAnswers = [...currentCorrectAnswers, optionIndex];
    // }

    setValue(`questions.${questionIndex}.correctAnswer`, optionIndex);
  };

  return (
    <div
      key={question.id}
      className='border-b-[1px] border-gray-200 p-2 mb-2 flex flex-col gap-3'
    >
      <div className='flex flex-col gap-1'>
        <div className='flex justify-between items-end'>
          <label htmlFor={`question-${questionIndex}-text`}>
            Question {questionIndex + 1}:
          </label>
          <button
            type='button'
            onClick={() => removeQuestion(questionIndex)}
            className='text-red-500 flex justify-center items-center gap-1 border-[1px] border-red-300 p-1 rounded mt-2'
          >
            <MdDeleteForever className='w-[20px] h-[20px]' />
          </button>
        </div>
        <textarea
          id={`question-${questionIndex}-text`}
          {...register(`questions.${questionIndex}.text`)}
          className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
        />
        {errors?.text && (
          <p className='text-red-500 text-sm'>{errors.text.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <label>Options (Tick correct options):</label>
        <div className='md:grid md:grid-cols-4 lg:grid-cols-5 gap-2'>
          {optionFields.map((option, optionIndex) => (
            <div key={option.id} className='flex gap-2 items-center'>
              <input
                type='radio'
                name={`question-${questionIndex}-text`}
                checked={
                  watch(`questions.${questionIndex}.correctAnswer`) ===
                  optionIndex
                }
                onChange={() => handleCorrectAnswerChange(optionIndex)}
              />
              <input
                type='text'
                {...register(
                  `questions.${questionIndex}.options.${optionIndex}.text`
                )}
                className='border-[1px] border-gray-400 text-gray-600 bg-gray-50 p-1 rounded'
              />
              {errors?.options?.[optionIndex]?.text && (
                <p className='text-red-500 text-sm'>
                  {errors.options[optionIndex].text.message}
                </p>
              )}
              <button
                type='button'
                onClick={() => removeOption(optionIndex)}
                className='text-red-500 border-[1px] border-red-300 p-1 rounded'
              >
                <MdClose />
              </button>
            </div>
          ))}

          <button
            type='button'
            onClick={() => appendOption({ text: '' })}
            className='text-blue-500 border-[1px] border-blue-300 p-1 rounded '
          >
            Add Option
          </button>
        </div>
      </div>
    </div>
  );
};

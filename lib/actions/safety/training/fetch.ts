'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import {
  TrainingExamModel,
  ExamTypes,
  ITrainingExam,
  ITraining,
  TrainingModel,
} from '@/lib/models/Safety/training.model';
import mongoose, { mongo } from 'mongoose';

export const fetchExamByTrainingIdAndExamType = async (
  trainingId: mongoose.Schema.Types.ObjectId,
  examType: ExamTypes
): Promise<ApiResponse<ITrainingExam>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!trainingId || !examType) {
      throw new Error('Invalid input: examId are required');
    }

    const exam = await TrainingExamModel.findOne({ trainingId, examType });
    console.log('Exam', exam);

    if (!exam) {
      throw new Error('Exam not found');
    }

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Exam fetched successfully!',
        data: exam,
        error: null,
      })
    );
  } catch (error) {
    console.log('Error', error.message);
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};

export interface IRequiredDetailsForATrainingExam
  extends Partial<ITraining & ITrainingExam> {
  examId: mongoose.Types.ObjectId;
}
export const fetchRequiredDetailsForATrainingExam = async (
  trainingId: mongoose.Schema.Types.ObjectId,
  examType: ExamTypes
): Promise<ApiResponse<IRequiredDetailsForATrainingExam>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!trainingId || !examType) {
      throw new Error('Invalid input: examId are required');
    }

    const training = await TrainingModel.findById(trainingId).select('title');
    console.log('Found Training', training);
    if (!training) {
      throw new Error(`No training with ID ${trainingId} found`);
    }
    const exam = await TrainingExamModel.findOne({
      trainingId,
      examType,
    })
      .populate('questions')
      .exec();
    console.log('Found Exam', exam);
    if (!exam) {
      throw new Error('exam not found');
    }

    const combinedData: IRequiredDetailsForATrainingExam = {
      title: training.title,
      examType: exam.examType,
      questions: exam.questions,
      targetDate: exam.targetDate,
      responsibility: exam.responsibility,
      examId: exam._id,
    };
    console.log('Combined data', combinedData);
    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Exam fetched successfully!',
        data: combinedData,
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};

export const fetchTrainingDetailById = async (trainingId: string) => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!trainingId) {
      throw new Error('Invalid input: trainingId is required');
    }

    const training = await TrainingModel.findOne({ _id: trainingId });

    if (!training) {
      throw new Error(`No training found with id: ${trainingId}`);
    }
    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Training fetched successfully!',
        data: training,
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};

// export const fetchSelectedInfosOfExamByExamId = async (
//   examId: string,
//   selectedField: (keyof ITrainingExam)[] | string[] = []
// ): Promise<ApiResponse<ITrainingExam>> => {
//   try {
//     // console.log('HELLO');
//     const dbConnection = await handleDBConnection();
//     if (!dbConnection.success) return dbConnection;
//     console.log('ExamId', examId);
//     if (!examId) {
//       throw new Error('Invalid input: examId are required');
//     }

//     const exam = await TrainingExamModel.findById(examId).select(
//       selectedField.join(' ')
//     );
//     // console.log('Exam', exam);

//     if (!exam) {
//       throw new Error('Exam not found or update failed');
//     }

//     return JSON.parse(
//       JSON.stringify({
//         success: true,
//         status: 200,
//         message: 'Exam fetched successfully!',
//         data: exam,
//         error: null,
//       })
//     );
//   } catch (error) {
//     console.log('Error', error.message);
//     return JSON.parse(
//       JSON.stringify({
//         success: false,
//         status: 400,
//         message: error.message || 'Something went wrong!',
//         data: null,
//         error: error,
//       })
//     );
//   }
// };

export const fetchAllTrainingDetails = async (): Promise<
  ApiResponse<ITraining[]>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const trainings = await TrainingModel.find({});
    if (!trainings) {
      throw new Error('no trainings exist');
    }
    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Training fetched successfully!',
        data: trainings,
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};

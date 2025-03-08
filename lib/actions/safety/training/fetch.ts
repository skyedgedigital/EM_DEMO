'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import {
  ITrainingExam,
  TrainingExamModel,
} from '@/lib/models/Safety/training.model';

export const fetchExamByExamId = async (
  examId: string
): Promise<ApiResponse<ITrainingExam>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    console.log('ExamId', examId);
    if (!examId) {
      throw new Error('Invalid input: examId are required');
    }

    const exam = await TrainingExamModel.findById(examId).select(
      'questions title targetDate responsibility'
    );
    console.log('Exam', exam);

    if (!exam) {
      throw new Error('Exam not found or update failed');
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
export const fetchSelectedInfosOfExamByExamId = async (
  examId: string,
  selectedField: (keyof ITrainingExam)[] | string[] = []
): Promise<ApiResponse<ITrainingExam>> => {
  try {
    // console.log('HELLO');
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    console.log('ExamId', examId);
    if (!examId) {
      throw new Error('Invalid input: examId are required');
    }

    const exam = await TrainingExamModel.findById(examId).select(
      selectedField.join(' ')
    );
    // console.log('Exam', exam);

    if (!exam) {
      throw new Error('Exam not found or update failed');
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

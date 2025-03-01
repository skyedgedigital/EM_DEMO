'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import {
  TrainingExamModel,
  ITrainingExam,
} from '@/lib/models/Safety/training.model';

export const createTrainingExamWithQuestions = async (
  params: ITrainingExam
): Promise<ApiResponse<ITrainingExam>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    console.log('PARAMS', params);
    const { title, questions, allowedCandidates, trainer, targetDate } = params;

    if (!title || !trainer || !targetDate) {
      throw new Error(
        'Insufficient values: Title, trainer and targetDate are required'
      );
    }
    const existingExam = await TrainingExamModel.findOne({ title });
    console.log('EXsT EXM', existingExam);
    if (existingExam) {
      throw new Error('An exam with this title already exists');
    }

    const exam = await TrainingExamModel.create({
      title,
      allowedCandidates,
      questions,
      trainer,
      targetDate,
      responsibility: params?.responsibility || '',
    });

    if (!exam) {
      throw new Error("Couldn't create exam");
    }

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 201,
        message: 'New training exam created successfully',
        data: exam,
        error: null,
      })
    );
  } catch (error) {
    console.log('ERRORRR', error);
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message:
          error.message ||
          'Unexpected error occurred!, Failed to create training, Please try later',
        data: null,
        error: error,
      })
    );
  }
};

export const updateExam = async (
  examId: string,
  updates: Partial<ITrainingExam>
): Promise<ApiResponse<ITrainingExam>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!examId || Object.keys(updates).length === 0) {
      throw new Error('Invalid input: examId and updates are required');
    }

    const updatedExam = await TrainingExamModel.findByIdAndUpdate(
      examId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedExam) {
      throw new Error('Exam not found or update failed');
    }

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Exam updated successfully!',
        data: updatedExam,
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

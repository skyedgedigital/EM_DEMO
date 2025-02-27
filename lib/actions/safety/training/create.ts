'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import { ExamModel, IExam } from '@/lib/models/Safety/training.model';

export const createExamWithQuestions = async (
  params: IExam
): Promise<ApiResponse<IExam>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const { title, questions, allowedCandidates, trainer } = params;

    if (!title || !trainer) {
      throw new Error('Insufficient values: Title and trainer are required');
    }

    const existingExam = await ExamModel.findOne({ title });

    if (!existingExam) {
      throw new Error('An exam with this title already exists');
    }

    const exam = await ExamModel.create({
      title,
      allowedCandidates,
      questions,
      trainer,
    });

    if (!exam) {
      throw new Error("Couldn't create exam");
    }

    return {
      success: true,
      status: 201,
      message: 'Exam successfully created!',
      data: exam,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      status: 400,
      message: error.message || 'Something went wrong!',
      data: null,
      error: error,
    };
  }
};

export const updateExam = async (
  examId: string,
  updates: Partial<IExam>
): Promise<ApiResponse<IExam>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!examId || Object.keys(updates).length === 0) {
      throw new Error('Invalid input: examId and updates are required');
    }

    const updatedExam = await ExamModel.findByIdAndUpdate(examId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedExam) {
      throw new Error('Exam not found or update failed');
    }

    return {
      success: true,
      status: 200,
      message: 'Exam updated successfully!',
      data: updatedExam,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      status: 400,
      message: error.message || 'Something went wrong!',
      data: null,
      error: error,
    };
  }
};

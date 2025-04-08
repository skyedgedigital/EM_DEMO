'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import {
  ITrainingExam,
  ITraining,
  TrainingModel,
  TrainingExamModel,
  IQuestion,
  ITrainingExamAttempt,
  TrainingExamAttemptModel,
  ExamTypes,
} from '@/lib/models/Safety/training.model';
import mongoose from 'mongoose';

export const createTraining = async (
  trainingData: Partial<ITraining>
): Promise<ApiResponse<any>> => {
  try {
    if (!trainingData.title || !trainingData.trainingDate) {
      throw new Error('Title and training date is must to create training');
    }
    if (!trainingData.trainer) {
      throw new Error('Trainer id did not received, Try refreshing browser');
    }

    const existingTrainingOnGivenDate = await TrainingModel.findOne({
      trainingDate: trainingData.trainingDate,
    });
    // console.log('EXISTING TRAINING', existingTrainingOnGivenDate);

    if (existingTrainingOnGivenDate) {
      throw new Error(`A training already exist on selected date`);
    }
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const createdTraining = await TrainingModel.create(trainingData);

    if (!createTraining) {
      throw new Error('Failed to create training');
    }

    return await JSON.parse(
      JSON.stringify({
        success: true,
        status: 201,
        message: 'Training successfully created',
        data: createdTraining,
        error: null,
      })
    );
  } catch (error) {
    return {
      status: 500,
      success: false,
      message:
        error?.message ||
        JSON.stringify(error) ||
        'Unexpected error occurred, Failed to create training, Please try later',
      error: JSON.stringify(error),
      data: null,
    };
  }
};

export interface CreateTrainingExamParams extends ITraining {
  questions: IQuestion[];
  targetDate: Date;
  responsibility?: string;
  examType: ExamTypes;
}

export const createTrainingExamWithQuestions = async (
  params: CreateTrainingExamParams
): Promise<ApiResponse<ITrainingExam>> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const {
      title,
      questions,
      allowedCandidates,
      trainer,
      targetDate,
      examType,
    } = params;

    if (!title || !trainer || !targetDate || !examType) {
      throw new Error(
        'Insufficient values: Title, trainer, examType, and targetDate are required'
      );
    }

    const existingTraining = await TrainingModel.findOne(
      { title, trainer },
      null,
      {
        session,
      }
    );

    // without a training, an exam can't be created
    if (!existingTraining) {
      throw new Error('Training does not exist');
    }

    const existingExam = await TrainingExamModel.find(
      {
        trainingId: existingTraining._id,
        examType,
      },
      null,
      { session }
    );

    console.log(existingExam);

    if (existingExam.length >= 1) {
      throw new Error(`${examType.split('-').join(' ')} already exist`);
    }

    if (examType === 'pre-training-exam') {
      const updated_training = await TrainingModel.findOneAndUpdate(
        { title, trainer },
        { allowedCandidates },
        { new: true }
      ).session(session);
    }

    const new_exam = await TrainingExamModel.create(
      [
        {
          examType,
          questions,
          responsibility: params?.responsibility || '',
          targetDate,
          trainingId: existingTraining._id,
        },
      ],
      { session }
    );
    if (new_exam) {
      await session.commitTransaction();
      return JSON.parse(
        JSON.stringify({
          data: new_exam[0],
          error: null,
          message: `${examType.split('-').join(' ')} successfully created!`,
          status: 201,
          success: true,
        })
      );
    } else {
      throw new Error('Something went wrong');
    }
  } catch (error) {
    await session.abortTransaction();
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

export const createExamAttempt = async (
  params: Partial<ITrainingExamAttempt>
): Promise<ApiResponse<ITrainingExamAttempt>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const { candidate, exam, responses } = params;

    if (!candidate || !exam || !responses) {
      throw new Error('Please provide candidate and exam');
    }

    const examExist = await TrainingExamModel.findOne({ _id: exam });

    if (!examExist) {
      throw new Error('Exam does not exist');
    }

    const attemptExist = await TrainingExamAttemptModel.findOne({
      candidate,
      exam,
    });

    if (attemptExist) {
      throw new Error('Exam already attempted');
    }

    const { questions } = examExist;

    if (questions.length !== responses.length) {
      throw new Error('Please answer all questions');
    }

    // there should be as many answers as questions
    for (let i = 0; i < responses.length; i++) {
      if (responses[i].selectedAnswer === null) {
        throw new Error('Answering all questions is necessary');
      }
    }

    let total_score = 0;

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].correctAnswer === responses[i].selectedAnswer) {
        total_score++;
      }
    }

    const attempt = await TrainingExamAttemptModel.create({
      candidate,
      exam,
      responses,
      score: total_score,
    });

    if (!attempt) {
      throw new Error("Couldn't save progress, Try Again");
    }

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Answers successfully submitted',
        data: attempt,
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

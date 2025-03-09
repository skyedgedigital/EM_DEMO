'use server';

import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import {
  IExam,
  ITraining,
  TrainingModel,
  ExamModel,
  IQuestion,
  IAttempt,
  AttemptModel,
  ExamTypes,
} from '@/lib/models/Safety/training.model';
import mongoose from 'mongoose';

export interface CreateTrainingExamParams extends ITraining {
  questions: IQuestion[];
  targetDate: Date;
  responsibility?: string;
  examType: ExamTypes;
}

export const createTrainingExamWithQuestions = async (
  params: CreateTrainingExamParams
): Promise<ApiResponse<IExam>> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    console.log('PARAMS', params);
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

    const existingTraining = await TrainingModel.findOne({ title }, null, {
      session,
    });

    if (existingTraining) {
      // if pre and post exams exist then no other exams should be created
      const existingExams = await ExamModel.find(
        {
          trainingId: existingTraining._id,
        },
        null,
        { session }
      );
      if (existingExams.length >= 2) {
        throw new Error(
          'Cannot create exams, pre and post exams already exist'
        );
      }
      // if training exist then, pre exam must have been create before
      if (examType === 'pre-training-exam') {
        throw new Error('Cannot create a pre exam, it already exist');
      }

      const new_exam = await ExamModel.create(
        {
          examType,
          questions,
          responsibility: params?.responsibility || '',
          targetDate,
          trainingId: existingTraining._id,
        },
        { session }
      );
      if (new_exam) {
        await session.commitTransaction();
        return JSON.parse(
          JSON.stringify({
            data: new_exam[0],
            error: null,
            message: 'POST exam successfully created',
            status: 201,
            success: true,
          })
        );
      } else {
        throw new Error('Something went wrong');
      }
    }

    // if training does not exist then user must create a pre exam first
    if (examType !== 'pre-training-exam') {
      throw new Error(`Cannot create a ${examType}, first create a PRE exam`);
    }

    const new_training = await TrainingModel.create(
      {
        title,
        trainer,
        allowedCandidates,
      },
      { session }
    );

    if (!new_training || new_training.length != 1) {
      throw new Error('Could not create training, something went wrong');
    }

    const new_exam = await ExamModel.create(
      {
        examType,
        questions,
        targetDate,
        responsibility: params.responsibility,
        trainingId: new_training[0]._id,
      },
      { session }
    );

    if (!new_exam || new_exam.length != 1) {
      throw new Error("Couldn't create PRE exam, something went wrong");
    }

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 201,
        message: 'PRE exam successfully created',
        data: new_exam[0],
        error: null,
      })
    );
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

export const updateExam = async (
  trainer: mongoose.Schema.Types.ObjectId,
  trainingId: mongoose.Schema.Types.ObjectId,
  examId: mongoose.Schema.Types.ObjectId,
  updates: Partial<IExam>
): Promise<ApiResponse<IExam>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!examId || !trainingId || Object.keys(updates).length === 0) {
      throw new Error('Invalid input: examId and updates are required');
    }

    // only the trainer can edit the training
    const trainingExist = await TrainingModel.findOne({
      _id: trainingId,
      trainer,
    });

    if (!trainingExist) {
      throw new Error('Training does not exist');
    }

    const updatedExam = await ExamModel.findByIdAndUpdate(examId, updates, {
      new: true,
      runValidators: true,
    });

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

export const updateTraining = async (params: {
  trainingId: mongoose.Schema.Types.ObjectId;
  trainer: mongoose.Schema.Types.ObjectId;
  updates: Partial<ITraining>;
}): Promise<ApiResponse<ITraining>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const { trainingId, trainer, updates } = params;

    if (!trainingId || !trainer) {
      throw new Error('Please provide valid trainingId and trainer');
    }

    const updated_training = await TrainingModel.findOneAndUpdate(
      {
        _id: trainingId,
        trainer,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated_training) {
      throw new Error("Couldn't update training, something went wrong");
    }

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Training Successfully updated',
        data: updated_training,
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

export const createExamAttempt = async (
  params: Partial<IAttempt>
): Promise<ApiResponse<IAttempt>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    const { candidate, exam, responses } = params;

    if (!candidate || !exam || responses) {
      throw new Error('Please provide candidate and exam');
    }

    const examExist = await ExamModel.findOne({ _id: exam });

    if (!examExist) {
      throw new Error('Exam does not exist');
    }

    const { questions } = examExist;

    // there should be as many answers as questions
    if (questions.length !== responses.length) {
      throw new Error('Answer all questions');
    }

    let total_score = 0;

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].correctAnswer === responses[i].selectedAnswer) {
        total_score++;
      }
    }

    const attempt = await AttemptModel.create({
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

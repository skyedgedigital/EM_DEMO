import { ApiResponse } from "@/interfaces/APIresponses.interface";
import handleDBConnection from "@/lib/database";
import { ITraining, ITrainingExam, TrainingExamModel, TrainingModel } from "@/lib/models/Safety/training.model";
import mongoose from "mongoose";

export const updateExam = async (
  trainer: mongoose.Types.ObjectId,
  trainingId: mongoose.Types.ObjectId,
  examId: mongoose.Types.ObjectId,
  updates: Partial<ITrainingExam>
): Promise<ApiResponse<ITrainingExam>> => {
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

export const updateTraining = async (params: {
  trainingId: mongoose.Types.ObjectId;
  trainer: mongoose.Types.ObjectId;
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

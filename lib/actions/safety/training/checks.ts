'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import EmployeeData from '@/lib/models/HR/EmployeeData.model';
import mongoose from 'mongoose';
import {
  fetchExamByTrainingIdAndExamType,
  fetchTrainingDetailById,
} from './fetch';
import {
  ExamTypes,
  TrainingExamAttemptModel,
} from '@/lib/models/Safety/training.model';

export interface IEmployeeTrainingExamEligibility {
  _id: mongoose.Types.ObjectId;
  eligible: boolean;
}
export const checkEmployeeTrainingExamEligibility = async (
  employeeCode: string,
  trainingId: string,
  examType: ExamTypes
): Promise<ApiResponse<IEmployeeTrainingExamEligibility>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    if (!employeeCode) {
      throw new Error('No employee code found');
    }
    // CHECKING IF EMPLOYEE EVEN EXIST WITH THIS EMPLOYEE CODE
    const employee = await EmployeeData.find({
      code: employeeCode,
    }).select('code');

    // console.log('found employee', employee);
    if (employee?.length === 0) {
      throw new Error(
        `No candidate alias employee found with code ${employeeCode}`
      );
    }
    const employeeId = employee[0]._id;

    // CHECKING IF EMPLOYEE IS IN ALLOWED LIST IN THIS TRAINING
    const { data, error, status, success } = await fetchTrainingDetailById(
      trainingId
    );
    console.log('Allowed candidates', data);
    if (!success) {
      throw new Error('Failed to check eligibility');
    }

    const isEmployeeExistInAllowedCandidates = !!data?.allowedCandidates.find(
      (canId) => canId.toString() === employeeId.toString()
    );
    if (!isEmployeeExistInAllowedCandidates) {
      throw new Error('You were not selected for this exam');
    }

    // CHECKING IF EMPLOYEE HAS ALREADY ATTEMPTED OR SUBMITTED EXAM
    const { data: examData, success: examSuccess } =
      await fetchExamByTrainingIdAndExamType(
        new mongoose.Types.ObjectId(trainingId),
        examType,
        ['examType']
      );

    if (!examSuccess) {
      throw new Error('Failed to check eligibility');
    }
    // console.log('exam data', examData);
    // console.log('candidate', employeeId, 'exam', examData._id);
    const attempt = await TrainingExamAttemptModel.find({
      candidate: employeeId,
      exam: examData._id,
    });
    // console.log('attempt', attempt);
    const hasCandidateAlreadyAttemptedExam = attempt.length > 0;

    if (hasCandidateAlreadyAttemptedExam) {
      throw new Error('Candidate has already attempted & submitted exam');
    }
    return await JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Candidate is eligible',
        data: {
          _id: employeeId,
          eligible: true,
        },
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: {
          _id: null,
          eligible: false,
        },
        error: error,
      })
    );
  }
};

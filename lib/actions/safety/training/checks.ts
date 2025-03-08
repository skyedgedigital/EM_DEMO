'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import handleDBConnection from '@/lib/database';
import EmployeeData from '@/lib/models/HR/EmployeeData.model';
import mongoose from 'mongoose';
import { fetchSelectedInfosOfExamByExamId } from './fetch';

export interface IEmployeeTrainingExamEligibility {
  _id: mongoose.Types.ObjectId;
  eligible: boolean;
}
export const checkEmployeeTrainingExamEligibility = async (
  employeeCode: string,
  examId: string
): Promise<ApiResponse<IEmployeeTrainingExamEligibility>> => {
  console.log('emp code', employeeCode);
  console.log('exam id', examId);
  //   const session = await mongoose.startSession();
  //   session.startTransaction();
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    if (!employeeCode) {
      throw new Error('No employee code found');
    }
    const employee = await EmployeeData.find({
      code: employeeCode,
    }).select('code');

    console.log('found employee', employee);
    if (employee?.length === 0) {
      return {
        success: true,
        status: 400,
        message: 'Employee not eligible to proceed',
        error: null,
        data: {
          _id: null,
          eligible: false,
        },
      };
    }
    const employeeId = employee[0]._id;

    const { data, error, status, success } =
      await fetchSelectedInfosOfExamByExamId(examId, ['allowedCandidates']);
    console.log('Allowed candidates', data);
    if (!success) {
      throw new Error('Failed to check eligibility');
    }

    const isEmployeeExistInAllowedCandidates = !!data?.allowedCandidates.find(
      (canId) => canId.toString() === employeeId.toString()
    );
    if (!isEmployeeExistInAllowedCandidates) {
      throw new Error('Employee not eligible to proceed');
    }
    return await JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Candidate is eligible',
        data: {
          _id: employeeId,
          eligible: isEmployeeExistInAllowedCandidates,
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

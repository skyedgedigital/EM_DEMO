import { checkEmployeeTrainingExamEligibility } from './checks';
import {
  createExamAttempt,
  createTraining,
  createTrainingExamWithQuestions,
} from './create';
import {
  fetchRequiredDetailsForATrainingExam,
  fetchExamByTrainingIdAndExamType,
  fetchTrainingDetailById,
  fetchUpcomingTrainings,
  fetchCompletedTrainings,
  fetchTrainingDetailWithExamsById,
  fetchExamAttemptDetails,
  fetchExamQuestionsByExamId,
  fetchAllTrainingDetails,
  fetchAllTrainingSelectedDetails,
  // fetchSelectedInfosOfExamByExamId,
} from './fetch';
import { updateExam, updateTraining } from './update';

export const trainingActions = {
  CREATE: {
    createTrainingExamWithQuestions,
    createExamAttempt,
    createTraining,
  },
  FETCH: {
    fetchExamByTrainingIdAndExamType,
    fetchTrainingDetailById,
    fetchRequiredDetailsForATrainingExam,
    fetchUpcomingTrainings,
    fetchCompletedTrainings,
    fetchTrainingDetailWithExamsById,
    fetchExamAttemptDetails,
    fetchExamQuestionsByExamId,
    fetchAllTrainingDetails,
    fetchAllTrainingSelectedDetails,
  },
  CHECKS: {
    checkEmployeeTrainingExamEligibility,
  },
  UPDATE: {
    updateExam,
    updateTraining,
  },
};

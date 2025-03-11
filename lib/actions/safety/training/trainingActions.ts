import { checkEmployeeTrainingExamEligibility } from './checks';
import {
  createExamAttempt,
  createTrainingExamWithQuestions,
  updateExam,
  updateTraining,
} from './create';
import {
  fetchRequiredDetailsForATrainingExam,
  fetchExamByTrainingIdAndExamType,
  fetchTrainingDetailById,
  fetchUpcomingTrainings,
  fetchCompletedTrainings,
  fetchTrainingDetailWithExamsById,
  // fetchSelectedInfosOfExamByExamId,
} from './fetch';

export const trainingActions = {
  CREATE: {
    createTrainingExamWithQuestions,
    createExamAttempt,
  },
  FETCH: {
    fetchExamByTrainingIdAndExamType,
    fetchTrainingDetailById,
    fetchRequiredDetailsForATrainingExam,
    fetchUpcomingTrainings,
    fetchCompletedTrainings,
    fetchTrainingDetailWithExamsById,
  },
  CHECKS: {
    checkEmployeeTrainingExamEligibility,
  },
  UPDATE: {
    updateExam,
    updateTraining,
  },
};

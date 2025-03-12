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
  fetchExamAttemptDetails,
  fetchExamQuestionsByExamId,
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
    fetchExamAttemptDetails,
    fetchExamQuestionsByExamId,
  },
  CHECKS: {
    checkEmployeeTrainingExamEligibility,
  },
  UPDATE: {
    updateExam,
    updateTraining,
  },
};

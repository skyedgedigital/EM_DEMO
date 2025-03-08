import { checkEmployeeTrainingExamEligibility } from './checks';
import { createTrainingExamWithQuestions } from './create';
import { fetchExamByExamId, fetchSelectedInfosOfExamByExamId } from './fetch';

export const trainingActions = {
  CREATE: {
    createTrainingExamWithQuestions,
  },
  FETCH: {
    fetchExamByExamId,
    fetchSelectedInfosOfExamByExamId,
  },
  CHECKS: {
    checkEmployeeTrainingExamEligibility,
  },
};

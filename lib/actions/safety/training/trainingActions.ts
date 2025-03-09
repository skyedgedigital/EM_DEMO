import { checkEmployeeTrainingExamEligibility } from './checks';
import {
  createExamAttempt,
  createTrainingExamWithQuestions,
  updateExam,
  updateTraining,
} from './create';
import {
  fetchExamByTrainingIdAndExamType,
  fetchSelectedInfosOfExamByExamId,
} from './fetch';

export const trainingActions = {
  CREATE: {
    createTrainingExamWithQuestions,
    createExamAttempt,
  },
  FETCH: {
    fetchExamByTrainingIdAndExamType,
    fetchSelectedInfosOfExamByExamId,
  },
  CHECKS: {
    checkEmployeeTrainingExamEligibility,
  },
  UPDATE: {
    updateExam,
    updateTraining,
  },
};

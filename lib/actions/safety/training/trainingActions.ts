import { checkEmployeeTrainingExamEligibility } from './checks';
import {
  createExamAttempt,
  createTrainingExamWithQuestions,
  updateExam,
  updateTraining,
} from './create';
import {
  fetchExamandTrainingDetail,
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
    fetchExamandTrainingDetail,
  },
  CHECKS: {
    checkEmployeeTrainingExamEligibility,
  },
  UPDATE: {
    updateExam,
    updateTraining,
  },
};

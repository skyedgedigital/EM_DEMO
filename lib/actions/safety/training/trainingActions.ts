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
  fetchTrainingDetailById,
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

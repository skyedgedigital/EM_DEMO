import { checkEmployeeTrainingExamEligibility } from './checks';
import { createExamAttempt, createTrainingExamWithQuestions } from './create';
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
import { updateExam, updateTraining } from './update';

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

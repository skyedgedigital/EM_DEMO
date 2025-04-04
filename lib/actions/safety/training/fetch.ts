'use server';
import { ApiResponse } from '@/interfaces/APIresponses.interface';
import { IEmployeeData } from '@/interfaces/HR/EmployeeData.interface';
import handleDBConnection from '@/lib/database';
import EmployeeData from '@/lib/models/HR/EmployeeData.model';
import {
  TrainingExamModel,
  ExamTypes,
  ITrainingExam,
  ITraining,
  TrainingModel,
  TrainingExamAttemptModel,
  ITrainingExamAttempt,
} from '@/lib/models/Safety/training.model';
import mongoose from 'mongoose';

export const fetchExamByTrainingIdAndExamType = async (
  trainingId: mongoose.Types.ObjectId,
  examType: ExamTypes,
  selectedFields: (keyof ITrainingExam)[] = []
): Promise<ApiResponse<ITrainingExam & { _id: mongoose.Types.ObjectId }>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!trainingId || !examType) {
      throw new Error('Invalid input: examId are required');
    }

    const exam = await TrainingExamModel.findOne({
      trainingId,
      examType,
    }).select(selectedFields.join(' '));
    console.log('Exam', exam);

    if (!exam) {
      throw new Error('Exam not found');
    }

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Exam fetched successfully!',
        data: exam,
        error: null,
      })
    );
  } catch (error) {
    console.log('Error', error.message);
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};

export interface IRequiredDetailsForATrainingExam
  extends Partial<ITraining & ITrainingExam> {
  examId: mongoose.Types.ObjectId;
}
export const fetchRequiredDetailsForATrainingExam = async (
  trainingId: mongoose.Schema.Types.ObjectId,
  examType: ExamTypes
): Promise<ApiResponse<IRequiredDetailsForATrainingExam>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!trainingId || !examType) {
      throw new Error('Invalid input: examId are required');
    }

    const training = await TrainingModel.findById(trainingId).select('title');
    console.log('Found Training', training);
    if (!training) {
      throw new Error(`No training with ID ${trainingId} found`);
    }
    const exam = await TrainingExamModel.findOne({
      trainingId,
      examType,
    })
      .populate('questions')
      .exec();
    console.log('Found Exam', exam);
    if (!exam) {
      throw new Error('exam not found');
    }

    const combinedData: IRequiredDetailsForATrainingExam = {
      title: training.title,
      examType: exam.examType,
      questions: exam.questions,
      targetDate: exam.targetDate,
      responsibility: exam.responsibility,
      examId: exam._id,
    };
    console.log('Combined data', combinedData);
    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Exam fetched successfully!',
        data: combinedData,
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};

export const fetchTrainingDetailById = async (trainingId: string) => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!trainingId) {
      throw new Error('Invalid input: trainingId is required');
    }

    const training = await TrainingModel.findOne({ _id: trainingId });

    if (!training) {
      throw new Error(`No training found with id: ${trainingId}`);
    }
    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Training fetched successfully!',
        data: training,
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};

// export const fetchSelectedInfosOfExamByExamId = async (
//   examId: string,
//   selectedField: (keyof ITrainingExam)[] | string[] = []
// ): Promise<ApiResponse<ITrainingExam>> => {
//   try {
//     // console.log('HELLO');
//     const dbConnection = await handleDBConnection();
//     if (!dbConnection.success) return dbConnection;
//     console.log('ExamId', examId);
//     if (!examId) {
//       throw new Error('Invalid input: examId are required');
//     }

//     const exam = await TrainingExamModel.findById(examId).select(
//       selectedField.join(' ')
//     );
//     // console.log('Exam', exam);

//     if (!exam) {
//       throw new Error('Exam not found or update failed');
//     }

//     return JSON.parse(
//       JSON.stringify({
//         success: true,
//         status: 200,
//         message: 'Exam fetched successfully!',
//         data: exam,
//         error: null,
//       })
//     );
//   } catch (error) {
//     console.log('Error', error.message);
//     return JSON.parse(
//       JSON.stringify({
//         success: false,
//         status: 400,
//         message: error.message || 'Something went wrong!',
//         data: null,
//         error: error,
//       })
//     );
//   }
// };

export const fetchAllTrainingDetails = async (): Promise<
  ApiResponse<ITraining[]>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const trainings = await TrainingModel.find({});
    if (!trainings) {
      throw new Error('no trainings exist');
    }
    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Training fetched successfully!',
        data: trainings,
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};

export interface IUpcomingTrainingsResponse extends ITraining {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
}
export const fetchUpcomingTrainings = async (): Promise<
  ApiResponse<IUpcomingTrainingsResponse[]>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const upcomingTrainingIds = await TrainingExamModel.distinct('trainingId', {
      targetDate: { $gte: new Date() },
    });
    if (!upcomingTrainingIds) {
      throw new Error('no trainings exist');
    }
    const trainings = await TrainingModel.find({
      _id: { $in: upcomingTrainingIds },
    });

    if (!trainings) {
      throw new Error('no training exist');
    }

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'upcoming trainings fetched successfully!',
        data: trainings,
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};
export interface ICompletedTrainingsResponse extends ITraining {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
}
export const fetchCompletedTrainings = async (): Promise<
  ApiResponse<ICompletedTrainingsResponse[]>
> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    const upcomingTrainingIds = await TrainingExamModel.distinct('trainingId', {
      targetDate: { $lt: new Date() },
    });
    if (!upcomingTrainingIds) {
      throw new Error('no trainings exist');
    }
    const trainings = await TrainingModel.find({
      _id: { $in: upcomingTrainingIds },
    });

    if (!trainings) {
      throw new Error('no training exist');
    }

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'completed trainings fetched successfully!',
        data: trainings,
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};

type ITrainingExamWithAttempts = ITrainingExam & {
  totalCandidatesAttempted: number;
  _id: mongoose.Types.ObjectId;
};

export interface ITrainingDetailWithExamsResponse {
  title: string;
  trainer: mongoose.Types.ObjectId;
  allowedCandidates: {
    code: IEmployeeData['code'];
    name: IEmployeeData['name'];
  }[];
  exams: ITrainingExamWithAttempts[];
  createdAt: Date;
  attendanceSheetURL: ITraining['attendanceSheetURL'];
}

export const fetchTrainingDetailWithExamsById = async (
  trainingId: string
): Promise<ApiResponse<ITrainingDetailWithExamsResponse>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!trainingId) {
      throw new Error('Provide valid trainingId');
    }

    if (!mongoose.models.EmployeeData) {
      const { EmployeeDataSchema } = await import(
        '@/lib/models/HR/EmployeeData.model'
      );
      mongoose.model('EmployeeData', EmployeeDataSchema);
      console.log('Forcibly registered EmployeeData model');
    }

    const training = await TrainingModel.findOne({ _id: trainingId })
      .populate({
        path: 'allowedCandidates',
        select: 'code name',
      })
      .lean();

    if (!training) {
      throw new Error('Training does not exist');
    }
    const trainingExams = await TrainingExamModel.find({ trainingId }).lean();
    if (!trainingExams) {
      throw new Error('No exams exist within this training');
    }

    const examsWithAttempts = await Promise.all(
      trainingExams.map(async (exam) => {
        const totalCandidatesAttempted =
          await TrainingExamAttemptModel.countDocuments({
            exam: exam._id,
          });

        return {
          ...exam,
          totalCandidatesAttempted,
        };
      })
    );

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Training details fetched successfully!',
        data: { ...training, exams: examsWithAttempts },
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};

// export interface IExamAttemptDetailsResponse {
//   candidate: { code: string; name: string }[];
//   exam: ITrainingExam;
//   responses: {
//     selectedAnswer: number;
//   }[];
//   score: number;
// }

// export const fetchExamAttemptDetails = async (
//   examId: string
// ): Promise<ApiResponse<IExamAttemptDetailsResponse[]>> => {
//   try {
//     const dbConnection = await handleDBConnection();
//     if (!dbConnection.success) return dbConnection;

//     if (!examId) {
//       throw new Error('Provide valid examId');
//     }

//     const attempts = await TrainingExamAttemptModel.find({
//       exam: examId,
//     })
//       .populate('exam')
//       .populate({ path: 'candidate', select: 'code name' });
//     if (!attempts) {
//       throw new Error('No attempts found for this exam');
//     }

//     return JSON.parse(
//       JSON.stringify({
//         success: true,
//         status: 200,
//         message: 'Attempts fetched successfully!',
//         data: attempts,
//         error: null,
//       })
//     );
//   } catch (error) {
//     return JSON.parse(
//       JSON.stringify({
//         success: false,
//         status: 400,
//         message: error.message || 'Something went wrong!',
//         data: null,
//         error: error,
//       })
//     );
//   }
// };

// export interface IExamAllAttemptsResponse {
//   exam: ITrainingExam;
//   submittedAttempts: (ITrainingExamAttempt & {
//     _id: mongoose.Types.ObjectId;
//     createdAt: Date;
//   })[];
// }
type TSubmittedAttemptsResponse = {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  candidate: {
    _id: mongoose.Types.ObjectId;
    code: IEmployeeData['code'];
    name: IEmployeeData['name'];
  };
  responses: ITrainingExamAttempt['responses'];
  score: ITrainingExamAttempt['score'];
};
type TExamResponse = ITrainingExam & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
};
export interface IExamAllAttemptsResponse {
  exam: TExamResponse;
  submittedAttempts: TSubmittedAttemptsResponse[];
}
export const fetchExamAttemptDetails = async (
  examId: string
): Promise<ApiResponse<IExamAllAttemptsResponse>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;

    if (!examId) {
      throw new Error('Provide valid examId');
    }

    const exam: TExamResponse = await TrainingExamModel.findById(examId).lean();
    if (!exam) {
      throw new Error('Invalid Exam Id!');
    }
    console.log('Found Exam', exam);

    const attempts: TSubmittedAttemptsResponse[] =
      await TrainingExamAttemptModel.find({
        exam: examId,
      })
        .populate({ path: 'candidate', select: 'code name' })
        .lean();
    console.log('Attempts', attempts);

    if (!attempts) {
      throw new Error('No Attempts for this exam has been submitted');
    }

    const result: IExamAllAttemptsResponse = {
      exam: exam,
      submittedAttempts: attempts,
    };
    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Attempts fetched successfully!',
        data: result,
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message: error.message || 'Something went wrong!',
        data: null,
        error: error,
      })
    );
  }
};

export const fetchExamQuestionsByExamId = async (
  trainingId: string,
  examType: ITrainingExam['examType']
): Promise<ApiResponse<{ questions: ITrainingExam['questions'] }>> => {
  try {
    const dbConnection = await handleDBConnection();
    if (!dbConnection.success) return dbConnection;
    console.log(trainingId, examType);

    if (!trainingId || !examType) {
      throw new Error('Provide valid examId and examType');
    }

    const questions = await TrainingExamModel.findOne({
      trainingId,
      examType,
    }).select('questions');

    if (!questions) {
      throw new Error('Training or exam does not exist');
    }

    return JSON.parse(
      JSON.stringify({
        success: true,
        status: 200,
        message: 'Questions fetched successfully!',
        data: questions,
        error: null,
      })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        status: 400,
        message:
          `${error.message}, you can still continue adding questions on your own` ||
          'Something went wrong!, , you can still continue adding questions on your own',
        data: null,
        error: error,
      })
    );
  }
};

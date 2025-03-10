import mongoose from 'mongoose';

export const ExamTypeNames = [
  'pre-training-exam',
  'post-training-exam',
] as const;
export type ExamTypes = (typeof ExamTypeNames)[number];
export interface IQuestion {
  text: string;
  options: { text: string }[];
  correctAnswer: number;
}

export interface ITraining {
  title: string;
  trainer: mongoose.Types.ObjectId;
  allowedCandidates: mongoose.Types.ObjectId[];
}

export interface ITrainingExam {
  questions: IQuestion[];
  targetDate: Date;
  responsibility?: string;
  examType: ExamTypes;
  trainingId: mongoose.Types.ObjectId;
}

export interface ITrainingExamAttempt {
  candidate: mongoose.Types.ObjectId;
  exam: mongoose.Types.ObjectId;
  responses: {
    selectedAnswer: number;
  }[];
  score: number;
}

const QuestionSchema: mongoose.Schema<IQuestion> = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [{ text: String, _id: false }],
      required: true,
    },
    correctAnswer: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const TrainingSchema: mongoose.Schema<ITraining> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  allowedCandidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployeeData',
      required: true,
    },
  ],
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
});

const TrainingExamSchema: mongoose.Schema<ITrainingExam> = new mongoose.Schema(
  {
    examType: {
      type: String,
      required: true,
      enum: ExamTypeNames,
    },
    questions: [QuestionSchema],
    targetDate: {
      type: Date,
      required: true,
    },
    responsibility: {
      type: String,
      default: '',
    },
    trainingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Training',
      required: true,
    },
  },
  { timestamps: true }
);

const TrainingExamAttemptSchema: mongoose.Schema<ITrainingExamAttempt> =
  new mongoose.Schema(
    {
      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmployeeData', // Ensure consistency with `TrainingExamSchema`
        required: true,
      },
      exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true,
      },
      responses: [
        {
          selectedAnswer: { type: Number, required: true },
        },
      ],
      score: { type: Number, required: true },
    },
    {
      timestamps: true,
    }
  );

const QuestionModel: mongoose.Model<IQuestion> =
  mongoose.models?.Question || mongoose.model('Question', QuestionSchema);
const TrainingModel: mongoose.Model<ITraining> =
  mongoose.models?.Training || mongoose.model('Training', TrainingSchema);
const TrainingExamModel: mongoose.Model<ITrainingExam> =
  mongoose.models?.TrainingExam ||
  mongoose.model('TrainingExam', TrainingExamSchema);
const TrainingExamAttemptModel: mongoose.Model<ITrainingExamAttempt> =
  mongoose.models?.TrainingExamAttempt ||
  mongoose.model('TrainingExamAttempt', TrainingExamAttemptSchema);

export {
  QuestionModel,
  TrainingExamAttemptModel,
  TrainingExamModel,
  TrainingModel,
};

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

export interface IExam {
  questions: IQuestion[];
  targetDate: Date;
  responsibility?: string;
  examType: ExamTypes;
  trainingId: mongoose.Types.ObjectId;
}

export interface IAttempt {
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

const ExamSchema: mongoose.Schema<IExam> = new mongoose.Schema(
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

const AttemptSchema: mongoose.Schema<IAttempt> = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployeeData', // Ensure consistency with `ExamSchema`
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    responses: [
      {
        selectedAnswers: { type: Number, required: true },
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
const ExamModel: mongoose.Model<IExam> =
  mongoose.models?.Exam || mongoose.model('Exam', ExamSchema);
const AttemptModel: mongoose.Model<IAttempt> =
  mongoose.models?.Attempt || mongoose.model('Attempt', AttemptSchema);

export { QuestionModel, AttemptModel, ExamModel, TrainingModel };

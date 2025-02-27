import mongoose from 'mongoose';

export const QuestionTypesNames = ['mcq', 'multiple_answers'];

export type QuestionTypes = (typeof QuestionTypesNames)[number];

export interface IQuestion {
  text: string;
  type: QuestionTypes;
  options: { text: string }[];
  correctAnswers: number[];
}

export interface ITrainingExam {
  title: string;
  trainer: mongoose.Types.ObjectId;
  questions: mongoose.Types.ObjectId[];
  allowedCandidates: mongoose.Types.ObjectId[];
  targetDate: Date;
  responsibility?: string;
}

export interface IAttempt {
  candidate: mongoose.Types.ObjectId;
  exam: mongoose.Types.ObjectId;
  responses: {
    question: mongoose.Types.ObjectId;
    selectedAnswers: number[];
  }[];
  score: number;
}

const QuestionSchema: mongoose.Schema<IQuestion> = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: QuestionTypesNames,
    required: true,
  },
  options: {
    type: [{ text: String, _id: false }],
    required: true,
  },
  correctAnswers: {
    type: [Number],
    required: true,
  },
});

const TrainingExamSchema: mongoose.Schema<ITrainingExam> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    allowedCandidates: [QuestionSchema],
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
    ],
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee', // Ensure consistency with `AttemptSchema`
      required: true,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    responsibility: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const AttemptSchema: mongoose.Schema<IAttempt> = new mongoose.Schema({
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
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      selectedAnswers: { type: [Number], required: true },
    },
  ],
  score: { type: Number, required: true }, // ✅ Added missing field
});

const QuestionModel: mongoose.Model<IQuestion> =
  mongoose.models.Question || mongoose.model('Question', QuestionSchema);
const TrainingExamModel: mongoose.Model<ITrainingExam> =
  mongoose.models.Exam || mongoose.model('Exam', TrainingExamSchema);
const AttemptModel: mongoose.Model<IAttempt> =
  mongoose.models.Attempt || mongoose.model('Attempt', AttemptSchema);

export { QuestionModel, AttemptModel, TrainingExamModel };

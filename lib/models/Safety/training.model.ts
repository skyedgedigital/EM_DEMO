import mongoose from 'mongoose';

export const QuestionTypesNames = ['mcq', 'multiple_answers'];

export type QuestionTypes = (typeof QuestionTypesNames)[number];

interface IQuestion {
  text: string;
  type: QuestionTypes;
  options: { text: string }[];
  correctAnswers: number[];
}

interface IExam {
  title: string;
  trainer: mongoose.Types.ObjectId;
  questions: mongoose.Types.ObjectId[];
  allowedCandidates: mongoose.Types.ObjectId[];
}

interface IAttempt {
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

const ExamSchema: mongoose.Schema<IExam> = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  allowedCandidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployeeData',
      required: true,
    },
  ],
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
});

const AttemptSchema: mongoose.Schema<IAttempt> = new mongoose.Schema({
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
const ExamModel: mongoose.Model<IExam> =
  mongoose.models.Exam || mongoose.model('Exam', ExamSchema);
const AttemptModel: mongoose.Model<IAttempt> =
  mongoose.models.Attempt || mongoose.model('Attempt', AttemptSchema);

export { QuestionModel, AttemptModel, ExamModel };


export enum Difficulty {
  EASY = '简单',
  MEDIUM = '中等',
  HARD = '困难'
}

export enum QuestionType {
  FILL_IN = '填空题',
  CHOICE = '选择题',
  TRUE_FALSE = '判断题',
  SUBJECTIVE = '解答题'
}

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[];
  answer: string;
  explanation: string;
  needsImage: boolean;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface GradingResult {
  score: number;
  totalPoints: number;
  overallFeedback: string;
  details: {
    questionNumber: number;
    isCorrect: boolean;
    feedback: string;
    correction?: string;
  }[];
}

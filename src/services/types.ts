
export interface Option {
  id: string;
  option_text: string;
  is_correct: boolean;
  explanation?: string;
}

export type QuestionType = 'mcq' | 'sa' | 'la' | 'truefalse';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  original_text: string;
  presentation_text: string;
  chapter_id: string;
  topic_id: string;
  question_type: QuestionType;
  derived: boolean;
  difficulty: Difficulty;
  marks: number;
  year: number;
  paper: string; // e.g., "CBSE Board, 2023 (Main)"
  original_q_no: string;
  source_url: string;
  source_pdf_page?: number;
  image_asset_url?: string; // URL for diagram
  options: Option[];
  verified: boolean;
  ocr_confidence: number; // 0 to 1
  explanation?: string; // General explanation
}

export interface Chapter {
  id: string;
  name: string;
  syllabus_code: string;
  order: number;
}

export interface Topic {
  id: string;
  chapter_id: string;
  name: string;
}

export interface UserStats {
  questionsAttempted: number;
  correctAnswers: number;
  streak: number;
  xp: number;
}

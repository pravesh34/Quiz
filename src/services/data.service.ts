
import { Injectable, signal, computed } from '@angular/core';
import { Chapter, Topic, Question, UserStats } from './types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // --- Mock Database ---

  // Chapters
  private _chapters = signal<Chapter[]>([
    { id: 'c1', name: 'Haloalkanes and Haloarenes', syllabus_code: 'Unit 10', order: 1 },
    { id: 'c2', name: 'Alcohols, Phenols and Ethers', syllabus_code: 'Unit 11', order: 2 },
    { id: 'c3', name: 'Aldehydes, Ketones and Carboxylic Acids', syllabus_code: 'Unit 12', order: 3 },
    { id: 'c4', name: 'Amines', syllabus_code: 'Unit 13', order: 4 },
  ]);

  // Topics
  private _topics = signal<Topic[]>([
    { id: 't1', chapter_id: 'c1', name: 'Nucleophilic Substitution (SN1/SN2)' },
    { id: 't2', chapter_id: 'c1', name: 'Elimination Reactions' },
    { id: 't3', chapter_id: 'c2', name: 'Reimer-Tiemann Reaction' },
    { id: 't4', chapter_id: 'c3', name: 'Cannizzaro Reaction' },
    { id: 't5', chapter_id: 'c4', name: 'Carbylamine Test' },
  ]);

  // Questions (Simulated PYQs)
  private _questions = signal<Question[]>([
    {
      id: 'q1',
      original_text: 'Which alkyl halide from the following pair would you expect to react more rapidly by an SN2 mechanism? 1-Bromobutane or 2-Bromobutane? (CBSE 2019)',
      presentation_text: 'Identify the alkyl halide that reacts faster via SN2 mechanism.',
      chapter_id: 'c1',
      topic_id: 't1',
      question_type: 'mcq',
      derived: true,
      difficulty: 'medium',
      marks: 1,
      year: 2019,
      paper: 'CBSE 2019 (Delhi Set 1)',
      original_q_no: 'Q4',
      source_url: 'https://cbse.nic.in/curric~1/qp2019/56-1-1.pdf#page=2',
      verified: true,
      ocr_confidence: 0.98,
      explanation: 'Primary alkyl halides react faster than secondary alkyl halides in SN2 reactions due to less steric hindrance.',
      options: [
        { id: 'o1', option_text: '1-Bromobutane', is_correct: true, explanation: 'Primary halide, less steric hindrance.' },
        { id: 'o2', option_text: '2-Bromobutane', is_correct: false, explanation: 'Secondary halide, more steric hindrance.' },
        { id: 'o3', option_text: 'Both react at same rate', is_correct: false },
        { id: 'o4', option_text: 'Neither reacts via SN2', is_correct: false }
      ]
    },
    {
      id: 'q2',
      original_text: 'Write the structure of the major product formed when chlorobenzene reacts with sodium in the presence of dry ether. (CBSE 2020)',
      presentation_text: 'What is the major product of the Fittig reaction (Chlorobenzene + Na + dry ether)?',
      chapter_id: 'c1',
      topic_id: 't2',
      question_type: 'mcq',
      derived: true,
      difficulty: 'easy',
      marks: 1,
      year: 2020,
      paper: 'CBSE 2020 (Main)',
      original_q_no: 'Q12',
      source_url: 'https://cbse.nic.in/curric~1/qp2020/56-1-1.pdf#page=4',
      verified: false,
      ocr_confidence: 0.95,
      explanation: 'Aryl halides react with sodium in dry ether to give analogous hydrocarbons (diphenyl) via Fittig reaction.',
      options: [
        { id: 'o1', option_text: 'Phenol', is_correct: false },
        { id: 'o2', option_text: 'Benzene', is_correct: false },
        { id: 'o3', option_text: 'Diphenyl (Biphenyl)', is_correct: true, explanation: 'Two phenyl rings join together.' },
        { id: 'o4', option_text: 'Toluene', is_correct: false }
      ]
    },
    {
      id: 'q3',
      original_text: 'Account for the following: Propanol has higher boiling point than butane. (CBSE 2018)',
      presentation_text: 'Why does Propanol have a higher boiling point than Butane?',
      chapter_id: 'c2',
      topic_id: 't3', // Loose mapping for demo
      question_type: 'mcq',
      derived: true,
      difficulty: 'medium',
      marks: 2,
      year: 2018,
      paper: 'CBSE 2018 (All India)',
      original_q_no: 'Q7',
      source_url: 'https://cbse.nic.in/curric~1/qp2018/56-1.pdf',
      verified: true,
      ocr_confidence: 0.99,
      explanation: 'Alcohols can form intermolecular hydrogen bonds, requiring more energy to break than the weak Van der Waals forces in alkanes.',
      options: [
        { id: 'o1', option_text: 'Due to intermolecular hydrogen bonding in propanol.', is_correct: true },
        { id: 'o2', option_text: 'Due to higher molecular mass of propanol.', is_correct: false },
        { id: 'o3', option_text: 'Due to dipole-dipole interactions in butane.', is_correct: false },
        { id: 'o4', option_text: 'Butane is a gas while propanol is liquid.', is_correct: false, explanation: 'This is an observation, not the reason.' }
      ]
    },
    {
      id: 'q4',
      original_text: 'State the product of the reaction of Aniline with chloroform and alcoholic KOH. (CBSE 2021)',
      presentation_text: 'Identify the product: Aniline + CHCl3 + alc. KOH (Carbylamine Reaction)',
      chapter_id: 'c4',
      topic_id: 't5',
      question_type: 'mcq',
      derived: true,
      difficulty: 'hard',
      marks: 1,
      year: 2021,
      paper: 'CBSE 2021 (Term 1)',
      original_q_no: 'Q22',
      source_url: 'https://cbse.nic.in/qp2021.pdf',
      verified: false,
      ocr_confidence: 0.92,
      explanation: 'Primary amines react with chloroform and alc. KOH to form foul-smelling isocyanides (Carbylamines).',
      options: [
        { id: 'o1', option_text: 'Phenyl Cyanide', is_correct: false },
        { id: 'o2', option_text: 'Phenyl Isocyanide', is_correct: true, explanation: 'Foul smelling substance.' },
        { id: 'o3', option_text: 'Chlorobenzene', is_correct: false },
        { id: 'o4', option_text: 'Phenol', is_correct: false }
      ]
    },
     {
      id: 'q5',
      original_text: 'Formaldehyde does not undergo Aldol condensation. Why? (CBSE 2022)',
      presentation_text: 'Why does Formaldehyde (HCHO) fail to undergo Aldol condensation?',
      chapter_id: 'c3',
      topic_id: 't4',
      question_type: 'mcq',
      derived: true,
      difficulty: 'medium',
      marks: 1,
      year: 2022,
      paper: 'CBSE 2022 (Term 2)',
      original_q_no: 'Q3',
      source_url: 'https://cbse.nic.in/qp2022.pdf',
      verified: true,
      ocr_confidence: 0.99,
      explanation: 'Aldol condensation requires at least one alpha-hydrogen. Formaldehyde (H-CHO) has no alpha-carbon, hence no alpha-hydrogen.',
      options: [
        { id: 'o1', option_text: 'It is a gas.', is_correct: false },
        { id: 'o2', option_text: 'It has no alpha-hydrogen atom.', is_correct: true },
        { id: 'o3', option_text: 'It is too reactive.', is_correct: false },
        { id: 'o4', option_text: 'It undergoes Cannizzaro reaction instead.', is_correct: false, explanation: 'It does undergo Cannizzaro, but the *reason* it fails Aldol is lack of alpha-H.' }
      ]
    }
  ]);

  // User Stats
  private _userStats = signal<UserStats>({
    questionsAttempted: 0,
    correctAnswers: 0,
    streak: 0,
    xp: 0
  });

  // --- Public API ---

  chapters = this._chapters.asReadonly();
  topics = this._topics.asReadonly();
  questions = this._questions.asReadonly();
  userStats = this._userStats.asReadonly();

  getTopicsByChapter(chapterId: string) {
    return this._topics().filter(t => t.chapter_id === chapterId);
  }

  getQuestionsByChapter(chapterId: string) {
    return this._questions().filter(q => q.chapter_id === chapterId);
  }
  
  getQuestionsByTopic(topicId: string) {
     return this._questions().filter(q => q.topic_id === topicId);
  }

  getQuestionById(id: string) {
    return this._questions().find(q => q.id === id);
  }

  // --- Actions ---

  updateStats(isCorrect: boolean) {
    this._userStats.update(stats => {
      const newStreak = isCorrect ? stats.streak + 1 : 0;
      const xpGain = isCorrect ? 10 + (stats.streak * 2) : 0;
      return {
        questionsAttempted: stats.questionsAttempted + 1,
        correctAnswers: stats.correctAnswers + (isCorrect ? 1 : 0),
        streak: newStreak,
        xp: stats.xp + xpGain
      };
    });
  }

  verifyQuestion(id: string) {
    this._questions.update(questions => 
      questions.map(q => q.id === id ? { ...q, verified: true } : q)
    );
  }

  addQuestion(q: Question) {
    this._questions.update(prev => [...prev, q]);
  }
}

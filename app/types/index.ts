// 사용자 관련 타입
export interface User {
  id: string;
  name: string;
  memberNumber: string;
  role: 'teacher' | 'student';
  centerName: string;
  contactInfo?: string;
  teacherId?: string; // 학생의 경우 담당 선생님 ID
  assignedSubjects?: Subject[]; // 학생의 경우 배정된 과목들
  grade?: string; // 학년 (예: '중1', '중2', '중3')
}

// 과목 관련 타입
export type Subject = 'math' | 'english' | 'korean';

export interface Curriculum {
  id: string;
  subject: Subject;
  grade: string;
  semester: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  name: string;
}

// 문제 관련 타입
export type Difficulty = 'low' | 'medium' | 'high' | 'highest';
export type QuestionType = 'multiple_choice' | 'short_answer' | 'essay';
export type QuestionSource = 'internal' | 'textbook' | 'school_exam';

export interface Question {
  id: string;
  subject: Subject;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  source: QuestionSource;
  sourceInfo?: {
    textbookName?: string;
    schoolName?: string;
    examYear?: number;
    examType?: string;
  };
  curriculum: {
    chapterId: string;
    sectionId: string;
    lessonId: string;
  };
  choices?: string[]; // 객관식인 경우
  correctAnswer: string;
  explanation: string;
  videoUrl?: string;
  correctRate: number; // 정답률 (0-100)
  tags: string[];
  similarQuestions: string[]; // 유사 문제 ID 목록
  isFavorite?: boolean; // 선생님별 즐겨찾기
  // 초중고, 학년/학기 정보 추가
  schoolLevel: '초등' | '중등' | '고등';
  grade: string; // 예: '1학년', '2학년', '3학년'
  semester: string; // 예: '1학기', '2학기'
}

// 학습지 관련 타입
export type WorksheetStatus = 'published' | 'draft';

export interface Worksheet {
  id: string;
  title: string;
  description?: string;
  subject: Subject;
  teacherId: string;
  status: WorksheetStatus;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  folderId?: string;
  qrCode?: string;
  questions: Question[];
  difficultyDistribution: {
    [key in Difficulty]: number;
  };
  averageCorrectRate: number;
  totalQuestions: number;
  // 초중고, 학년/학기 정보 추가
  schoolLevel: '초등' | '중등' | '고등';
  grade: string; // 예: '1학년', '2학년', '3학년'
  semester: string; // 예: '1학기', '2학기'
  // step3에서 설정한 추가 정보들
  worksheetSettings?: {
    grade?: string; // 학년 정보
    creator?: string; // 출제자
    layout?: 'single' | 'double' | 'quad' | 'six'; // 분할선택
    includeAnswers?: boolean; // 정답포함
    includeExplanations?: boolean; // 해설포함
    qrEnabled?: boolean; // QR생성
  };
}

// 폴더 관련 타입
export interface Folder {
  id: string;
  name: string;
  teacherId: string;
  parentId?: string;
  isShared: boolean;
  createdAt: string;
}

// 과제 관련 타입
export type AssignmentStatus = 'in_progress' | 'completed' | 'overdue';

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  worksheetId: string;
  teacherId: string;
  studentIds: string[];
  assignedAt: string;
  dueDate: string;
  status: AssignmentStatus;
  completionRate: number; // 완료율 (0-100)
  averageScore: number;
}

// 학습 결과 관련 타입
export type GradingStatus = 'auto_graded' | 'manual_pending' | 'graded';

export interface LearningResult {
  id: string;
  studentId: string;
  assignmentId: string;
  worksheetId: string;
  answers: {
    questionId: string;
    studentAnswer: string;
    isCorrect: boolean;
    timeSpent: number; // 초 단위
  }[];
  submittedAt: string;
  totalScore: number;
  correctRate: number;
  totalTimeSpent: number;
  difficultyPerformance: {
    [key in Difficulty]: {
      correct: number;
      total: number;
      rate: number;
    };
  };
  gradingStatus: GradingStatus;
}

// 오답 노트 관련 타입
export interface WrongAnswerNote {
  id: string;
  studentId: string;
  learningResultId: string;
  wrongQuestions: Question[];
  createdAt: string;
  retestWorksheetId?: string; // 재시험지 ID
}

// 통계 및 분석 관련 타입
export interface StudentStats {
  studentId: string;
  totalAssignments: number;
  completedAssignments: number;
  completionRate: number;
  averageScore: number;
  totalStudyTime: number; // 분 단위
  weaknessTypes: {
    type: string;
    correctRate: number;
    questionCount: number;
  }[];
  subjectPerformance: {
    [key in Subject]: {
      averageScore: number;
      completedCount: number;
      totalTime: number;
    };
  };
}

export interface TeacherDashboardStats {
  totalWorksheets: number;
  totalAssignments: number;
  assignmentCompletionRate: number;
  totalStudents: number;
  recentWorksheets: Worksheet[];
  recentAssignments: Assignment[];
}

// 필터 및 검색 관련 타입
export interface WorksheetFilter {
  subject?: Subject;
  status?: WorksheetStatus;
  tags?: string[];
  folderId?: string;
  searchQuery?: string;
}

export interface QuestionFilter {
  subject?: Subject;
  difficulty?: Difficulty[];
  type?: QuestionType[];
  source?: QuestionSource[];
  chapterId?: string;
  sectionId?: string;
  lessonId?: string;
  correctRateRange?: [number, number];
  tags?: string[];
  searchQuery?: string;
}

// 시중교재 관련 타입
export interface TextbookPublisher {
  id: string;
  name: string;
  textbooks: Textbook[];
}

export interface Textbook {
  id: string;
  name: string;
  subject: Subject;
  grade: string;
  publisherId: string;
  chapters: TextbookChapter[];
}

export interface TextbookChapter {
  id: string;
  name: string;
  pages: TextbookPage[];
}

export interface TextbookPage {
  id: string;
  pageNumber: number;
  chapterName: string;
  questionGroups: QuestionGroup[];
  totalQuestions: number;
}

export interface QuestionGroup {
  id: string;
  type: string; // 유형 UP, 실력 UP 등
  questions: TextbookQuestion[];
}

export interface TextbookQuestion {
  id: string;
  number: number;
  difficulty: Difficulty;
  questionType: QuestionType;
  content: string;
  pageId: string;
  groupId: string;
}

export type MockExamOption = 'include' | 'exclude' | 'only';

// 학습지 생성 관련 타입
export interface WorksheetCreationStep1 {
  subject: Subject;
  sources: QuestionSource[];
  sourceDetails: {
    textbooks?: string[];
    schools?: { name: string; year: number }[];
  };
  curriculum: {
    chapterId: string;
    sectionId: string;
    lessonId: string;
  }[];
  questionCount: number;
  difficulty: {
    type: 'single' | 'mixed';
    single?: Difficulty;
    mixed?: {
      [key in Difficulty]: number;
    };
  };
  questionTypes: QuestionType[];
  options: {
    evenDistribution: boolean;
    prioritizeHighDifficulty: boolean;
    limitQuestionTypes: boolean;
    maxQuestionsPerType: number;
    mockExamOption?: MockExamOption;
    excludeOutOfCurriculum?: boolean;
  };
  // 시중교재 선택 시 추가 필드
  textbookSelection?: {
    publisherId: string;
    textbookId: string;
    selectedPages: string[];
    selectedQuestions: string[];
  };
}

export interface WorksheetCreationStep2 {
  selectedQuestions: Question[];
  summary: {
    totalQuestions: number;
    averageCorrectRate: number;
    difficultyDistribution: {
      [key in Difficulty]: number;
    };
    sourceDistribution: {
      [key in QuestionSource]: number;
    };
  };
}

export interface WorksheetCreationStep3 {
  title: string;
  description?: string;
  tags: string[];
  folderId?: string;
  qrCodeEnabled: boolean;
  pdfOptions: {
    includeAnswers: boolean;
    includeExplanations: boolean;
    layout: 'single' | 'double' | 'quad' | 'six';
    theme: string;
    watermark: boolean;
    sourceDisplay: 'inline' | 'end';
  };
  assignToStudents?: {
    studentIds: string[];
    dueDate: string;
  };
}

// OMR 카드 관련 타입
export interface OMRCard {
  id: string;
  worksheetId: string;
  studentId?: string;
  studentName?: string;
  studentNumber?: string;
  answers: OMRAnswer[];
  submittedAt?: string;
  qrCodeData: string;
}

export interface OMRAnswer {
  questionNumber: number;
  questionId: string;
  questionType: QuestionType;
  selectedChoice?: string; // 객관식: 'A', 'B', 'C', 'D', 'E' 등
  textAnswer?: string; // 주관식/서술형: 텍스트 답안
}

export interface OMRSession {
  worksheetId: string;
  worksheetTitle: string;
  totalQuestions: number;
  timeLimit?: number;
  instructions?: string;
}

// 콘텐츠 관리 관련 타입
export type ContentStatus = 'processing' | 'completed' | 'failed';
export type SharingType = 'private' | 'public' | 'selective';
export type ContentFileType = 'pdf' | 'image';

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  teacherId: string;
  teacherName: string;
  fileType: ContentFileType;
  fileName: string;
  fileSize: number;
  filePath: string;
  thumbnailPath?: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  metadata: ContentMetadata;
  sharingSettings: SharingSettings;
  extractedQuestions: Question[];
  ocrResult?: OCRResult;
  tags: string[];
}

export interface ContentMetadata {
  schoolName?: string;
  region?: string;
  subject: Subject;
  grade: string;
  semester?: string; // '1-1', '1-2', '2-1', '2-2' 등
  examYear?: number;
  examType?: string; // '중간고사', '기말고사', '모의고사' 등
  difficulty?: Difficulty;
  questionCount: number;
  autoTagged: boolean; // 자동 태깅 여부
}

export interface OCRResult {
  id: string;
  contentId: string;
  status: 'processing' | 'completed' | 'failed';
  confidence: number; // 0-100, OCR 신뢰도
  extractedText: string;
  processedAt: string;
  processingTime: number; // 처리 시간 (초)
  detectedQuestions: DetectedQuestion[];
  error?: string;
}

export interface DetectedQuestion {
  id: string;
  questionNumber: number;
  content: string;
  type: QuestionType;
  choices?: string[];
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
}

export interface SharingSettings {
  type: SharingType;
  isPublic: boolean;
  allowedTeachers: string[]; // 특정 선생님들과 공유할 때 사용
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDownload: boolean;
  };
  sharedAt?: string;
}

export interface ContentFilter {
  subject?: Subject;
  status?: ContentStatus;
  sharingType?: SharingType;
  schoolName?: string;
  region?: string;
  grade?: string;
  examYear?: number;
  tags?: string[];
  searchQuery?: string;
  teacherId?: string;
}

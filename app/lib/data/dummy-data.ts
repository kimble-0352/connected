import { 
  User, 
  Question, 
  Worksheet, 
  Assignment, 
  LearningResult, 
  Folder,
  Curriculum,
  Chapter,
  Section,
  Lesson,
  StudentStats,
  TeacherDashboardStats,
  Subject,
  Difficulty,
  QuestionSource,
  QuestionType,
  TextbookPublisher,
  Textbook,
  TextbookChapter,
  TextbookPage,
  QuestionGroup,
  TextbookQuestion
} from '@/app/types';

// 시중교재 더미 데이터
export const dummyTextbookPublishers: TextbookPublisher[] = [
  {
    id: 'publisher-chunjae',
    name: '천재교육',
    textbooks: [
      {
        id: 'textbook-chunjae-math-2-1',
        name: 'RPM - 중등수학2(상)',
        subject: 'math',
        grade: '중2-1',
        publisherId: 'publisher-chunjae',
        chapters: [
          {
            id: 'chapter-1',
            name: '소수와 합성수',
            pages: [
              {
                id: 'page-9',
                pageNumber: 9,
                chapterName: '소수와 합성수',
                totalQuestions: 8,
                questionGroups: [
                  {
                    id: 'group-9-basic',
                    type: '기본 연습',
                    questions: [
                      {
                        id: 'q-9-1',
                        number: 1,
                        difficulty: 'low',
                        questionType: 'multiple_choice',
                        content: '다음 중 소수인 것은?',
                        pageId: 'page-9',
                        groupId: 'group-9-basic'
                      },
                      {
                        id: 'q-9-2',
                        number: 2,
                        difficulty: 'low',
                        questionType: 'multiple_choice',
                        content: '다음 중 합성수인 것은?',
                        pageId: 'page-9',
                        groupId: 'group-9-basic'
                      },
                      {
                        id: 'q-9-3',
                        number: 3,
                        difficulty: 'medium',
                        questionType: 'short_answer',
                        content: '100 이하의 소수의 개수를 구하시오.',
                        pageId: 'page-9',
                        groupId: 'group-9-basic'
                      }
                    ]
                  },
                  {
                    id: 'group-9-advanced',
                    type: '유형 UP',
                    questions: [
                      {
                        id: 'q-9-4',
                        number: 4,
                        difficulty: 'high',
                        questionType: 'short_answer',
                        content: '두 소수의 곱이 143일 때, 이 두 소수를 구하시오.',
                        pageId: 'page-9',
                        groupId: 'group-9-advanced'
                      },
                      {
                        id: 'q-9-5',
                        number: 5,
                        difficulty: 'high',
                        questionType: 'essay',
                        content: '소수의 정의를 이용하여 17이 소수임을 증명하시오.',
                        pageId: 'page-9',
                        groupId: 'group-9-advanced'
                      }
                    ]
                  }
                ]
              },
              {
                id: 'page-10',
                pageNumber: 10,
                chapterName: '소수와 합성수',
                totalQuestions: 6,
                questionGroups: [
                  {
                    id: 'group-10-practice',
                    type: '실력 UP',
                    questions: [
                      {
                        id: 'q-10-1',
                        number: 1,
                        difficulty: 'medium',
                        questionType: 'multiple_choice',
                        content: '다음 중 소인수분해가 올바른 것은?',
                        pageId: 'page-10',
                        groupId: 'group-10-practice'
                      },
                      {
                        id: 'q-10-2',
                        number: 2,
                        difficulty: 'medium',
                        questionType: 'short_answer',
                        content: '72를 소인수분해하시오.',
                        pageId: 'page-10',
                        groupId: 'group-10-practice'
                      },
                      {
                        id: 'q-10-3',
                        number: 3,
                        difficulty: 'high',
                        questionType: 'short_answer',
                        content: '어떤 수를 소인수분해하면 2³×3²×5가 된다. 이 수는?',
                        pageId: 'page-10',
                        groupId: 'group-10-practice'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'chapter-2',
            name: '소인수 분해',
            pages: [
              {
                id: 'page-11',
                pageNumber: 11,
                chapterName: '소인수 분해',
                totalQuestions: 10,
                questionGroups: [
                  {
                    id: 'group-11-basic',
                    type: '기본 연습',
                    questions: [
                      {
                        id: 'q-11-1',
                        number: 1,
                        difficulty: 'low',
                        questionType: 'short_answer',
                        content: '24를 소인수분해하시오.',
                        pageId: 'page-11',
                        groupId: 'group-11-basic'
                      },
                      {
                        id: 'q-11-2',
                        number: 2,
                        difficulty: 'low',
                        questionType: 'short_answer',
                        content: '36을 소인수분해하시오.',
                        pageId: 'page-11',
                        groupId: 'group-11-basic'
                      }
                    ]
                  },
                  {
                    id: 'group-11-advanced',
                    type: '유형 UP',
                    questions: [
                      {
                        id: 'q-11-3',
                        number: 3,
                        difficulty: 'medium',
                        questionType: 'multiple_choice',
                        content: '2⁴×3²×5의 약수의 개수는?',
                        pageId: 'page-11',
                        groupId: 'group-11-advanced'
                      },
                      {
                        id: 'q-11-4',
                        number: 4,
                        difficulty: 'high',
                        questionType: 'short_answer',
                        content: '어떤 수의 소인수분해에서 소인수가 2, 3, 5이고 약수의 개수가 24개일 때, 가장 작은 수는?',
                        pageId: 'page-11',
                        groupId: 'group-11-advanced'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'textbook-chunjae-math-concept',
        name: '개념플러스유형 - 중등수학2(상)',
        subject: 'math',
        grade: '중2-1',
        publisherId: 'publisher-chunjae',
        chapters: [
          {
            id: 'chapter-concept-1',
            name: '유리수와 순환소수',
            pages: [
              {
                id: 'page-concept-15',
                pageNumber: 15,
                chapterName: '유리수와 순환소수',
                totalQuestions: 12,
                questionGroups: [
                  {
                    id: 'group-concept-15-basic',
                    type: '개념 확인',
                    questions: [
                      {
                        id: 'q-concept-15-1',
                        number: 1,
                        difficulty: 'low',
                        questionType: 'multiple_choice',
                        content: '다음 중 순환소수인 것은?',
                        pageId: 'page-concept-15',
                        groupId: 'group-concept-15-basic'
                      }
                    ]
                  },
                  {
                    id: 'group-concept-15-type',
                    type: '유형 마스터',
                    questions: [
                      {
                        id: 'q-concept-15-2',
                        number: 2,
                        difficulty: 'medium',
                        questionType: 'short_answer',
                        content: '0.363636...을 분수로 나타내시오.',
                        pageId: 'page-concept-15',
                        groupId: 'group-concept-15-type'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'publisher-bisang',
    name: '비상교육',
    textbooks: [
      {
        id: 'textbook-bisang-math-concept',
        name: '개념원리 - 중등수학2(상)',
        subject: 'math',
        grade: '중2-1',
        publisherId: 'publisher-bisang',
        chapters: [
          {
            id: 'chapter-bisang-1',
            name: '유리수와 순환소수',
            pages: [
              {
                id: 'page-bisang-20',
                pageNumber: 20,
                chapterName: '유리수와 순환소수',
                totalQuestions: 8,
                questionGroups: [
                  {
                    id: 'group-bisang-20-concept',
                    type: '개념 원리',
                    questions: [
                      {
                        id: 'q-bisang-20-1',
                        number: 1,
                        difficulty: 'low',
                        questionType: 'multiple_choice',
                        content: '분수를 소수로 나타낼 때 유한소수가 되는 조건은?',
                        pageId: 'page-bisang-20',
                        groupId: 'group-bisang-20-concept'
                      }
                    ]
                  },
                  {
                    id: 'group-bisang-20-apply',
                    type: '적용 연습',
                    questions: [
                      {
                        id: 'q-bisang-20-2',
                        number: 2,
                        difficulty: 'medium',
                        questionType: 'short_answer',
                        content: '7/12를 소수로 나타내시오.',
                        pageId: 'page-bisang-20',
                        groupId: 'group-bisang-20-apply'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// 더미 사용자 데이터
export const dummyUsers: User[] = [
  {
    id: 'teacher-1',
    name: '김선생',
    memberNumber: 'T001',
    role: 'teacher',
    centerName: '하이캠퍼스 강남센터',
    contactInfo: '010-1234-5678'
  },
  {
    id: 'student-1',
    name: '박우수',
    memberNumber: 'S001',
    role: 'student',
    centerName: '하이캠퍼스 강남센터',
    teacherId: 'teacher-1'
  },
  {
    id: 'student-2',
    name: '이학생',
    memberNumber: 'S002',
    role: 'student',
    centerName: '하이캠퍼스 강남센터',
    teacherId: 'teacher-1'
  },
  {
    id: 'student-3',
    name: '최상위',
    memberNumber: 'S003',
    role: 'student',
    centerName: '하이캠퍼스 강남센터',
    teacherId: 'teacher-1'
  },
  {
    id: 'student-4',
    name: '정중위',
    memberNumber: 'S004',
    role: 'student',
    centerName: '하이캠퍼스 강남센터',
    teacherId: 'teacher-1'
  },
  {
    id: 'student-5',
    name: '한기초',
    memberNumber: 'S005',
    role: 'student',
    centerName: '하이캠퍼스 강남센터',
    teacherId: 'teacher-1'
  }
];

// 더미 커리큘럼 데이터 - 새로운 구조
export const dummyCurriculum: Curriculum[] = [
  // 수학 커리큘럼
  {
    id: 'math-1-1',
    subject: 'math',
    grade: '중1',
    semester: '1학기',
    chapters: [
      {
        id: 'chapter-1-1-1',
        name: '수와 연산',
        sections: [
          {
            id: 'section-1-1-1-1',
            name: '자연수와 소수',
            lessons: [
              { id: 'lesson-1-1-1-1-1', name: '자연수의 성질' },
              { id: 'lesson-1-1-1-1-2', name: '소수와 합성수' },
              { id: 'lesson-1-1-1-1-3', name: '최대공약수와 최소공배수' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-1-2',
        name: '문자와 식',
        sections: [
          {
            id: 'section-1-1-2-1',
            name: '문자의 사용과 식의 계산',
            lessons: [
              { id: 'lesson-1-1-2-1-1', name: '문자의 사용' },
              { id: 'lesson-1-1-2-1-2', name: '식의 값' },
              { id: 'lesson-1-1-2-1-3', name: '일차식의 계산' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-1-3',
        name: '좌표평면과 그래프',
        sections: [
          {
            id: 'section-1-1-3-1',
            name: '좌표와 그래프',
            lessons: [
              { id: 'lesson-1-1-3-1-1', name: '순서쌍과 좌표' },
              { id: 'lesson-1-1-3-1-2', name: '그래프와 해석' },
              { id: 'lesson-1-1-3-1-3', name: '정비례와 반비례' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'math-1-2',
    subject: 'math',
    grade: '중1',
    semester: '2학기',
    chapters: [
      {
        id: 'chapter-1-2-1',
        name: '정수와 유리수',
        sections: [
          {
            id: 'section-1-2-1-1',
            name: '정수와 유리수의 개념',
            lessons: [
              { id: 'lesson-1-2-1-1-1', name: '정수의 개념' },
              { id: 'lesson-1-2-1-1-2', name: '유리수의 개념' },
              { id: 'lesson-1-2-1-1-3', name: '수직선과 절댓값' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-2-2',
        name: '일차방정식',
        sections: [
          {
            id: 'section-1-2-2-1',
            name: '방정식의 풀이',
            lessons: [
              { id: 'lesson-1-2-2-1-1', name: '등식의 성질' },
              { id: 'lesson-1-2-2-1-2', name: '일차방정식의 풀이' },
              { id: 'lesson-1-2-2-1-3', name: '방정식의 활용' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-2-3',
        name: '기본 도형',
        sections: [
          {
            id: 'section-1-2-3-1',
            name: '점, 직선, 평면',
            lessons: [
              { id: 'lesson-1-2-3-1-1', name: '점과 직선' },
              { id: 'lesson-1-2-3-1-2', name: '각의 성질' },
              { id: 'lesson-1-2-3-1-3', name: '평행선과 수직선' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'math-2-1',
    subject: 'math',
    grade: '중2',
    semester: '1학기',
    chapters: [
      {
        id: 'chapter-2-1-1',
        name: '유리수와 순환소수',
        sections: [
          {
            id: 'section-2-1-1-1',
            name: '유리수와 소수',
            lessons: [
              { id: 'lesson-2-1-1-1-1', name: '유리수와 순환소수' },
              { id: 'lesson-2-1-1-1-2', name: '순환소수를 분수로 나타내기' },
              { id: 'lesson-2-1-1-1-3', name: '유한소수와 무한소수' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-1-2',
        name: '식의 계산',
        sections: [
          {
            id: 'section-2-1-2-1',
            name: '단항식과 다항식',
            lessons: [
              { id: 'lesson-2-1-2-1-1', name: '지수법칙' },
              { id: 'lesson-2-1-2-1-2', name: '단항식의 계산' },
              { id: 'lesson-2-1-2-1-3', name: '다항식의 계산' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-1-3',
        name: '일차부등식',
        sections: [
          {
            id: 'section-2-1-3-1',
            name: '부등식의 성질',
            lessons: [
              { id: 'lesson-2-1-3-1-1', name: '부등식의 뜻' },
              { id: 'lesson-2-1-3-1-2', name: '일차부등식의 풀이' },
              { id: 'lesson-2-1-3-1-3', name: '부등식의 활용' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'math-2-2',
    subject: 'math',
    grade: '중2',
    semester: '2학기',
    chapters: [
      {
        id: 'chapter-2-2-1',
        name: '연립방정식',
        sections: [
          {
            id: 'section-2-2-1-1',
            name: '연립방정식의 풀이',
            lessons: [
              { id: 'lesson-2-2-1-1-1', name: '연립방정식의 뜻' },
              { id: 'lesson-2-2-1-1-2', name: '가감법과 대입법' },
              { id: 'lesson-2-2-1-1-3', name: '연립방정식의 활용' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-2-2',
        name: '일차함수',
        sections: [
          {
            id: 'section-2-2-2-1',
            name: '일차함수와 그래프',
            lessons: [
              { id: 'lesson-2-2-2-1-1', name: '일차함수의 뜻' },
              { id: 'lesson-2-2-2-1-2', name: '일차함수의 그래프' },
              { id: 'lesson-2-2-2-1-3', name: '일차함수의 활용' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-2-3',
        name: '삼각형의 성질',
        sections: [
          {
            id: 'section-2-2-3-1',
            name: '삼각형의 합동',
            lessons: [
              { id: 'lesson-2-2-3-1-1', name: '삼각형의 합동조건' },
              { id: 'lesson-2-2-3-1-2', name: '이등변삼각형' },
              { id: 'lesson-2-2-3-1-3', name: '직각삼각형' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'math-3-1',
    subject: 'math',
    grade: '중3',
    semester: '1학기',
    chapters: [
      {
        id: 'chapter-3-1-1',
        name: '제곱근과 실수',
        sections: [
          {
            id: 'section-3-1-1-1',
            name: '제곱근의 뜻과 성질',
            lessons: [
              { id: 'lesson-3-1-1-1-1', name: '제곱근의 뜻' },
              { id: 'lesson-3-1-1-1-2', name: '제곱근의 성질' },
              { id: 'lesson-3-1-1-1-3', name: '무리수와 실수' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-1-2',
        name: '이차방정식',
        sections: [
          {
            id: 'section-3-1-2-1',
            name: '이차방정식의 풀이',
            lessons: [
              { id: 'lesson-3-1-2-1-1', name: '이차방정식의 뜻' },
              { id: 'lesson-3-1-2-1-2', name: '인수분해를 이용한 풀이' },
              { id: 'lesson-3-1-2-1-3', name: '근의 공식' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-1-3',
        name: '이차함수',
        sections: [
          {
            id: 'section-3-1-3-1',
            name: '이차함수의 그래프',
            lessons: [
              { id: 'lesson-3-1-3-1-1', name: '이차함수의 뜻' },
              { id: 'lesson-3-1-3-1-2', name: '이차함수의 그래프' },
              { id: 'lesson-3-1-3-1-3', name: '이차함수의 최댓값과 최솟값' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'math-3-2',
    subject: 'math',
    grade: '중3',
    semester: '2학기',
    chapters: [
      {
        id: 'chapter-3-2-1',
        name: '삼각비',
        sections: [
          {
            id: 'section-3-2-1-1',
            name: '삼각비의 뜻과 활용',
            lessons: [
              { id: 'lesson-3-2-1-1-1', name: '삼각비의 뜻' },
              { id: 'lesson-3-2-1-1-2', name: '삼각비의 값' },
              { id: 'lesson-3-2-1-1-3', name: '삼각비의 활용' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-2-2',
        name: '원의 성질',
        sections: [
          {
            id: 'section-3-2-2-1',
            name: '원주각과 중심각',
            lessons: [
              { id: 'lesson-3-2-2-1-1', name: '원주각의 성질' },
              { id: 'lesson-3-2-2-1-2', name: '원에 내접하는 사각형' },
              { id: 'lesson-3-2-2-1-3', name: '원과 직선' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-2-3',
        name: '통계',
        sections: [
          {
            id: 'section-3-2-3-1',
            name: '대푯값과 산포도',
            lessons: [
              { id: 'lesson-3-2-3-1-1', name: '대푯값' },
              { id: 'lesson-3-2-3-1-2', name: '산포도' },
              { id: 'lesson-3-2-3-1-3', name: '상관관계' }
            ]
          }
        ]
      }
    ]
  },
  // 영어 커리큘럼
  {
    id: 'english-1-1',
    subject: 'english',
    grade: '중1',
    semester: '1학기',
    chapters: [
      {
        id: 'chapter-1-1-1',
        name: 'Basic Grammar',
        sections: [
          {
            id: 'section-1-1-1-1',
            name: 'Be Verbs and Basic Sentences',
            lessons: [
              { id: 'lesson-1-1-1-1-1', name: 'Be Verbs (am, is, are)' },
              { id: 'lesson-1-1-1-1-2', name: 'Basic Sentence Structure' },
              { id: 'lesson-1-1-1-1-3', name: 'Questions and Answers' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-1-2',
        name: 'Nouns and Pronouns',
        sections: [
          {
            id: 'section-1-1-2-1',
            name: 'Types of Nouns and Pronouns',
            lessons: [
              { id: 'lesson-1-1-2-1-1', name: 'Countable and Uncountable Nouns' },
              { id: 'lesson-1-1-2-1-2', name: 'Personal Pronouns' },
              { id: 'lesson-1-1-2-1-3', name: 'Possessive Pronouns' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-1-3',
        name: 'Articles and Adjectives',
        sections: [
          {
            id: 'section-1-1-3-1',
            name: 'Articles and Descriptive Words',
            lessons: [
              { id: 'lesson-1-1-3-1-1', name: 'Articles (a, an, the)' },
              { id: 'lesson-1-1-3-1-2', name: 'Descriptive Adjectives' },
              { id: 'lesson-1-1-3-1-3', name: 'Adjective Order' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'english-1-2',
    subject: 'english',
    grade: '중1',
    semester: '2학기',
    chapters: [
      {
        id: 'chapter-1-2-1',
        name: 'Present Tense',
        sections: [
          {
            id: 'section-1-2-1-1',
            name: 'Simple Present',
            lessons: [
              { id: 'lesson-1-2-1-1-1', name: 'Present Tense Verbs' },
              { id: 'lesson-1-2-1-1-2', name: 'Daily Routines' },
              { id: 'lesson-1-2-1-1-3', name: 'Frequency Adverbs' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-2-2',
        name: 'Past Tense',
        sections: [
          {
            id: 'section-1-2-2-1',
            name: 'Simple Past',
            lessons: [
              { id: 'lesson-1-2-2-1-1', name: 'Regular and Irregular Verbs' },
              { id: 'lesson-1-2-2-1-2', name: 'Past Tense Questions' },
              { id: 'lesson-1-2-2-1-3', name: 'Time Expressions' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-2-3',
        name: 'Prepositions and Directions',
        sections: [
          {
            id: 'section-1-2-3-1',
            name: 'Location and Movement',
            lessons: [
              { id: 'lesson-1-2-3-1-1', name: 'Prepositions of Place' },
              { id: 'lesson-1-2-3-1-2', name: 'Prepositions of Time' },
              { id: 'lesson-1-2-3-1-3', name: 'Giving Directions' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'english-2-1',
    subject: 'english',
    grade: '중2',
    semester: '1학기',
    chapters: [
      {
        id: 'chapter-2-1-1',
        name: 'Perfect Tenses',
        sections: [
          {
            id: 'section-2-1-1-1',
            name: 'Present Perfect',
            lessons: [
              { id: 'lesson-2-1-1-1-1', name: 'Present Perfect Tense' },
              { id: 'lesson-2-1-1-1-2', name: 'Present Perfect vs Past Simple' },
              { id: 'lesson-2-1-1-1-3', name: 'Experience and Duration' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-1-2',
        name: 'Future Tenses',
        sections: [
          {
            id: 'section-2-1-2-1',
            name: 'Future Forms',
            lessons: [
              { id: 'lesson-2-1-2-1-1', name: 'Will vs Going to' },
              { id: 'lesson-2-1-2-1-2', name: 'Future Plans and Predictions' },
              { id: 'lesson-2-1-2-1-3', name: 'Present Continuous for Future' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-1-3',
        name: 'Comparative and Superlative',
        sections: [
          {
            id: 'section-2-1-3-1',
            name: 'Comparison Forms',
            lessons: [
              { id: 'lesson-2-1-3-1-1', name: 'Comparative Adjectives' },
              { id: 'lesson-2-1-3-1-2', name: 'Superlative Adjectives' },
              { id: 'lesson-2-1-3-1-3', name: 'Irregular Comparisons' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'english-2-2',
    subject: 'english',
    grade: '중2',
    semester: '2학기',
    chapters: [
      {
        id: 'chapter-2-2-1',
        name: 'Modal Verbs',
        sections: [
          {
            id: 'section-2-2-1-1',
            name: 'Modal Verbs Usage',
            lessons: [
              { id: 'lesson-2-2-1-1-1', name: 'Modal Verbs (can, should, must)' },
              { id: 'lesson-2-2-1-1-2', name: 'Giving Advice and Suggestions' },
              { id: 'lesson-2-2-1-1-3', name: 'Permission and Obligation' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-2-2',
        name: 'Infinitives and Gerunds',
        sections: [
          {
            id: 'section-2-2-2-1',
            name: 'Verb Forms',
            lessons: [
              { id: 'lesson-2-2-2-1-1', name: 'To-infinitive Usage' },
              { id: 'lesson-2-2-2-1-2', name: 'Gerund Usage' },
              { id: 'lesson-2-2-2-1-3', name: 'Infinitive vs Gerund' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-2-3',
        name: 'Question Forms',
        sections: [
          {
            id: 'section-2-2-3-1',
            name: 'Advanced Questions',
            lessons: [
              { id: 'lesson-2-2-3-1-1', name: 'Wh-questions' },
              { id: 'lesson-2-2-3-1-2', name: 'Tag Questions' },
              { id: 'lesson-2-2-3-1-3', name: 'Indirect Questions' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'english-3-1',
    subject: 'english',
    grade: '중3',
    semester: '1학기',
    chapters: [
      {
        id: 'chapter-3-1-1',
        name: 'Passive Voice',
        sections: [
          {
            id: 'section-3-1-1-1',
            name: 'Passive Voice Structure',
            lessons: [
              { id: 'lesson-3-1-1-1-1', name: 'Passive Voice (Present & Past)' },
              { id: 'lesson-3-1-1-1-2', name: 'By + Agent in Passive Voice' },
              { id: 'lesson-3-1-1-1-3', name: 'Active vs Passive Voice' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-1-2',
        name: 'Relative Clauses',
        sections: [
          {
            id: 'section-3-1-2-1',
            name: 'Relative Pronouns and Clauses',
            lessons: [
              { id: 'lesson-3-1-2-1-1', name: 'Who, Which, That' },
              { id: 'lesson-3-1-2-1-2', name: 'Defining vs Non-defining Clauses' },
              { id: 'lesson-3-1-2-1-3', name: 'Relative Adverbs' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-1-3',
        name: 'Conditional Sentences',
        sections: [
          {
            id: 'section-3-1-3-1',
            name: 'If Clauses',
            lessons: [
              { id: 'lesson-3-1-3-1-1', name: 'First Conditional' },
              { id: 'lesson-3-1-3-1-2', name: 'Second Conditional' },
              { id: 'lesson-3-1-3-1-3', name: 'Unless and Other Conditionals' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'english-3-2',
    subject: 'english',
    grade: '중3',
    semester: '2학기',
    chapters: [
      {
        id: 'chapter-3-2-1',
        name: 'Reported Speech',
        sections: [
          {
            id: 'section-3-2-1-1',
            name: 'Direct and Indirect Speech',
            lessons: [
              { id: 'lesson-3-2-1-1-1', name: 'Reporting Statements' },
              { id: 'lesson-3-2-1-1-2', name: 'Reporting Questions' },
              { id: 'lesson-3-2-1-1-3', name: 'Reporting Commands' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-2-2',
        name: 'Advanced Grammar',
        sections: [
          {
            id: 'section-3-2-2-1',
            name: 'Complex Structures',
            lessons: [
              { id: 'lesson-3-2-2-1-1', name: 'Subjunctive Mood' },
              { id: 'lesson-3-2-2-1-2', name: 'Emphatic Structures' },
              { id: 'lesson-3-2-2-1-3', name: 'Inversion' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-2-3',
        name: 'Reading and Writing Skills',
        sections: [
          {
            id: 'section-3-2-3-1',
            name: 'Advanced Reading and Writing',
            lessons: [
              { id: 'lesson-3-2-3-1-1', name: 'Reading Comprehension Strategies' },
              { id: 'lesson-3-2-3-1-2', name: 'Essay Writing' },
              { id: 'lesson-3-2-3-1-3', name: 'Critical Thinking' }
            ]
          }
        ]
      }
    ]
  },
  // 국어 커리큘럼
  {
    id: 'korean-1-1',
    subject: 'korean',
    grade: '중1',
    semester: '1학기',
    chapters: [
      {
        id: 'chapter-1-1-1',
        name: '문학의 기초',
        sections: [
          {
            id: 'section-1-1-1-1',
            name: '시와 산문',
            lessons: [
              { id: 'lesson-1-1-1-1-1', name: '시의 특성과 갈래' },
              { id: 'lesson-1-1-1-1-2', name: '산문의 특성과 갈래' },
              { id: 'lesson-1-1-1-1-3', name: '문학의 기능과 가치' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-1-2',
        name: '읽기와 쓰기의 기초',
        sections: [
          {
            id: 'section-1-1-2-1',
            name: '글의 구조와 전개',
            lessons: [
              { id: 'lesson-1-1-2-1-1', name: '글의 짜임과 구성' },
              { id: 'lesson-1-1-2-1-2', name: '문단의 구조' },
              { id: 'lesson-1-1-2-1-3', name: '글의 전개 방식' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-1-3',
        name: '음성 언어와 문자 언어',
        sections: [
          {
            id: 'section-1-1-3-1',
            name: '듣기와 말하기',
            lessons: [
              { id: 'lesson-1-1-3-1-1', name: '효과적인 듣기' },
              { id: 'lesson-1-1-3-1-2', name: '상황에 맞는 말하기' },
              { id: 'lesson-1-1-3-1-3', name: '토론과 토의' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'korean-1-2',
    subject: 'korean',
    grade: '중1',
    semester: '2학기',
    chapters: [
      {
        id: 'chapter-1-2-1',
        name: '언어의 본질',
        sections: [
          {
            id: 'section-1-2-1-1',
            name: '언어의 특성',
            lessons: [
              { id: 'lesson-1-2-1-1-1', name: '언어의 기능' },
              { id: 'lesson-1-2-1-1-2', name: '언어의 특성' },
              { id: 'lesson-1-2-1-1-3', name: '국어의 특질' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-2-2',
        name: '문학 작품의 이해',
        sections: [
          {
            id: 'section-1-2-2-1',
            name: '서정 갈래와 서사 갈래',
            lessons: [
              { id: 'lesson-1-2-2-1-1', name: '서정 문학의 특성' },
              { id: 'lesson-1-2-2-1-2', name: '서사 문학의 특성' },
              { id: 'lesson-1-2-2-1-3', name: '갈래별 표현 기법' }
            ]
          }
        ]
      },
      {
        id: 'chapter-1-2-3',
        name: '한글의 창제 원리',
        sections: [
          {
            id: 'section-1-2-3-1',
            name: '훈민정음의 제자 원리',
            lessons: [
              { id: 'lesson-1-2-3-1-1', name: '자음자의 제자 원리' },
              { id: 'lesson-1-2-3-1-2', name: '모음자의 제자 원리' },
              { id: 'lesson-1-2-3-1-3', name: '한글의 우수성' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'korean-2-1',
    subject: 'korean',
    grade: '중2',
    semester: '1학기',
    chapters: [
      {
        id: 'chapter-2-1-1',
        name: '문학의 즐거움',
        sections: [
          {
            id: 'section-2-1-1-1',
            name: '시의 화자와 상황',
            lessons: [
              { id: 'lesson-2-1-1-1-1', name: '화자의 정서와 상황 이해' },
              { id: 'lesson-2-1-1-1-2', name: '시어와 시구의 함축적 의미' },
              { id: 'lesson-2-1-1-1-3', name: '시상 전개와 주제 의식' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-1-2',
        name: '소설의 구성 요소',
        sections: [
          {
            id: 'section-2-1-2-1',
            name: '인물과 배경, 사건',
            lessons: [
              { id: 'lesson-2-1-2-1-1', name: '인물의 성격과 심리' },
              { id: 'lesson-2-1-2-1-2', name: '배경의 의미와 기능' },
              { id: 'lesson-2-1-2-1-3', name: '사건의 전개와 갈등' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-1-3',
        name: '설득하는 글쓰기',
        sections: [
          {
            id: 'section-2-1-3-1',
            name: '논증의 구조와 방법',
            lessons: [
              { id: 'lesson-2-1-3-1-1', name: '주장과 근거' },
              { id: 'lesson-2-1-3-1-2', name: '논증 방법' },
              { id: 'lesson-2-1-3-1-3', name: '반박과 재반박' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'korean-2-2',
    subject: 'korean',
    grade: '중2',
    semester: '2학기',
    chapters: [
      {
        id: 'chapter-2-2-1',
        name: '정보를 전달하는 글',
        sections: [
          {
            id: 'section-2-2-1-1',
            name: '설명하는 글의 구조',
            lessons: [
              { id: 'lesson-2-2-1-1-1', name: '설명 방법과 구조' },
              { id: 'lesson-2-2-1-1-2', name: '핵심 정보 파악하기' },
              { id: 'lesson-2-2-1-1-3', name: '매체 언어의 특성' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-2-2',
        name: '문법 요소의 이해',
        sections: [
          {
            id: 'section-2-2-2-1',
            name: '단어의 형성과 품사',
            lessons: [
              { id: 'lesson-2-2-2-1-1', name: '단어의 형성 방법' },
              { id: 'lesson-2-2-2-1-2', name: '품사의 분류' },
              { id: 'lesson-2-2-2-1-3', name: '품사의 통용' }
            ]
          }
        ]
      },
      {
        id: 'chapter-2-2-3',
        name: '고전 문학의 이해',
        sections: [
          {
            id: 'section-2-2-3-1',
            name: '고전 시가와 고전 산문',
            lessons: [
              { id: 'lesson-2-2-3-1-1', name: '고전 시가의 특성' },
              { id: 'lesson-2-2-3-1-2', name: '고전 소설의 특성' },
              { id: 'lesson-2-2-3-1-3', name: '고전 문학의 현대적 의의' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'korean-3-1',
    subject: 'korean',
    grade: '중3',
    semester: '1학기',
    chapters: [
      {
        id: 'chapter-3-1-1',
        name: '언어의 탐구',
        sections: [
          {
            id: 'section-3-1-1-1',
            name: '품사의 분류',
            lessons: [
              { id: 'lesson-3-1-1-1-1', name: '품사의 개념과 분류 기준' },
              { id: 'lesson-3-1-1-1-2', name: '품사별 특성과 기능' },
              { id: 'lesson-3-1-1-1-3', name: '어휘의 의미 관계' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-1-2',
        name: '문학의 수용과 생산',
        sections: [
          {
            id: 'section-3-1-2-1',
            name: '문학 작품의 해석',
            lessons: [
              { id: 'lesson-3-1-2-1-1', name: '작품의 내재적 의미' },
              { id: 'lesson-3-1-2-1-2', name: '작품의 외재적 의미' },
              { id: 'lesson-3-1-2-1-3', name: '비판적 문학 읽기' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-1-3',
        name: '매체 언어와 국어 생활',
        sections: [
          {
            id: 'section-3-1-3-1',
            name: '매체의 특성과 언어 사용',
            lessons: [
              { id: 'lesson-3-1-3-1-1', name: '매체별 언어 특성' },
              { id: 'lesson-3-1-3-1-2', name: '매체 언어의 영향' },
              { id: 'lesson-3-1-3-1-3', name: '바른 국어 생활' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'korean-3-2',
    subject: 'korean',
    grade: '중3',
    semester: '2학기',
    chapters: [
      {
        id: 'chapter-3-2-1',
        name: '문학과 삶',
        sections: [
          {
            id: 'section-3-2-1-1',
            name: '문학 작품의 수용과 생산',
            lessons: [
              { id: 'lesson-3-2-1-1-1', name: '문학 작품의 해석과 감상' },
              { id: 'lesson-3-2-1-1-2', name: '문학 작품의 창작' },
              { id: 'lesson-3-2-1-1-3', name: '문학과 현실의 관계' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-2-2',
        name: '문장의 구조와 의미',
        sections: [
          {
            id: 'section-3-2-2-1',
            name: '문장 성분과 문장 구조',
            lessons: [
              { id: 'lesson-3-2-2-1-1', name: '문장 성분의 종류와 기능' },
              { id: 'lesson-3-2-2-1-2', name: '문장의 짜임' },
              { id: 'lesson-3-2-2-1-3', name: '문장의 의미 관계' }
            ]
          }
        ]
      },
      {
        id: 'chapter-3-2-3',
        name: '화법과 작문',
        sections: [
          {
            id: 'section-3-2-3-1',
            name: '상황에 맞는 표현',
            lessons: [
              { id: 'lesson-3-2-3-1-1', name: '화법의 상황과 맥락' },
              { id: 'lesson-3-2-3-1-2', name: '작문의 과정과 전략' },
              { id: 'lesson-3-2-3-1-3', name: '효과적인 의사소통' }
            ]
          }
        ]
      }
    ]
  }
];

// 체계적인 더미 문제 데이터 생성 함수
const generateSystematicQuestions = (): Question[] => {
  const questions: Question[] = [];
  const subjects: Subject[] = ['math', 'english', 'korean'];
  const grades = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];
  const difficulties: Difficulty[] = ['low', 'medium', 'high', 'highest'];
  const sources: QuestionSource[] = ['internal', 'textbook', 'school_exam'];
  const types: QuestionType[] = ['multiple_choice', 'short_answer'];
  
  // 과목별 문제 내용 템플릿 (확장)
  const contentTemplates = {
    math: [
      '다음 중 순환소수가 아닌 것은?',
      '순환소수를 분수로 나타내시오',
      '다음 식을 계산하시오',
      '부등식을 풀어라',
      '지수법칙을 이용하여 계산하시오',
      '단항식의 곱셈을 계산하시오',
      '다항식의 덧셈을 계산하시오',
      '다항식의 뺄셈을 계산하시오',
      '다항식의 곱셈을 전개하시오',
      '부등식의 성질을 이용하여 풀이하시오',
      '이차방정식을 풀어라',
      '함수의 그래프를 그려라',
      '확률을 구하시오',
      '통계 자료를 분석하시오',
      '기하 도형의 넓이를 구하시오',
      '연립방정식을 풀어라',
      '인수분해를 완성하시오',
      '근과 계수의 관계를 이용하시오',
      '삼각형의 합동조건을 찾으시오',
      '원의 성질을 이용하여 각도를 구하시오',
      '피타고라스 정리를 적용하시오',
      '닮음비를 구하시오',
      '평행선의 성질을 이용하시오',
      '중점연결정리를 적용하시오',
      '이차함수의 최댓값을 구하시오'
    ],
    english: [
      'Choose the correct sentence using Present Perfect tense',
      'Fill in the blank with the appropriate modal verb',
      'Change the sentence to passive voice',
      'Choose the best word to complete the sentence',
      'Read the passage and answer the question',
      'Choose the correct form of the verb',
      'Complete the dialogue with appropriate responses',
      'Choose the word with the same meaning',
      'Find the grammatical error in the sentence',
      'Choose the correct preposition',
      'Identify the main idea of the paragraph',
      'Complete the conditional sentence',
      'Choose the correct relative pronoun',
      'Rewrite the sentence using reported speech',
      'Select the appropriate conjunction',
      'Choose the correct article (a, an, the)',
      'Complete the sentence with the correct tense',
      'Identify the subject and predicate',
      'Choose the correct comparative form',
      'Complete the sentence with gerund or infinitive',
      'Choose the appropriate phrasal verb',
      'Identify the type of sentence structure',
      'Complete the sentence with correct word order',
      'Choose the synonym for the underlined word',
      'Select the appropriate transition word'
    ],
    korean: [
      '다음 시에서 화자의 정서를 파악하시오',
      '소설에서 인물 간의 갈등을 분석하시오',
      '설명문의 구조와 방법을 파악하시오',
      '품사를 올바르게 분류하시오',
      '매체 언어의 특성을 설명하시오',
      '문학 작품의 주제 의식을 파악하시오',
      '어휘의 의미 관계를 분석하시오',
      '문장의 구조를 분석하시오',
      '표현 기법과 그 효과를 설명하시오',
      '글의 논리적 구조를 파악하시오',
      '한글 맞춤법을 적용하시오',
      '문학사의 흐름을 파악하시오',
      '작가의 의식과 세계관을 분석하시오',
      '비문학 텍스트의 논증 구조를 파악하시오',
      '언어의 변화 양상을 설명하시오',
      '시상 전개 과정을 분석하시오',
      '인물의 성격과 심리를 파악하시오',
      '갈래와 성격을 분석하시오',
      '화법과 작문의 특성을 파악하시오',
      '문학 갈래의 특징을 설명하시오',
      '운율과 리듬감을 분석하시오',
      '서술자와 시점을 파악하시오',
      '문체와 어조를 분석하시오',
      '상징과 함축 의미를 파악하시오',
      '문학사적 의의를 설명하시오'
    ]
  };

  // 과목별 태그 템플릿 (확장)
  const tagTemplates = {
    math: [
      ['순환소수', '유한소수', '수와 연산'],
      ['지수법칙', '단항식', '식의 계산'],
      ['일차부등식', '부등식의 성질', '부등식'],
      ['다항식', '전개', '인수분해'],
      ['이차방정식', '근의 공식', '방정식'],
      ['함수', '그래프', '좌표평면'],
      ['확률', '경우의 수', '통계'],
      ['기하', '도형', '넓이'],
      ['피타고라스 정리', '삼각형', '직각삼각형'],
      ['원', '원주각', '중심각'],
      ['연립방정식', '해법', '방정식'],
      ['인수분해', '공식', '식의 계산'],
      ['근과 계수', '이차방정식', '관계'],
      ['합동', '삼각형', '증명'],
      ['닮음', '비례', '도형'],
      ['평행선', '각', '성질'],
      ['중점연결정리', '삼각형', '기하'],
      ['이차함수', '최댓값', '함수'],
      ['통계', '확률', '자료분석'],
      ['무리수', '실수', '수와 연산']
    ],
    english: [
      ['Present Perfect', '시제', '문법'],
      ['Modal Verbs', '조동사', '문법'],
      ['Passive Voice', '수동태', '문법변환'],
      ['Vocabulary', '어휘', '단어'],
      ['Reading Comprehension', '독해', '이해'],
      ['Grammar', '문법', '구조'],
      ['Dialogue', '대화', '의사소통'],
      ['Conditional', '조건문', '가정법'],
      ['Relative Clause', '관계사', '문법'],
      ['Reported Speech', '간접화법', '화법'],
      ['Articles', '관사', '문법'],
      ['Tenses', '시제', '동사'],
      ['Sentence Structure', '문장구조', '구문'],
      ['Comparison', '비교급', '형용사'],
      ['Gerund Infinitive', '동명사', '부정사'],
      ['Phrasal Verbs', '구동사', '어휘'],
      ['Word Order', '어순', '문법'],
      ['Synonyms', '동의어', '어휘'],
      ['Transitions', '연결어', '구문'],
      ['Prepositions', '전치사', '문법']
    ],
    korean: [
      ['현대시', '화자의 정서', '문학'],
      ['소설', '갈등', '인물 분석'],
      ['설명문', '설명 방법', '구조'],
      ['품사', '문법', '언어'],
      ['매체 언어', '언어의 특성', '소통'],
      ['문학', '주제 의식', '작품 분석'],
      ['어휘', '의미 관계', '언어'],
      ['문장 구조', '문법', '언어'],
      ['표현 기법', '문학', '효과'],
      ['논리 구조', '독해', '이해'],
      ['맞춤법', '어법', '언어규범'],
      ['문학사', '흐름', '역사'],
      ['작가 의식', '세계관', '문학'],
      ['논증 구조', '비문학', '독해'],
      ['언어 변화', '국어사', '언어'],
      ['시상 전개', '현대시', '구성'],
      ['인물 심리', '소설', '분석'],
      ['갈래 성격', '문학', '장르'],
      ['화법 작문', '의사소통', '표현'],
      ['운율 리듬', '시', '음성언어']
    ]
  };

  let questionId = 1;
  
  subjects.forEach(subject => {
    // 각 과목별로 400문제씩 생성
    // 난이도별로 100문제씩 균등 배분 (하 100, 중 100, 상 100, 최상 100)
    difficulties.forEach(difficulty => {
      // 각 난이도별로 100문제 생성
      for (let i = 1; i <= 100; i++) {
        // 학기별로 고르게 분산 (6학기 × 약 17문제)
        const gradeIndex = Math.floor((i - 1) / 17) % grades.length;
        const grade = grades[gradeIndex];
        
        const sourceIndex = Math.floor(Math.random() * sources.length);
        const source = sources[sourceIndex];
        const type = types[Math.floor(Math.random() * types.length)];
        
        // 정답률 설정 (난이도별)
        let correctRate = 50;
        switch (difficulty) {
          case 'low': correctRate = Math.floor(Math.random() * 20) + 80; break;
          case 'medium': correctRate = Math.floor(Math.random() * 20) + 60; break;
          case 'high': correctRate = Math.floor(Math.random() * 20) + 40; break;
          case 'highest': correctRate = Math.floor(Math.random() * 20) + 20; break;
        }
        
        // 문제 내용과 태그 선택
        const contents = contentTemplates[subject];
        const tags = tagTemplates[subject];
        const contentIndex = Math.floor(Math.random() * contents.length);
        const tagIndex = Math.floor(Math.random() * tags.length);
        
        const question: Question = {
          id: `${subject}-${difficulty}-${String(i).padStart(3, '0')}`,
          subject,
          content: contents[contentIndex],
          type,
          difficulty,
          source,
          curriculum: {
            chapterId: `chapter-${grade}`,
            sectionId: `section-${grade}-${Math.ceil(i/10)}`, // 10문제마다 새 섹션
            lessonId: `lesson-${grade}-${Math.ceil(i/10)}-${((i-1)%10)+1}`
          },
          correctAnswer: type === 'multiple_choice' ? '정답' : `답${questionId}`,
          explanation: `${subject} ${grade} ${difficulty} 문제 ${i}의 해설입니다.`,
          correctRate,
          tags: [...tags[tagIndex]],
          similarQuestions: []
        };
        
        if (question.type === 'multiple_choice') {
          question.choices = ['선택지1', '정답', '선택지3', '선택지4'];
        }
        
        if (source === 'textbook') {
          question.sourceInfo = { textbookName: `${subject} 교재 ${grade}` };
        } else if (source === 'school_exam') {
          question.sourceInfo = { 
            schoolName: '테스트중학교', 
            examYear: 2024, 
            examType: Math.random() > 0.5 ? '중간고사' : '기말고사' 
          };
        }
        
        questions.push(question);
        questionId++;
      }
    });
  });
  
  return questions;
};

// 더미 문제 데이터 생성
const systematicQuestions = generateSystematicQuestions();

console.log('체계적으로 생성된 총 문제 수:', systematicQuestions.length);
console.log('수학 문제 수:', systematicQuestions.filter(q => q.subject === 'math').length);
console.log('영어 문제 수:', systematicQuestions.filter(q => q.subject === 'english').length);
console.log('국어 문제 수:', systematicQuestions.filter(q => q.subject === 'korean').length);

export const dummyQuestions: Question[] = [
  // 기존 샘플 문제들 (참고용) - 새로운 커리큘럼 구조로 수정
  {
    id: 'sample-math-1',
    subject: 'math',
    content: '다음 중 순환소수가 아닌 것은?',
    type: 'multiple_choice',
    difficulty: 'medium',
    source: 'internal',
    curriculum: {
      chapterId: 'chapter-2-1',
      sectionId: 'section-2-1-1',
      lessonId: 'lesson-2-1-1-1'
    },
    choices: ['0.333...', '0.25', '0.121212...', '0.777...'],
    correctAnswer: '0.25',
    explanation: '0.25는 유한소수이므로 순환소수가 아닙니다.',
    correctRate: 75,
    tags: ['순환소수', '유한소수'],
    similarQuestions: []
  },
  {
    id: 'sample-math-2',
    subject: 'math',
    content: '순환소수 0.363636...을 분수로 나타내면?',
    type: 'multiple_choice',
    difficulty: 'high',
    source: 'textbook',
    sourceInfo: {
      textbookName: '최상위 수학'
    },
    curriculum: {
      chapterId: 'chapter-2-1',
      sectionId: 'section-2-1-1',
      lessonId: 'lesson-2-1-1-2'
    },
    choices: ['4/11', '36/99', '4/9', '36/100'],
    correctAnswer: '4/11',
    explanation: '0.363636... = 36/99 = 4/11입니다.',
    correctRate: 45,
    tags: ['순환소수', '분수변환', '상위권'],
    similarQuestions: []
  },
  {
    id: 'sample-english-1',
    subject: 'english',
    content: 'Choose the correct sentence using Present Perfect tense.',
    type: 'multiple_choice',
    difficulty: 'medium',
    source: 'internal',
    curriculum: {
      chapterId: 'chapter-2-1',
      sectionId: 'section-2-1-1',
      lessonId: 'lesson-2-1-1-1'
    },
    choices: [
      'I went to London last year.',
      'I have been to London.',
      'I am going to London.',
      'I will go to London.'
    ],
    correctAnswer: 'I have been to London.',
    explanation: 'Present Perfect는 "have/has + 과거분사" 형태로 경험을 나타낼 때 사용합니다.',
    correctRate: 78,
    tags: ['Present Perfect', '시제', '문법'],
    similarQuestions: []
  },
  {
    id: 'sample-korean-1',
    subject: 'korean',
    content: '다음 시에서 화자의 정서를 가장 잘 나타낸 것은?',
    type: 'multiple_choice',
    difficulty: 'medium',
    source: 'internal',
    curriculum: {
      chapterId: 'chapter-2-1',
      sectionId: 'section-2-1-1',
      lessonId: 'lesson-2-1-1-1'
    },
    choices: ['슬픔과 애상', '기쁨과 환희', '평온과 초월', '분노와 저항'],
    correctAnswer: '평온과 초월',
    explanation: '반복적 표현과 시간을 초월한 영원성을 통해 평온하고 초월적인 정서를 드러냅니다.',
    correctRate: 72,
    tags: ['현대시', '화자의 정서', '문학'],
    similarQuestions: []
  },
  // 체계적으로 생성된 문제들 추가
  ...systematicQuestions
];

// 더미 폴더 데이터
export const dummyFolders: Folder[] = [
  {
    id: 'folder-1',
    name: '상위권 특화',
    teacherId: 'teacher-1',
    isShared: false,
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'folder-2',
    name: '중간고사 대비',
    teacherId: 'teacher-1',
    isShared: true,
    createdAt: '2024-02-01T10:30:00Z'
  },
  {
    id: 'folder-3',
    name: '기초 다지기',
    teacherId: 'teacher-1',
    isShared: false,
    createdAt: '2024-02-10T14:20:00Z'
  }
];

// 더미 학습지 데이터
export const dummyWorksheets: Worksheet[] = [
  {
    id: 'worksheet-1761629960844',
    title: '중2-1 유리수와 순환소수 종합 학습지',
    description: '유리수와 순환소수의 기본 개념부터 응용까지 다루는 종합 학습지입니다.',
    subject: 'math',
    teacherId: 'teacher-1',
    status: 'published',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    tags: ['기본', '중간고사 대비', '종합'],
    folderId: 'folder-3',
    qrCode: 'enabled',
    // step3에서 설정한 추가 정보들
    worksheetSettings: {
      grade: '중2',
      creator: '김선생',
      layout: 'single',
      includeAnswers: true,
      includeExplanations: true,
      qrEnabled: true
    },
    questions: [
      {
        id: 'q-math-001',
        subject: 'math',
        content: '다음 중 순환소수가 아닌 것은?',
        type: 'multiple_choice',
        difficulty: 'low',
        source: 'internal',
        curriculum: {
          chapterId: 'chapter-2-1',
          sectionId: 'section-2-1-1',
          lessonId: 'lesson-2-1-1-1'
        },
        choices: ['0.333...', '0.25', '0.121212...', '0.777...'],
        correctAnswer: '0.25',
        explanation: '0.25는 유한소수이므로 순환소수가 아닙니다.',
        correctRate: 85,
        tags: ['순환소수', '유한소수', '기본개념'],
        similarQuestions: []
      },
      {
        id: 'q-math-002',
        subject: 'math',
        content: '순환소수 0.363636...을 분수로 나타내면?',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'textbook',
        sourceInfo: {
          textbookName: '중학수학 2-1'
        },
        curriculum: {
          chapterId: 'chapter-2-1',
          sectionId: 'section-2-1-1',
          lessonId: 'lesson-2-1-1-2'
        },
        choices: ['4/11', '36/99', '4/9', '36/100'],
        correctAnswer: '4/11',
        explanation: '0.363636... = 36/99 = 4/11입니다.',
        correctRate: 65,
        tags: ['순환소수', '분수변환'],
        similarQuestions: []
      },
      {
        id: 'q-math-003',
        subject: 'math',
        content: '분수 5/6을 소수로 나타내면?',
        type: 'short_answer',
        difficulty: 'low',
        source: 'internal',
        curriculum: {
          chapterId: 'chapter-2-1',
          sectionId: 'section-2-1-1',
          lessonId: 'lesson-2-1-1-1'
        },
        correctAnswer: '0.8333... 또는 0.83̄',
        explanation: '5÷6 = 0.8333...로 순환소수입니다.',
        correctRate: 78,
        tags: ['분수', '소수변환'],
        similarQuestions: []
      },
      {
        id: 'q-math-004',
        subject: 'math',
        content: '다음 중 유한소수로 나타낼 수 있는 분수는?',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'school_exam',
        sourceInfo: {
          schoolName: '서울중학교',
          examYear: 2024,
          examType: '중간고사'
        },
        curriculum: {
          chapterId: 'chapter-2-1',
          sectionId: 'section-2-1-1',
          lessonId: 'lesson-2-1-1-3'
        },
        choices: ['3/7', '5/12', '2/15', '7/20'],
        correctAnswer: '7/20',
        explanation: '분모가 2^a × 5^b 꼴일 때만 유한소수가 됩니다. 20 = 2² × 5이므로 7/20은 유한소수입니다.',
        correctRate: 58,
        tags: ['유한소수', '분수', '조건'],
        similarQuestions: []
      },
      {
        id: 'q-math-005',
        subject: 'math',
        content: '순환소수 0.142857142857...을 분수로 나타내시오.',
        type: 'short_answer',
        difficulty: 'high',
        source: 'textbook',
        sourceInfo: {
          textbookName: '최상위 수학 2-1'
        },
        curriculum: {
          chapterId: 'chapter-2-1',
          sectionId: 'section-2-1-1',
          lessonId: 'lesson-2-1-1-2'
        },
        correctAnswer: '1/7',
        explanation: '순환마디가 142857이므로 x = 0.142857..., 1000000x = 142857.142857..., 999999x = 142857, x = 142857/999999 = 1/7',
        correctRate: 42,
        tags: ['순환소수', '분수변환', '심화'],
        similarQuestions: []
      },
      {
        id: 'q-math-006',
        subject: 'math',
        content: '두 유리수 2/3과 3/4의 합을 기약분수로 나타내면?',
        type: 'multiple_choice',
        difficulty: 'low',
        source: 'internal',
        curriculum: {
          chapterId: 'chapter-2-1',
          sectionId: 'section-2-1-1',
          lessonId: 'lesson-2-1-1-1'
        },
        choices: ['5/7', '17/12', '6/12', '8/12'],
        correctAnswer: '17/12',
        explanation: '2/3 + 3/4 = 8/12 + 9/12 = 17/12입니다.',
        correctRate: 82,
        tags: ['유리수', '덧셈', '기약분수'],
        similarQuestions: []
      },
      {
        id: 'q-math-007',
        subject: 'math',
        content: '다음 식을 계산하시오: (-2/3) × (3/4) ÷ (-1/2)',
        type: 'short_answer',
        difficulty: 'medium',
        source: 'internal',
        curriculum: {
          chapterId: 'chapter-2-1',
          sectionId: 'section-2-1-1',
          lessonId: 'lesson-2-1-1-1'
        },
        correctAnswer: '1',
        explanation: '(-2/3) × (3/4) × (-2/1) = (-2/3) × (3/4) × (-2) = 1',
        correctRate: 68,
        tags: ['유리수', '사칙연산'],
        similarQuestions: []
      },
      {
        id: 'q-math-008',
        subject: 'math',
        content: '어떤 유리수를 x라 할 때, x + 2/5 = 7/10을 만족하는 x의 값은?',
        type: 'multiple_choice',
        difficulty: 'medium',
        source: 'school_exam',
        sourceInfo: {
          schoolName: '강남중학교',
          examYear: 2024,
          examType: '기말고사'
        },
        curriculum: {
          chapterId: 'chapter-2-1',
          sectionId: 'section-2-1-1',
          lessonId: 'lesson-2-1-1-1'
        },
        choices: ['1/5', '3/10', '2/5', '1/2'],
        correctAnswer: '3/10',
        explanation: 'x = 7/10 - 2/5 = 7/10 - 4/10 = 3/10',
        correctRate: 74,
        tags: ['유리수', '방정식'],
        similarQuestions: []
      },
      {
        id: 'q-math-009',
        subject: 'math',
        content: '다음 중 무리수인 것은?',
        type: 'multiple_choice',
        difficulty: 'high',
        source: 'textbook',
        sourceInfo: {
          textbookName: '개념원리 수학 2-1'
        },
        curriculum: {
          chapterId: 'chapter-2-1',
          sectionId: 'section-2-1-1',
          lessonId: 'lesson-2-1-1-3'
        },
        choices: ['√9', '√16', '√2', '√25'],
        correctAnswer: '√2',
        explanation: '√2는 무리수이고, 나머지는 모두 자연수로 유리수입니다.',
        correctRate: 89,
        tags: ['무리수', '유리수', '제곱근'],
        similarQuestions: []
      },
        {
          id: 'q-math-010',
          subject: 'math',
          content: '실수 a, b에 대하여 a < b일 때, 다음 중 항상 참인 것은?',
          type: 'multiple_choice',
          difficulty: 'highest',
          source: 'school_exam',
          sourceInfo: {
            schoolName: '대치중학교',
            examYear: 2024,
            examType: '중간고사'
          },
          curriculum: {
            chapterId: 'chapter-2-1',
            sectionId: 'section-2-1-1',
            lessonId: 'lesson-2-1-1-3'
          },
          choices: ['a² < b²', 'a + c < b + c', '1/a < 1/b', 'ac < bc'],
          correctAnswer: 'a + c < b + c',
          explanation: '부등식의 성질에 의해 양변에 같은 수를 더해도 부등호의 방향은 바뀌지 않습니다.',
          correctRate: 35,
          tags: ['부등식', '실수', '성질'],
          similarQuestions: []
        },
        {
          id: 'q-math-011',
          subject: 'math',
          content: '순환소수 0.272727...을 분수로 나타내시오.',
          type: 'short_answer',
          difficulty: 'medium',
          source: 'internal',
          curriculum: {
            chapterId: 'chapter-2-1',
            sectionId: 'section-2-1-1',
            lessonId: 'lesson-2-1-1-2'
          },
          correctAnswer: '3/11',
          explanation: 'x = 0.272727..., 100x = 27.272727..., 99x = 27, x = 27/99 = 3/11',
          correctRate: 68,
          tags: ['순환소수', '분수변환', '주관식'],
          similarQuestions: []
        },
        {
          id: 'q-math-012',
          subject: 'math',
          content: '유리수와 무리수의 차이점을 설명하고, 각각의 예를 2개씩 들어 설명하시오.',
          type: 'essay',
          difficulty: 'high',
          source: 'internal',
          curriculum: {
            chapterId: 'chapter-2-1',
            sectionId: 'section-2-1-1',
            lessonId: 'lesson-2-1-1-3'
          },
          correctAnswer: '유리수는 두 정수의 비로 나타낼 수 있는 수이고, 무리수는 두 정수의 비로 나타낼 수 없는 수이다.',
          explanation: '유리수: 분수로 표현 가능 (예: 1/2, 0.5), 무리수: 분수로 표현 불가능 (예: √2, π)',
          correctRate: 45,
          tags: ['유리수', '무리수', '서술형'],
          similarQuestions: []
        }
    ],
    difficultyDistribution: {
      low: 3,
      medium: 5,
      high: 3,
      highest: 1
    },
    averageCorrectRate: 65,
    totalQuestions: 12
  },
  {
    id: 'worksheet-1',
    title: '중2-1 유리수와 순환소수 기본',
    description: '유리수와 순환소수의 기본 개념을 다지는 학습지',
    subject: 'math',
    teacherId: 'teacher-1',
    status: 'published',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    tags: ['기본', '중간고사 대비'],
    folderId: 'folder-3',
    qrCode: 'QR001',
    worksheetSettings: {
      grade: '중2',
      creator: '김선생',
      layout: 'single',
      includeAnswers: false,
      includeExplanations: false,
      qrEnabled: true
    },
    questions: [dummyQuestions[0], dummyQuestions[1]],
    difficultyDistribution: {
      low: 0,
      medium: 1,
      high: 1,
      highest: 0
    },
    averageCorrectRate: 60,
    totalQuestions: 2
  },
  {
    id: 'worksheet-2',
    title: '중2-1 식의 계산 심화',
    description: '상위권 학생을 위한 식의 계산 심화 문제',
    subject: 'math',
    teacherId: 'teacher-1',
    status: 'published',
    createdAt: '2024-03-05T14:30:00Z',
    updatedAt: '2024-03-05T14:30:00Z',
    tags: ['상위권 특화', '심화'],
    folderId: 'folder-1',
    qrCode: 'QR002',
    questions: [dummyQuestions[2], dummyQuestions[4]],
    difficultyDistribution: {
      low: 0,
      medium: 0,
      high: 0,
      highest: 2
    },
    averageCorrectRate: 27.5,
    totalQuestions: 2
  },
  {
    id: 'worksheet-3',
    title: '중2-1 일차부등식 종합',
    description: '일차부등식의 전반적인 내용을 다루는 학습지',
    subject: 'math',
    teacherId: 'teacher-1',
    status: 'draft',
    createdAt: '2024-03-10T11:15:00Z',
    updatedAt: '2024-03-10T11:15:00Z',
    tags: ['종합', '내신 대비'],
    folderId: 'folder-2',
    questions: [dummyQuestions[3]],
    difficultyDistribution: {
      low: 0,
      medium: 1,
      high: 0,
      highest: 0
    },
    averageCorrectRate: 68,
    totalQuestions: 1
  },
  {
    id: 'worksheet-4',
    title: '중2 영어 문법 기초',
    description: '중2 영어 기본 문법을 다지는 학습지',
    subject: 'english',
    teacherId: 'teacher-1',
    status: 'published',
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z',
    tags: ['기본', '문법'],
    folderId: 'folder-3',
    qrCode: 'QR003',
    questions: [],
    difficultyDistribution: {
      low: 2,
      medium: 3,
      high: 0,
      highest: 0
    },
    averageCorrectRate: 72,
    totalQuestions: 5
  },
  {
    id: 'worksheet-5',
    title: '중2 영어 독해 연습',
    description: '영어 독해 실력 향상을 위한 학습지',
    subject: 'english',
    teacherId: 'teacher-1',
    status: 'published',
    createdAt: '2024-03-15T14:00:00Z',
    updatedAt: '2024-03-15T14:00:00Z',
    tags: ['독해', '심화'],
    folderId: 'folder-1',
    qrCode: 'QR004',
    questions: [],
    difficultyDistribution: {
      low: 0,
      medium: 2,
      high: 3,
      highest: 0
    },
    averageCorrectRate: 65,
    totalQuestions: 5
  },
  {
    id: 'worksheet-6',
    title: '중2 국어 문학 작품 분석',
    description: '중2 국어 문학 작품을 분석하는 학습지',
    subject: 'korean',
    teacherId: 'teacher-1',
    status: 'published',
    createdAt: '2024-03-18T09:30:00Z',
    updatedAt: '2024-03-18T09:30:00Z',
    tags: ['문학', '분석'],
    folderId: 'folder-2',
    qrCode: 'QR005',
    questions: [],
    difficultyDistribution: {
      low: 1,
      medium: 2,
      high: 1,
      highest: 0
    },
    averageCorrectRate: 78,
    totalQuestions: 4
  },
  {
    id: 'worksheet-7',
    title: '중2 국어 어법과 맞춤법',
    description: '국어 어법과 맞춤법을 익히는 학습지',
    subject: 'korean',
    teacherId: 'teacher-1',
    status: 'draft',
    createdAt: '2024-03-20T16:00:00Z',
    updatedAt: '2024-03-20T16:00:00Z',
    tags: ['어법', '맞춤법', '기본'],
    folderId: 'folder-3',
    questions: [],
    difficultyDistribution: {
      low: 3,
      medium: 2,
      high: 0,
      highest: 0
    },
    averageCorrectRate: 85,
    totalQuestions: 5
  }
];

// 더미 과제 데이터
export const dummyAssignments: Assignment[] = [
  {
    id: 'assignment-1',
    title: '유리수와 순환소수 기본 과제',
    description: '기본 개념 확인을 위한 과제입니다.',
    worksheetId: 'worksheet-1',
    teacherId: 'teacher-1',
    studentIds: ['student-1', 'student-2', 'student-3', 'student-4', 'student-5'],
    assignedAt: '2024-03-01T09:30:00Z',
    dueDate: '2024-03-08T23:59:00Z',
    status: 'completed',
    completionRate: 80,
    averageScore: 75
  },
  {
    id: 'assignment-2',
    title: '식의 계산 심화 과제',
    description: '상위권 학생을 위한 심화 과제입니다.',
    worksheetId: 'worksheet-2',
    teacherId: 'teacher-1',
    studentIds: ['student-1', 'student-3'],
    assignedAt: '2024-03-05T15:00:00Z',
    dueDate: '2024-03-12T23:59:00Z',
    status: 'in_progress',
    completionRate: 50,
    averageScore: 85
  },
  {
    id: 'assignment-3',
    title: '영어 문법 기초 과제',
    description: '영어 기본 문법을 익히는 과제입니다.',
    worksheetId: 'worksheet-4',
    teacherId: 'teacher-1',
    studentIds: ['student-2', 'student-4', 'student-5'],
    assignedAt: '2024-03-12T11:00:00Z',
    dueDate: '2024-03-19T23:59:00Z',
    status: 'in_progress',
    completionRate: 67,
    averageScore: 78
  },
  {
    id: 'assignment-4',
    title: '영어 독해 연습 과제',
    description: '영어 독해 실력 향상을 위한 과제입니다.',
    worksheetId: 'worksheet-5',
    teacherId: 'teacher-1',
    studentIds: ['student-1', 'student-3', 'student-5'],
    assignedAt: '2024-03-15T15:30:00Z',
    dueDate: '2024-03-22T23:59:00Z',
    status: 'in_progress',
    completionRate: 33,
    averageScore: 82
  },
  {
    id: 'assignment-5',
    title: '국어 문학 작품 분석 과제',
    description: '문학 작품을 분석하는 과제입니다.',
    worksheetId: 'worksheet-6',
    teacherId: 'teacher-1',
    studentIds: ['student-1', 'student-2', 'student-3', 'student-4'],
    assignedAt: '2024-03-18T10:00:00Z',
    dueDate: '2024-03-25T23:59:00Z',
    status: 'completed',
    completionRate: 100,
    averageScore: 88
  }
];

// 더미 학습 결과 데이터
export const dummyLearningResults: LearningResult[] = [
  {
    id: 'result-1',
    studentId: 'student-1',
    assignmentId: 'assignment-1',
    worksheetId: 'worksheet-1',
    answers: [
      {
        questionId: 'q-1',
        studentAnswer: '0.25',
        isCorrect: true,
        timeSpent: 45
      },
      {
        questionId: 'q-2',
        studentAnswer: '36/99',
        isCorrect: false,
        timeSpent: 120
      }
    ],
    submittedAt: '2024-03-03T16:30:00Z',
    totalScore: 75,
    correctRate: 50,
    totalTimeSpent: 165,
    difficultyPerformance: {
      low: { correct: 0, total: 0, rate: 0 },
      medium: { correct: 1, total: 1, rate: 100 },
      high: { correct: 0, total: 1, rate: 0 },
      highest: { correct: 0, total: 0, rate: 0 }
    },
    gradingStatus: 'auto_graded'
  },
  {
    id: 'result-2',
    studentId: 'student-1',
    assignmentId: 'assignment-3',
    worksheetId: 'worksheet-4',
    answers: [
      {
        questionId: 'q-english-1',
        studentAnswer: 'correct answer',
        isCorrect: true,
        timeSpent: 90
      }
    ],
    submittedAt: '2024-03-13T14:20:00Z',
    totalScore: 85,
    correctRate: 80,
    totalTimeSpent: 90,
    difficultyPerformance: {
      low: { correct: 1, total: 1, rate: 100 },
      medium: { correct: 0, total: 0, rate: 0 },
      high: { correct: 0, total: 0, rate: 0 },
      highest: { correct: 0, total: 0, rate: 0 }
    },
    gradingStatus: 'auto_graded'
  },
  {
    id: 'result-3',
    studentId: 'student-1',
    assignmentId: 'assignment-5',
    worksheetId: 'worksheet-6',
    answers: [
      {
        questionId: 'q-korean-1',
        studentAnswer: 'correct answer',
        isCorrect: true,
        timeSpent: 120
      }
    ],
    submittedAt: '2024-03-20T14:20:00Z',
    totalScore: 92,
    correctRate: 90,
    totalTimeSpent: 120,
    difficultyPerformance: {
      low: { correct: 1, total: 1, rate: 100 },
      medium: { correct: 0, total: 0, rate: 0 },
      high: { correct: 0, total: 0, rate: 0 },
      highest: { correct: 0, total: 0, rate: 0 }
    },
    gradingStatus: 'auto_graded'
  },
  {
    id: 'result-4',
    studentId: 'student-3',
    assignmentId: 'assignment-2',
    worksheetId: 'worksheet-2',
    answers: [
      {
        questionId: 'q-3',
        studentAnswer: '72x⁸',
        isCorrect: true,
        timeSpent: 180
      }
    ],
    submittedAt: '2024-03-07T14:20:00Z',
    totalScore: 100,
    correctRate: 100,
    totalTimeSpent: 180,
    difficultyPerformance: {
      low: { correct: 0, total: 0, rate: 0 },
      medium: { correct: 0, total: 0, rate: 0 },
      high: { correct: 0, total: 0, rate: 0 },
      highest: { correct: 1, total: 1, rate: 100 }
    },
    gradingStatus: 'auto_graded'
  }
];

// 더미 학생 통계 데이터
export const dummyStudentStats: StudentStats[] = [
  {
    studentId: 'student-1',
    totalAssignments: 5,
    completedAssignments: 4,
    completionRate: 80,
    averageScore: 78,
    totalStudyTime: 240,
    weaknessTypes: [
      { type: '순환소수 분수변환', correctRate: 45, questionCount: 8 },
      { type: '복잡한 지수계산', correctRate: 30, questionCount: 5 },
      { type: '부등식 응용', correctRate: 55, questionCount: 6 }
    ],
    subjectPerformance: {
      math: { averageScore: 78, completedCount: 4, totalTime: 240 },
      english: { averageScore: 0, completedCount: 0, totalTime: 0 },
      korean: { averageScore: 0, completedCount: 0, totalTime: 0 }
    }
  },
  {
    studentId: 'student-3',
    totalAssignments: 3,
    completedAssignments: 3,
    completionRate: 100,
    averageScore: 92,
    totalStudyTime: 180,
    weaknessTypes: [
      { type: '실수 방지', correctRate: 85, questionCount: 12 },
      { type: '시간 관리', correctRate: 90, questionCount: 8 }
    ],
    subjectPerformance: {
      math: { averageScore: 92, completedCount: 3, totalTime: 180 },
      english: { averageScore: 0, completedCount: 0, totalTime: 0 },
      korean: { averageScore: 0, completedCount: 0, totalTime: 0 }
    }
  }
];

// 더미 선생님 대시보드 통계
export const dummyTeacherDashboardStats: TeacherDashboardStats = {
  totalWorksheets: 18,
  totalAssignments: 12,
  assignmentCompletionRate: 75,
  totalStudents: 20,
  recentWorksheets: dummyWorksheets.slice(0, 5),
  recentAssignments: dummyAssignments
};

// 데이터 접근 함수들
export const getUserById = (id: string): User | undefined => {
  return dummyUsers.find(user => user.id === id);
};

export const getStudentsByTeacherId = (teacherId: string): User[] => {
  return dummyUsers.filter(user => user.role === 'student' && user.teacherId === teacherId);
};

export const getWorksheetsByTeacherId = (teacherId: string): Worksheet[] => {
  return dummyWorksheets.filter(worksheet => worksheet.teacherId === teacherId);
};

export const getAssignmentsByTeacherId = (teacherId: string): Assignment[] => {
  return dummyAssignments.filter(assignment => assignment.teacherId === teacherId);
};

export const getAssignmentsByStudentId = (studentId: string): Assignment[] => {
  return dummyAssignments.filter(assignment => assignment.studentIds.includes(studentId));
};

export const getLearningResultsByStudentId = (studentId: string): LearningResult[] => {
  return dummyLearningResults.filter(result => result.studentId === studentId);
};

export const getStudentStatsById = (studentId: string): StudentStats | undefined => {
  return dummyStudentStats.find(stats => stats.studentId === studentId);
};

export const getFoldersByTeacherId = (teacherId: string): Folder[] => {
  return dummyFolders.filter(folder => folder.teacherId === teacherId);
};

// 전체 합계 통계 계산 함수
export const getTotalStudentStats = (studentId: string) => {
  const studentResults = dummyLearningResults.filter(r => r.studentId === studentId);
  const studentAssignments = dummyAssignments.filter(a => a.studentIds.includes(studentId));
  
  if (studentResults.length === 0) {
    return {
      totalAssignments: studentAssignments.length,
      completedAssignments: 0,
      averageScore: 0,
      totalStudyTime: 0,
      completionRate: 0,
      inProgressCount: studentAssignments.length
    };
  }

  const totalStudyTime = studentResults.reduce((sum, r) => sum + r.totalTimeSpent, 0);
  const averageScore = studentResults.reduce((sum, r) => sum + r.totalScore, 0) / studentResults.length;
  const completionRate = Math.round((studentResults.length / studentAssignments.length) * 100);
  const inProgressCount = studentAssignments.length - studentResults.length;

  return {
    totalAssignments: studentAssignments.length,
    completedAssignments: studentResults.length,
    averageScore: Math.round(averageScore),
    totalStudyTime,
    completionRate,
    inProgressCount
  };
};

// 과목별 통계 계산 함수
export const getSubjectStats = (studentId: string, subject: 'math' | 'english' | 'korean') => {
  const studentResults = dummyLearningResults.filter(r => r.studentId === studentId);
  const studentAssignments = dummyAssignments.filter(a => a.studentIds.includes(studentId));
  
  // 과목별 학습지 필터링
  const subjectWorksheets = dummyWorksheets.filter(w => w.subject === subject);
  const subjectAssignments = studentAssignments.filter(a => {
    const worksheet = dummyWorksheets.find(w => w.id === a.worksheetId);
    return worksheet?.subject === subject;
  });
  const subjectResults = studentResults.filter(r => {
    const worksheet = dummyWorksheets.find(w => w.id === r.worksheetId);
    return worksheet?.subject === subject;
  });

  // 과목별 취약 유형 (더미 데이터)
  const weaknessTypesBySubject = {
    math: [
      { type: '이차방정식', correctRate: 65, questionCount: 12 },
      { type: '함수의 그래프', correctRate: 72, questionCount: 8 },
      { type: '확률과 통계', correctRate: 58, questionCount: 15 }
    ],
    english: [
      { type: '문법 (시제)', correctRate: 78, questionCount: 10 },
      { type: '독해 (빈칸추론)', correctRate: 62, questionCount: 8 },
      { type: '어휘', correctRate: 85, questionCount: 12 }
    ],
    korean: [
      { type: '문학 (현대시)', correctRate: 70, questionCount: 8 },
      { type: '비문학 (과학기술)', correctRate: 65, questionCount: 10 },
      { type: '문법 (품사)', correctRate: 80, questionCount: 6 }
    ]
  };

  return {
    assignments: subjectAssignments,
    results: subjectResults,
    weaknessTypes: weaknessTypesBySubject[subject] || []
  };
};

// 학생별 통계 계산 함수 (고급 기능 포함)
export const getStudentStats = (studentId: string) => {
  const studentResults = dummyLearningResults.filter(r => r.studentId === studentId);
  
  if (studentResults.length === 0) {
    return {
      totalAssignments: 0,
      completedAssignments: 0,
      averageScore: 0,
      totalStudyTime: 0,
      completionRate: 0,
      weaknessTypes: [],
      isTopTier: false,
      recommendedDifficulty: 'medium' as const
    };
  }

  const totalStudyTime = studentResults.reduce((sum, r) => sum + r.totalTimeSpent, 0);
  const averageScore = studentResults.reduce((sum, r) => sum + r.totalScore, 0) / studentResults.length;
  
  // 상위권 학생 판별 (평균 85점 이상)
  const isTopTier = averageScore >= 85;
  
  // 추천 난이도 계산
  const recommendedDifficulty = averageScore >= 90 ? 'highest' : 
                               averageScore >= 80 ? 'high' : 
                               averageScore >= 70 ? 'medium' : 'low';
  
  // 취약 유형 분석 (더미 데이터)
  const weaknessTypes = isTopTier ? [
    { type: '고차방정식', correctRate: 78, questionCount: 10 },
    { type: '복합함수', correctRate: 82, questionCount: 8 },
    { type: '심화 미적분', correctRate: 75, questionCount: 12 }
  ] : [
    { type: '이차방정식', correctRate: 65, questionCount: 12 },
    { type: '함수의 그래프', correctRate: 72, questionCount: 8 },
    { type: '확률과 통계', correctRate: 58, questionCount: 15 }
  ];

  return {
    totalAssignments: dummyAssignments.filter(a => a.studentIds.includes(studentId)).length,
    completedAssignments: studentResults.length,
    averageScore: Math.round(averageScore),
    totalStudyTime,
    completionRate: Math.round((studentResults.length / dummyAssignments.filter(a => a.studentIds.includes(studentId)).length) * 100),
    weaknessTypes,
    isTopTier,
    recommendedDifficulty
  };
};

// 유사 문제 추천 시스템 (더미)
export const getSimilarQuestions = (questionId: string, count: number = 5) => {
  const originalQuestion = dummyQuestions.find(q => q.id === questionId);
  if (!originalQuestion) return [];
  
  // 같은 난이도와 유형의 문제들을 찾아서 반환
  return dummyQuestions
    .filter(q => 
      q.id !== questionId && 
      q.difficulty === originalQuestion.difficulty &&
      q.type === originalQuestion.type
    )
    .slice(0, count)
    .map(q => ({
      ...q,
      similarity: Math.floor(Math.random() * 20) + 80 // 80-99% 유사도
    }));
};

// 오답 기반 재시험지 생성
export const generateRetestWorksheet = (studentId: string, originalWorksheetId: string) => {
  const studentResult = dummyLearningResults.find(r => 
    r.studentId === studentId && r.worksheetId === originalWorksheetId
  );
  
  if (!studentResult) return null;
  
  // 틀린 문제들 찾기
  const wrongAnswers = studentResult.answers.filter(a => !a.isCorrect);
  
  if (wrongAnswers.length === 0) return null;
  
  // 틀린 문제들과 유사한 문제들로 재시험지 구성
  const retestQuestions = wrongAnswers.flatMap(answer => {
    const similarQuestions = getSimilarQuestions(answer.questionId, 2);
    return similarQuestions;
  });
  
  return {
    id: `retest-${Date.now()}`,
    title: `재시험지 - ${dummyWorksheets.find(w => w.id === originalWorksheetId)?.title}`,
    description: '틀린 문제 유형 집중 연습',
    subject: dummyWorksheets.find(w => w.id === originalWorksheetId)?.subject || 'math',
    questions: retestQuestions.slice(0, 10), // 최대 10문제
    totalQuestions: Math.min(retestQuestions.length, 10),
    difficulty: 'mixed' as const,
    difficultyDistribution: {
      low: 0,
      medium: 5,
      high: 3,
      highest: 2
    },
    questionTypeDistribution: {
      multiple_choice: 6,
      short_answer: 3,
      essay: 1
    },
    averageCorrectRate: 0,
    status: 'draft' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    teacherId: 'system',
    tags: ['재시험', '오답노트', '복습'],
    estimatedTime: Math.min(retestQuestions.length, 10) * 1.5,
    source: 'auto_generated' as const
  };
};

// 상위권 학생용 고난도 문제 필터링
export const getAdvancedQuestions = (subject: string, count: number = 10) => {
  return dummyQuestions
    .filter(q => q.difficulty === 'highest' || q.difficulty === 'high')
    .filter(q => {
      // 상위권 학생용 추가 조건들
      return q.content.includes('심화') || 
             q.content.includes('응용') || 
             q.content.includes('종합') ||
             q.tags.includes('상위권'); // 상위권 문제
    })
    .slice(0, count);
};

// 학습 패턴 분석 (상위권 학생 특화)
export const analyzeStudentLearningPattern = (studentId: string) => {
  const results = dummyLearningResults.filter(r => r.studentId === studentId);
  const stats = getStudentStats(studentId);
  
  if (!stats.isTopTier) {
    return {
      pattern: 'standard',
      recommendations: [
        '기본 개념 복습을 통한 실력 향상',
        '단계별 난이도 상승 학습',
        '꾸준한 문제 풀이 연습'
      ]
    };
  }
  
  // 상위권 학생 패턴 분석
  const avgTimePerQuestion = results.length > 0 
    ? results.reduce((sum, r) => sum + r.totalTimeSpent, 0) / results.reduce((sum, r) => sum + r.answers.length, 0)
    : 0;
  
  const highDifficultyRate = results.length > 0
    ? results.reduce((sum, r) => {
        const highDiffQuestions = r.answers.filter(a => {
          const question = dummyQuestions.find(q => q.id === a.questionId);
          return question?.difficulty === 'highest' || question?.difficulty === 'high';
        });
        return sum + (highDiffQuestions.filter(a => a.isCorrect).length / Math.max(highDiffQuestions.length, 1));
      }, 0) / results.length * 100
    : 0;
  
  let pattern = 'advanced';
  let recommendations = [];
  
  if (avgTimePerQuestion < 60 && highDifficultyRate > 80) {
    pattern = 'gifted';
    recommendations = [
      '경시대회 수준의 심화 문제 도전',
      '창의적 사고력 문제 집중 훈련',
      '수학적 증명 및 논리 전개 연습',
      '실생활 응용 문제 탐구'
    ];
  } else if (highDifficultyRate > 70) {
    pattern = 'high_achiever';
    recommendations = [
      '최고난도 문제 비중 확대',
      '복합 개념 문제 집중 연습',
      '시간 단축 훈련',
      '실수 방지 전략 수립'
    ];
  } else {
    recommendations = [
      '고난도 문제 단계적 접근',
      '약점 유형 집중 보완',
      '문제 해결 속도 향상',
      '심화 개념 이해도 점검'
    ];
  }
  
  return {
    pattern,
    avgTimePerQuestion: Math.round(avgTimePerQuestion),
    highDifficultyRate: Math.round(highDifficultyRate),
    recommendations
  };
};

// AI 학습 분석 데이터 타입
export interface AIAnalysisData {
  studentId: string;
  subjects: {
    [key in 'math' | 'english' | 'korean']: {
      strengths: string[];
      weaknesses: string[];
      focusIndex: number; // 0-100
      focusFactors: {
        consistentPace: number;
        lowSkipRate: number;
        highCompletionRate: number;
      };
      recommendedLearningPath: string[];
      lastUpdated: string;
    };
  };
}

// AI 분석 더미 데이터
export const dummyAIAnalysisData: AIAnalysisData[] = [
  {
    studentId: 'student-1',
    subjects: {
      math: {
        strengths: [
          '기본 연산 능력이 뛰어남',
          '논리적 사고력이 우수함',
          '복잡한 문제를 단계별로 해결하는 능력',
          '그래프 해석 능력이 뛰어남'
        ],
        weaknesses: [
          '순환소수와 분수 변환에서 실수 빈발',
          '복잡한 지수 계산에서 정확도 부족',
          '문제 해결 속도가 다소 느림',
          '응용 문제에서 접근 방법 미숙'
        ],
        focusIndex: 72,
        focusFactors: {
          consistentPace: 68,
          lowSkipRate: 85,
          highCompletionRate: 80
        },
        recommendedLearningPath: [
          '순환소수 변환 집중 연습 (주 3회, 20분씩)',
          '지수법칙 기본기 다지기',
          '시간 제한 문제 풀이 연습',
          '응용 문제 해결 전략 학습',
          '오답노트 작성 및 복습'
        ],
        lastUpdated: '2024-03-20T14:30:00Z'
      },
      english: {
        strengths: [
          '기본 문법 이해도가 높음',
          '어휘력이 풍부함',
          '독해 속도가 빠름',
          '문맥 파악 능력이 우수함'
        ],
        weaknesses: [
          '복잡한 시제 활용에서 혼동',
          '관계대명사 사용법 미숙',
          '긴 문장 구조 분석 어려움',
          '추론 문제에서 정확도 부족'
        ],
        focusIndex: 78,
        focusFactors: {
          consistentPace: 82,
          lowSkipRate: 75,
          highCompletionRate: 77
        },
        recommendedLearningPath: [
          '시제별 문법 규칙 체계적 정리',
          '관계대명사 집중 학습',
          '구문 분석 연습',
          '추론 문제 해결 전략 학습',
          '매일 영어 독해 10분 연습'
        ],
        lastUpdated: '2024-03-20T14:30:00Z'
      },
      korean: {
        strengths: [
          '문학 작품 감상 능력이 뛰어남',
          '어휘력과 표현력이 우수함',
          '글의 구조 파악 능력',
          '창의적 사고력'
        ],
        weaknesses: [
          '문법 용어 정확한 이해 부족',
          '고전 문학 해석에서 어려움',
          '논리적 글쓰기 구성력 부족',
          '맞춤법 실수 빈발'
        ],
        focusIndex: 85,
        focusFactors: {
          consistentPace: 88,
          lowSkipRate: 90,
          highCompletionRate: 77
        },
        recommendedLearningPath: [
          '문법 용어 체계적 학습',
          '고전 문학 배경 지식 확충',
          '논리적 글쓰기 구조 연습',
          '맞춤법 규칙 정리 및 암기',
          '다양한 갈래 문학 작품 감상'
        ],
        lastUpdated: '2024-03-20T14:30:00Z'
      }
    }
  },
  {
    studentId: 'student-2',
    subjects: {
      math: {
        strengths: [
          '계산 정확도가 높음',
          '기본 공식 암기가 잘 되어 있음',
          '차근차근 문제를 해결하는 성향',
          '실수가 적음'
        ],
        weaknesses: [
          '응용 문제 해결 능력 부족',
          '새로운 유형의 문제에 당황',
          '문제 해결 속도가 느림',
          '창의적 접근 방법 부족'
        ],
        focusIndex: 65,
        focusFactors: {
          consistentPace: 70,
          lowSkipRate: 60,
          highCompletionRate: 65
        },
        recommendedLearningPath: [
          '다양한 유형의 문제 경험',
          '문제 해결 전략 학습',
          '시간 관리 연습',
          '창의적 사고 문제 도전',
          '단계별 난이도 상승 학습'
        ],
        lastUpdated: '2024-03-20T14:30:00Z'
      },
      english: {
        strengths: [
          '기본 단어 암기가 잘 되어 있음',
          '성실한 학습 태도',
          '반복 학습을 통한 꾸준한 향상',
          '기본 문법 규칙 이해'
        ],
        weaknesses: [
          '복잡한 문장 이해 어려움',
          '듣기 능력 부족',
          '말하기 자신감 부족',
          '고급 어휘 부족'
        ],
        focusIndex: 58,
        focusFactors: {
          consistentPace: 55,
          lowSkipRate: 65,
          highCompletionRate: 55
        },
        recommendedLearningPath: [
          '기본 문장 구조 반복 학습',
          '듣기 연습 시간 확대',
          '말하기 연습 기회 증가',
          '고급 어휘 단계적 학습',
          '영어 노출 시간 증가'
        ],
        lastUpdated: '2024-03-20T14:30:00Z'
      },
      korean: {
        strengths: [
          '성실한 학습 태도',
          '기본 어휘력 보유',
          '꾸준한 독서 습관',
          '정확한 맞춤법 사용'
        ],
        weaknesses: [
          '문학 작품 해석 능력 부족',
          '비판적 사고력 부족',
          '창의적 표현력 부족',
          '복잡한 문법 이해 어려움'
        ],
        focusIndex: 62,
        focusFactors: {
          consistentPace: 65,
          lowSkipRate: 58,
          highCompletionRate: 63
        },
        recommendedLearningPath: [
          '문학 작품 감상 능력 향상',
          '비판적 읽기 연습',
          '창의적 글쓰기 연습',
          '문법 개념 체계적 학습',
          '다양한 장르 독서 확대'
        ],
        lastUpdated: '2024-03-20T14:30:00Z'
      }
    }
  },
  {
    studentId: 'student-3',
    subjects: {
      math: {
        strengths: [
          '뛰어난 수학적 직관력',
          '빠른 문제 해결 속도',
          '창의적 접근 방법',
          '고난도 문제 도전 의식',
          '논리적 사고의 체계성'
        ],
        weaknesses: [
          '간단한 계산에서 실수',
          '검산 습관 부족',
          '기본기 소홀',
          '성급한 문제 해결'
        ],
        focusIndex: 92,
        focusFactors: {
          consistentPace: 95,
          lowSkipRate: 88,
          highCompletionRate: 93
        },
        recommendedLearningPath: [
          '실수 방지 전략 수립',
          '검산 습관 기르기',
          '경시대회 수준 문제 도전',
          '수학적 증명 연습',
          '심화 개념 탐구'
        ],
        lastUpdated: '2024-03-20T14:30:00Z'
      },
      english: {
        strengths: [
          '우수한 독해 능력',
          '풍부한 어휘력',
          '빠른 이해력',
          '논리적 사고력',
          '자기주도 학습 능력'
        ],
        weaknesses: [
          '세부 문법 규칙 간과',
          '완벽주의 성향으로 인한 시간 소모',
          '기본기 점검 소홀',
          '실용 영어 경험 부족'
        ],
        focusIndex: 88,
        focusFactors: {
          consistentPace: 90,
          lowSkipRate: 85,
          highCompletionRate: 90
        },
        recommendedLearningPath: [
          '고급 문법 정밀 학습',
          '시간 관리 전략 수립',
          '실용 영어 경험 확대',
          '영어 원서 읽기',
          '영어 토론 참여'
        ],
        lastUpdated: '2024-03-20T14:30:00Z'
      },
      korean: {
        strengths: [
          '뛰어난 문학적 감수성',
          '창의적 사고력',
          '비판적 분석 능력',
          '풍부한 표현력',
          '깊이 있는 사고'
        ],
        weaknesses: [
          '기본 문법 용어 정리 필요',
          '시간 배분 미숙',
          '완벽주의로 인한 부담',
          '객관적 평가 기준 이해 부족'
        ],
        focusIndex: 90,
        focusFactors: {
          consistentPace: 92,
          lowSkipRate: 88,
          highCompletionRate: 90
        },
        recommendedLearningPath: [
          '문법 체계 정리',
          '시간 관리 연습',
          '다양한 관점 수용 연습',
          '평가 기준 이해',
          '심화 문학 탐구'
        ],
        lastUpdated: '2024-03-20T14:30:00Z'
      }
    }
  }
];

// AI 분석 데이터 조회 함수
export const getAIAnalysisData = (studentId: string): AIAnalysisData | undefined => {
  return dummyAIAnalysisData.find(data => data.studentId === studentId);
};

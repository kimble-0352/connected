'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';
import { 
  Lightbulb,
  TrendingUp,
  BookOpen,
  Target,
  Plus,
  Eye,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Question, Difficulty } from '@/app/types';
import { dummyQuestions } from '@/app/lib/data/dummy-data';

interface SimilarQuestionsProps {
  baseQuestion: Question;
  onQuestionSelect?: (question: Question) => void;
  maxSuggestions?: number;
  showAddButton?: boolean;
}

export function SimilarQuestions({ 
  baseQuestion, 
  onQuestionSelect, 
  maxSuggestions = 5,
  showAddButton = false 
}: SimilarQuestionsProps) {
  const [similarQuestions, setSimilarQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    findSimilarQuestions();
  }, [baseQuestion]);

  // 유사 문제 찾기 알고리즘
  const findSimilarQuestions = async () => {
    setIsLoading(true);
    
    // 실제로는 AI/ML 기반 유사도 계산을 수행
    // 여기서는 더미 데이터를 기반으로 시뮬레이션
    
    const candidates = dummyQuestions.filter(q => 
      q.id !== baseQuestion.id && 
      q.subject === baseQuestion.subject
    );

    // 유사도 점수 계산 (실제로는 더 정교한 알고리즘 사용)
    const scored = candidates.map(question => {
      let score = 0;
      
      // 1. 같은 커리큘럼 (40점)
      if (question.curriculum.chapterId === baseQuestion.curriculum.chapterId) {
        score += 40;
        if (question.curriculum.sectionId === baseQuestion.curriculum.sectionId) {
          score += 20;
          if (question.curriculum.lessonId === baseQuestion.curriculum.lessonId) {
            score += 20;
          }
        }
      }
      
      // 2. 같은 난이도 (20점)
      if (question.difficulty === baseQuestion.difficulty) {
        score += 20;
      } else {
        // 인접 난이도 (10점)
        const difficultyOrder = ['low', 'medium', 'high', 'highest'];
        const baseDiffIndex = difficultyOrder.indexOf(baseQuestion.difficulty);
        const questionDiffIndex = difficultyOrder.indexOf(question.difficulty);
        if (Math.abs(baseDiffIndex - questionDiffIndex) === 1) {
          score += 10;
        }
      }
      
      // 3. 같은 문제 유형 (15점)
      if (question.type === baseQuestion.type) {
        score += 15;
      }
      
      // 4. 공통 태그 (태그당 5점, 최대 15점)
      const commonTags = question.tags.filter(tag => baseQuestion.tags.includes(tag));
      score += Math.min(commonTags.length * 5, 15);
      
      // 5. 정답률 유사성 (10점)
      const correctRateDiff = Math.abs(question.correctRate - baseQuestion.correctRate);
      if (correctRateDiff <= 10) {
        score += 10;
      } else if (correctRateDiff <= 20) {
        score += 5;
      }
      
      return { question, score };
    });

    // 점수순 정렬 및 상위 문제 선택
    const sorted = scored
      .filter(item => item.score >= 30) // 최소 유사도 임계값
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSuggestions)
      .map(item => item.question);

    setSimilarQuestions(sorted);
    setIsLoading(false);
  };

  const getDifficultyLabel = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'low': return '하';
      case 'medium': return '중';
      case 'high': return '상';
      case 'highest': return '최상';
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'highest': return 'bg-red-100 text-red-800';
    }
  };

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
    onQuestionSelect?.(question);
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          <span className="font-medium">유사 문제 분석 중...</span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
          <span className="font-medium">유사 문제 추천</span>
          <Badge variant="outline" className="text-xs">
            AI 추천
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={findSimilarQuestions}
          className="gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          새로고침
        </Button>
      </div>

      {similarQuestions.length > 0 ? (
        <div className="space-y-3">
          {similarQuestions.map((question, index) => (
            <div
              key={question.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:border-blue-300 hover:bg-blue-50 ${
                selectedQuestion?.id === question.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleQuestionClick(question)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <Badge className={getDifficultyColor(question.difficulty)}>
                    {getDifficultyLabel(question.difficulty)}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <TrendingUp className="w-3 h-3" />
                    {question.correctRate}%
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {showAddButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 학습지에 추가하는 로직
                        console.log('문제 추가:', question.id);
                      }}
                      className="gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      추가
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQuestion(selectedQuestion?.id === question.id ? null : question);
                    }}
                    className="gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    {selectedQuestion?.id === question.id ? '접기' : '보기'}
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                {question.content}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {question.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {question.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{question.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              {/* 상세 정보 (선택된 경우) */}
              {selectedQuestion?.id === question.id && (
                <div className="mt-3 pt-3 border-t bg-white rounded-lg p-3">
                  <div className="space-y-3">
                    {question.choices && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">선택지</h5>
                        <div className="space-y-1">
                          {question.choices.map((choice, choiceIndex) => (
                            <div key={choiceIndex} className="text-sm text-gray-700">
                              {String.fromCharCode(65 + choiceIndex)}. {choice}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h5 className="text-sm font-medium mb-1">정답</h5>
                      <p className="text-sm text-blue-600 font-medium">{question.correctAnswer}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-1">해설</h5>
                      <p className="text-sm text-gray-700">{question.explanation}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>정답률: {question.correctRate}%</span>
                      <span>출처: {question.source === 'internal' ? '자체제작' : 
                                    question.source === 'textbook' ? '교재' : '학교시험'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">유사한 문제를 찾을 수 없습니다.</p>
          <p className="text-xs mt-1">다른 조건으로 검색해보세요.</p>
        </div>
      )}
      
      {/* 추천 기준 설명 */}
      <div className="mt-4 pt-3 border-t">
        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer hover:text-gray-700">추천 기준</summary>
          <div className="mt-2 space-y-1">
            <p>• 같은 학습 단원 및 개념</p>
            <p>• 유사한 난이도 및 문제 유형</p>
            <p>• 공통 태그 및 키워드</p>
            <p>• 비슷한 정답률 수준</p>
          </div>
        </details>
      </div>
    </Card>
  );
}

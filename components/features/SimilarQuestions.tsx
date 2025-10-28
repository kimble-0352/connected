'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb,
  Target,
  Clock,
  BookOpen,
  ChevronRight,
  RefreshCw,
  Star
} from 'lucide-react';
import { getSimilarQuestions } from '@/app/lib/data/dummy-data';
import { Question } from '@/app/types';

interface SimilarQuestionsProps {
  originalQuestionId: string;
  onQuestionSelect?: (question: Question & { similarity: number }) => void;
  maxQuestions?: number;
}

export const SimilarQuestions: React.FC<SimilarQuestionsProps> = ({
  originalQuestionId,
  onQuestionSelect,
  maxQuestions = 5
}) => {
  const [similarQuestions, setSimilarQuestions] = useState(() => 
    getSimilarQuestions(originalQuestionId, maxQuestions)
  );
  const [isLoading, setIsLoading] = useState(false);

  const refreshSimilarQuestions = async () => {
    setIsLoading(true);
    // 실제로는 API 호출
    setTimeout(() => {
      setSimilarQuestions(getSimilarQuestions(originalQuestionId, maxQuestions));
      setIsLoading(false);
    }, 1000);
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labelMap = {
      'low': '하',
      'medium': '중',
      'high': '상',
      'highest': '최상'
    };
    return labelMap[difficulty as keyof typeof labelMap] || difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colorMap = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'highest': 'bg-red-100 text-red-800'
    };
    return colorMap[difficulty as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 95) return 'text-green-600';
    if (similarity >= 90) return 'text-blue-600';
    if (similarity >= 85) return 'text-orange-600';
    return 'text-gray-600';
  };

  if (similarQuestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            유사 문항 추천
          </CardTitle>
          <CardDescription>
            이 문제와 비슷한 유형의 문제들을 찾지 못했습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>유사한 문제가 없습니다</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 gap-2"
              onClick={refreshSimilarQuestions}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              다시 찾기
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              유사 문항 추천
            </CardTitle>
            <CardDescription>
              이 문제와 비슷한 유형의 문제 {similarQuestions.length}개를 찾았습니다
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={refreshSimilarQuestions}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {similarQuestions.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">유사 문제 {index + 1}</span>
                  <Badge className={getDifficultyColor(question.difficulty)}>
                    {getDifficultyLabel(question.difficulty)}
                  </Badge>
                  {question.source !== 'internal' && (
                    <Badge variant="outline" className="text-xs">
                      {question.source === 'textbook' ? '교재' : 
                       question.source === 'school_exam' ? '기출' : '자체'}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getSimilarityColor(question.similarity)}`}>
                    {question.similarity}% 유사
                  </div>
                  <Progress value={question.similarity} className="w-16 h-1 mt-1" />
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                {question.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>{question.type === 'multiple_choice' ? '객관식' : 
                           question.type === 'short_answer' ? '단답형' : '서술형'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>예상 2분</span>
                  </div>
                  {question.similarity >= 95 && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Star className="h-3 w-3 fill-current" />
                      <span>최고 유사도</span>
                    </div>
                  )}
                </div>
                
                {onQuestionSelect && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="gap-2"
                    onClick={() => onQuestionSelect(question)}
                  >
                    문제 보기
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* 추천 이유 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <div className="font-medium text-blue-900 mb-1">추천 기준</div>
              <ul className="text-blue-800 space-y-1 text-xs">
                <li>• 동일한 난이도 및 문제 유형</li>
                <li>• 유사한 개념과 해결 방법</li>
                <li>• 비슷한 문제 구조와 패턴</li>
                <li>• 학습 효과가 높은 연관 문제</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

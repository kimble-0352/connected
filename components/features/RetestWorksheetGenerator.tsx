'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  RotateCcw,
  AlertCircle,
  CheckCircle,
  FileText,
  Target,
  Clock,
  Zap,
  Download,
  Eye
} from 'lucide-react';
import { generateRetestWorksheet } from '@/app/lib/data/dummy-data';
import { LearningResult, Worksheet } from '@/app/types';

interface RetestWorksheetGeneratorProps {
  studentId: string;
  originalWorksheetId: string;
  learningResult: LearningResult;
  onWorksheetGenerated?: (worksheet: any) => void;
}

export const RetestWorksheetGenerator: React.FC<RetestWorksheetGeneratorProps> = ({
  studentId,
  originalWorksheetId,
  learningResult,
  onWorksheetGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<any>(null);

  const wrongAnswers = learningResult.answers.filter(a => !a.isCorrect);
  const correctAnswers = learningResult.answers.filter(a => a.isCorrect);
  const totalQuestions = learningResult.answers.length;
  const wrongRate = Math.round((wrongAnswers.length / totalQuestions) * 100);

  const handleGenerateRetest = async () => {
    if (wrongAnswers.length === 0) return;
    
    setIsGenerating(true);
    
    // 실제로는 API 호출
    setTimeout(() => {
      const worksheet = generateRetestWorksheet(studentId, originalWorksheetId);
      setGeneratedWorksheet(worksheet);
      setIsGenerating(false);
      
      if (worksheet && onWorksheetGenerated) {
        onWorksheetGenerated(worksheet);
      }
    }, 2000);
  };

  const getDifficultyLabel = (difficulty: string): string => {
    const labelMap: Record<string, string> = {
      'low': '하',
      'medium': '중',
      'high': '상',
      'highest': '최상'
    };
    return labelMap[difficulty] || difficulty;
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

  if (wrongAnswers.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            완벽한 성과!
          </CardTitle>
          <CardDescription className="text-green-700">
            모든 문제를 정답으로 풀어서 재시험지가 필요하지 않습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-green-600 mb-2">100%</div>
            <p className="text-sm text-green-700">정답률 달성! 🎉</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-orange-600" />
          오답 재시험지 생성
        </CardTitle>
        <CardDescription>
          틀린 문제들과 유사한 문제로 구성된 재시험지를 자동 생성합니다
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 오답 분석 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600 mb-1">{wrongAnswers.length}</div>
            <div className="text-sm text-red-700">틀린 문제</div>
            <div className="text-xs text-red-600 mt-1">{wrongRate}%</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{correctAnswers.length}</div>
            <div className="text-sm text-green-700">맞힌 문제</div>
            <div className="text-xs text-green-600 mt-1">{100 - wrongRate}%</div>
          </div>
        </div>

        {/* 오답 유형 분석 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            틀린 문제 유형 분석
          </h4>
          
          <div className="space-y-2">
            {Object.entries(learningResult.difficultyPerformance).map(([difficulty, performance]) => {
              const wrongCount = performance.total - performance.correct;
              if (wrongCount === 0) return null;
              
              return (
                <div key={difficulty} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(difficulty)}>
                      {getDifficultyLabel(difficulty)}
                    </Badge>
                    <span>{wrongCount}문제 틀림</span>
                  </div>
                  <div className="text-muted-foreground">
                    {Math.round((wrongCount / performance.total) * 100)}% 오답률
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 재시험지 생성 버튼 */}
        {!generatedWorksheet ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2 text-sm">
                <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-blue-800">
                  <div className="font-medium mb-1">AI 기반 재시험지 생성</div>
                  <ul className="text-xs space-y-1">
                    <li>• 틀린 문제와 유사한 유형의 문제 자동 선별</li>
                    <li>• 학생 수준에 맞는 난이도 조정</li>
                    <li>• 약점 보완에 최적화된 문제 구성</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleGenerateRetest}
              disabled={isGenerating}
              className="w-full gap-2"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  재시험지 생성 중...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  재시험지 생성하기
                </>
              )}
            </Button>
          </div>
        ) : (
          /* 생성된 재시험지 정보 */
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">재시험지 생성 완료!</span>
              </div>
              <p className="text-sm text-green-700">
                틀린 문제 유형을 바탕으로 {generatedWorksheet.totalQuestions}문제의 재시험지가 생성되었습니다.
              </p>
            </div>

            {/* 생성된 재시험지 정보 */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{generatedWorksheet.title}</h4>
                    <p className="text-sm text-muted-foreground">{generatedWorksheet.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span>{generatedWorksheet.totalQuestions}문제</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span>예상 {Math.round(generatedWorksheet.estimatedTime)}분</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">난이도 구성</div>
                    <div className="flex gap-2">
                      {Object.entries(generatedWorksheet.difficultyDistribution).map(([difficulty, count]) => {
                        if (count === 0) return null;
                        return (
                          <Badge key={difficulty} variant="outline" className="text-xs">
                            {getDifficultyLabel(difficulty)} {String(count)}문제
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 gap-2">
                      <Eye className="h-4 w-4" />
                      미리보기
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-2">
                      <Download className="h-4 w-4" />
                      다운로드
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 학습 가이드 */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-yellow-800 mb-1">학습 가이드</div>
                  <ul className="text-yellow-700 space-y-1 text-xs">
                    <li>• 틀린 문제의 개념을 먼저 복습한 후 재시험에 도전하세요</li>
                    <li>• 시간 제한을 두고 실전처럼 풀어보세요</li>
                    <li>• 틀린 문제는 다시 한 번 유사 문제로 연습하세요</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

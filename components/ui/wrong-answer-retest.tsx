'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { 
  RotateCcw,
  Target,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Sparkles,
  Download,
  Send,
  Eye,
  Plus
} from 'lucide-react';
import { Question, LearningResult, Difficulty } from '@/app/types';
import { dummyQuestions } from '@/app/lib/data/dummy-data';

interface WrongAnswerRetestProps {
  learningResults: LearningResult[];
  onRetestCreate?: (questions: Question[]) => void;
  studentId?: string;
}

interface WrongAnswerAnalysis {
  question: Question;
  wrongCount: number;
  lastAttempt: string;
  difficultyTrend: 'improving' | 'declining' | 'stable';
  similarQuestions: Question[];
}

export function WrongAnswerRetest({ 
  learningResults, 
  onRetestCreate,
  studentId 
}: WrongAnswerRetestProps) {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerAnalysis[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [retestMode, setRetestMode] = useState<'wrong_only' | 'with_similar' | 'adaptive'>('wrong_only');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    analyzeWrongAnswers();
  }, [learningResults]);

  // 오답 분석
  const analyzeWrongAnswers = async () => {
    setIsAnalyzing(true);
    
    // 오답 문제들을 수집하고 분석
    const wrongAnswerMap = new Map<string, {
      question: Question;
      attempts: Array<{ date: string; isCorrect: boolean; result: LearningResult }>;
    }>();

    // 모든 학습 결과에서 오답 수집
    learningResults.forEach(result => {
      result.answers.forEach(answer => {
        if (!answer.isCorrect) {
          const questionId = answer.questionId;
          const question = dummyQuestions.find(q => q.id === questionId);
          
          if (question) {
            if (!wrongAnswerMap.has(questionId)) {
              wrongAnswerMap.set(questionId, {
                question,
                attempts: []
              });
            }
            
            wrongAnswerMap.get(questionId)!.attempts.push({
              date: result.submittedAt,
              isCorrect: answer.isCorrect,
              result
            });
          }
        }
      });
    });

    // 분석 결과 생성
    const analyses: WrongAnswerAnalysis[] = [];
    
    for (const [questionId, data] of wrongAnswerMap) {
      const { question, attempts } = data;
      
      // 최근 시도들을 분석하여 트렌드 파악
      const recentAttempts = attempts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
      
      let difficultyTrend: 'improving' | 'declining' | 'stable' = 'stable';
      if (recentAttempts.length >= 2) {
        const correctCount = recentAttempts.filter(a => a.isCorrect).length;
        const oldCorrectCount = attempts.slice(3, 6).filter(a => a.isCorrect).length;
        
        if (correctCount > oldCorrectCount) {
          difficultyTrend = 'improving';
        } else if (correctCount < oldCorrectCount) {
          difficultyTrend = 'declining';
        }
      }
      
      // 유사 문제 찾기
      const similarQuestions = findSimilarQuestions(question, 3);
      
      analyses.push({
        question,
        wrongCount: attempts.length,
        lastAttempt: attempts[0].date,
        difficultyTrend,
        similarQuestions
      });
    }

    // 오답 빈도순으로 정렬
    analyses.sort((a, b) => b.wrongCount - a.wrongCount);
    
    setWrongAnswers(analyses);
    
    // 기본적으로 상위 오답 문제들을 선택
    const defaultSelected = new Set(
      analyses.slice(0, Math.min(5, analyses.length)).map(a => a.question.id)
    );
    setSelectedQuestions(defaultSelected);
    
    setIsAnalyzing(false);
  };

  // 유사 문제 찾기
  const findSimilarQuestions = (baseQuestion: Question, count: number): Question[] => {
    const candidates = dummyQuestions.filter(q => 
      q.id !== baseQuestion.id && 
      q.subject === baseQuestion.subject &&
      q.curriculum.chapterId === baseQuestion.curriculum.chapterId
    );

    return candidates
      .sort(() => Math.random() - 0.5) // 랜덤 셔플 (실제로는 유사도 기반 정렬)
      .slice(0, count);
  };

  // 문제 선택/해제
  const toggleQuestion = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  // 전체 선택/해제
  const toggleAllQuestions = () => {
    if (selectedQuestions.size === wrongAnswers.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(wrongAnswers.map(w => w.question.id)));
    }
  };

  // 재시험지 생성
  const createRetest = () => {
    const selectedWrongQuestions = wrongAnswers
      .filter(w => selectedQuestions.has(w.question.id))
      .map(w => w.question);
    
    let finalQuestions = [...selectedWrongQuestions];
    
    // 모드에 따른 추가 문제 포함
    if (retestMode === 'with_similar') {
      // 유사 문제도 포함
      wrongAnswers
        .filter(w => selectedQuestions.has(w.question.id))
        .forEach(w => {
          finalQuestions.push(...w.similarQuestions.slice(0, 1));
        });
    } else if (retestMode === 'adaptive') {
      // 적응형: 난이도 조절된 문제들 포함
      const adaptiveQuestions = generateAdaptiveQuestions(selectedWrongQuestions);
      finalQuestions.push(...adaptiveQuestions);
    }
    
    onRetestCreate?.(finalQuestions);
  };

  // 적응형 문제 생성
  const generateAdaptiveQuestions = (wrongQuestions: Question[]): Question[] => {
    const adaptive: Question[] = [];
    
    wrongQuestions.forEach(question => {
      // 한 단계 쉬운 문제 추가 (기초 다지기)
      const easierQuestions = dummyQuestions.filter(q => 
        q.subject === question.subject &&
        q.curriculum.chapterId === question.curriculum.chapterId &&
        getDifficultyLevel(q.difficulty) < getDifficultyLevel(question.difficulty)
      );
      
      if (easierQuestions.length > 0) {
        adaptive.push(easierQuestions[0]);
      }
    });
    
    return adaptive;
  };

  const getDifficultyLevel = (difficulty: Difficulty): number => {
    switch (difficulty) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      case 'highest': return 4;
    }
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'improving': return '개선 중';
      case 'declining': return '주의 필요';
      default: return '안정';
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
          <span className="font-medium">오답 분석 중...</span>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (wrongAnswers.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-semibold mb-2">완벽한 성과!</h3>
          <p className="text-gray-600">
            오답이 없어서 재시험지를 생성할 필요가 없습니다.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold">오답 재시험지 생성</h2>
            <Badge variant="outline">
              {wrongAnswers.length}개 오답 발견
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-1"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? '접기' : '미리보기'}
            </Button>
            <Button
              onClick={createRetest}
              disabled={selectedQuestions.size === 0}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              재시험지 생성 ({selectedQuestions.size}문항)
            </Button>
          </div>
        </div>

        {/* 생성 모드 선택 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setRetestMode('wrong_only')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              retestMode === 'wrong_only'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            오답만
          </button>
          <button
            onClick={() => setRetestMode('with_similar')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              retestMode === 'with_similar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            유사문제 포함
          </button>
          <button
            onClick={() => setRetestMode('adaptive')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              retestMode === 'adaptive'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            적응형 (기초→심화)
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-red-600">{wrongAnswers.length}</div>
            <div className="text-sm text-red-700">총 오답 문제</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">
              {wrongAnswers.filter(w => w.difficultyTrend === 'declining').length}
            </div>
            <div className="text-sm text-orange-700">주의 필요</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{selectedQuestions.size}</div>
            <div className="text-sm text-blue-700">선택된 문제</div>
          </div>
        </div>
      </Card>

      {/* 오답 문제 목록 */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">오답 문제 목록</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAllQuestions}
          >
            {selectedQuestions.size === wrongAnswers.length ? '전체 해제' : '전체 선택'}
          </Button>
        </div>

        <div className="space-y-3">
          {wrongAnswers.map((analysis, index) => (
            <div
              key={analysis.question.id}
              className={`p-4 border rounded-lg transition-colors ${
                selectedQuestions.has(analysis.question.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedQuestions.has(analysis.question.id)}
                  onChange={() => toggleQuestion(analysis.question.id)}
                  className="w-4 h-4 text-blue-600 mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <Badge className={getDifficultyColor(analysis.question.difficulty)}>
                      {getDifficultyLabel(analysis.question.difficulty)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(analysis.difficultyTrend)}
                      <span className="text-xs text-gray-600">
                        {getTrendLabel(analysis.difficultyTrend)}
                      </span>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {analysis.wrongCount}회 오답
                    </Badge>
                  </div>
                  
                  <p className="text-gray-900 mb-2 line-clamp-2">
                    {analysis.question.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>정답률: {analysis.question.correctRate}%</span>
                    <span>
                      최근 오답: {new Date(analysis.lastAttempt).toLocaleDateString()}
                    </span>
                    {analysis.similarQuestions.length > 0 && (
                      <span>유사문제: {analysis.similarQuestions.length}개</span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {analysis.question.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 미리보기 */}
      {showPreview && selectedQuestions.size > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">재시험지 미리보기</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold">{selectedQuestions.size}</div>
                <div className="text-sm text-gray-600">오답 문제</div>
              </div>
              {retestMode === 'with_similar' && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{selectedQuestions.size}</div>
                  <div className="text-sm text-gray-600">유사 문제</div>
                </div>
              )}
              {retestMode === 'adaptive' && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold">{Math.floor(selectedQuestions.size * 0.5)}</div>
                  <div className="text-sm text-gray-600">기초 문제</div>
                </div>
              )}
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {retestMode === 'wrong_only' ? selectedQuestions.size :
                   retestMode === 'with_similar' ? selectedQuestions.size * 2 :
                   Math.floor(selectedQuestions.size * 1.5)}
                </div>
                <div className="text-sm text-blue-700">총 문항 수</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>생성 모드:</strong> {
                  retestMode === 'wrong_only' ? '오답 문제만 포함' :
                  retestMode === 'with_similar' ? '오답 + 유사 문제 포함' :
                  '적응형 (기초 문제부터 단계적 학습)'
                }
              </p>
              <p>
                <strong>예상 소요시간:</strong> 약 {Math.ceil((selectedQuestions.size * 
                  (retestMode === 'wrong_only' ? 1 : retestMode === 'with_similar' ? 2 : 1.5)) * 2)}분
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

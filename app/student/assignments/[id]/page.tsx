'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  Target,
  Save,
  Send,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  useCurrentUser, 
  useAssignments,
  useLearningResults,
  useWorksheets,
  useAppContext
} from '@/app/lib/contexts/AppContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { LearningResult, Question } from '@/app/types';
import Link from 'next/link';

const AssignmentSolvePage = () => {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  const currentUser = useCurrentUser();
  const assignments = useAssignments(undefined, currentUser?.id);
  const learningResults = useLearningResults(currentUser?.id);
  const worksheets = useWorksheets();
  const { state, dispatch } = useAppContext();
  
  const assignment = assignments.find(a => a.id === assignmentId);
  const worksheet = assignment ? worksheets.find(w => w.id === assignment.worksheetId) : null;
  const existingResult = learningResults.find(r => r.assignmentId === assignmentId);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  const [startTime] = useState(new Date());
  const [questionStartTime, setQuestionStartTime] = useState(new Date());
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1초마다 시간 업데이트
    const timer = setInterval(() => {
      const now = new Date();
      const currentQuestionId = worksheet?.questions?.[currentQuestionIndex]?.id;
      if (currentQuestionId) {
        const elapsed = Math.floor((now.getTime() - questionStartTime.getTime()) / 1000);
        setTimeSpent(prev => ({
          ...prev,
          [currentQuestionId]: (prev[currentQuestionId] || 0) + 1
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, questionStartTime, worksheet]);

  useEffect(() => {
    // 문제 변경 시 시작 시간 리셋
    setQuestionStartTime(new Date());
  }, [currentQuestionIndex]);

  useEffect(() => {
    // 이미 제출된 과제가 있으면 결과 페이지로 리다이렉트
    if (existingResult) {
      router.push(`/student/assignments/${assignmentId}/result`);
    }
  }, [existingResult, assignmentId, router]);

  // 앱이 초기화되지 않았으면 로딩 표시
  if (!state.isInitialized) {
    return <LoadingSpinner />;
  }

  // 로그인되지 않았으면 로그인 필요 메시지 표시
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connected</h2>
          <p className="text-muted-foreground">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  if (currentUser.role !== 'student') {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>접근 권한이 없습니다.</p>
        </div>
      </MainLayout>
    );
  }

  if (!assignment || !worksheet) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">학습지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">요청하신 학습지가 존재하지 않거나 접근 권한이 없습니다.</p>
            <Link href="/student/assignments">
              <Button>학습지 목록으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (existingResult) {
    // 이미 제출된 과제는 결과 페이지로 리다이렉트 (useEffect에서 처리)
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold mb-2">이미 제출된 학습지입니다</h2>
            <p className="text-muted-foreground">결과 페이지로 이동합니다...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 안전한 currentQuestion 접근을 위한 유효성 검사
  const currentQuestion = worksheet?.questions?.[currentQuestionIndex];
  const totalQuestions = worksheet?.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions > 0 ? (currentQuestionIndex + 1) / totalQuestions * 100 : 0;

  // currentQuestion이 없는 경우 처리
  if (!currentQuestion && totalQuestions > 0) {
    // 인덱스가 범위를 벗어난 경우 첫 번째 문제로 리셋
    if (currentQuestionIndex >= totalQuestions) {
      setCurrentQuestionIndex(0);
      return null; // 리렌더링을 위해 null 반환
    }
  }

  const handleAnswerChange = (value: string) => {
    if (!currentQuestion) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleBookmark = () => {
    if (!currentQuestion) return;
    
    setBookmarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const now = new Date();
      const totalTimeSpent = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      
      // 답안 채점 (더미 로직)
      const questionAnswers = (worksheet?.questions || []).map(question => {
        const studentAnswer = answers[question.id] || '';
        const isCorrect = studentAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
        
        return {
          questionId: question.id,
          studentAnswer,
          isCorrect,
          timeSpent: timeSpent[question.id] || 0
        };
      });
      
      const correctCount = questionAnswers.filter(a => a.isCorrect).length;
      const totalScore = Math.round((correctCount / totalQuestions) * 100);
      const correctRate = Math.round((correctCount / totalQuestions) * 100);
      
      // 난이도별 성과 계산
      const difficultyPerformance = {
        low: { correct: 0, total: 0, rate: 0 },
        medium: { correct: 0, total: 0, rate: 0 },
        high: { correct: 0, total: 0, rate: 0 },
        highest: { correct: 0, total: 0, rate: 0 }
      };
      
      (worksheet?.questions || []).forEach((question, index) => {
        const answer = questionAnswers[index];
        const difficulty = question.difficulty;
        
        difficultyPerformance[difficulty].total++;
        if (answer.isCorrect) {
          difficultyPerformance[difficulty].correct++;
        }
      });
      
      // 난이도별 정답률 계산
      Object.keys(difficultyPerformance).forEach(key => {
        const perf = difficultyPerformance[key as keyof typeof difficultyPerformance];
        perf.rate = perf.total > 0 ? Math.round((perf.correct / perf.total) * 100) : 0;
      });
      
      const learningResult: LearningResult = {
        id: `result-${Date.now()}`,
        studentId: currentUser.id,
        assignmentId: assignment.id,
        worksheetId: worksheet.id,
        answers: questionAnswers,
        submittedAt: now.toISOString(),
        totalScore,
        correctRate,
        totalTimeSpent,
        difficultyPerformance,
        gradingStatus: 'auto_graded'
      };
      
      dispatch({ type: 'ADD_LEARNING_RESULT', payload: learningResult });
      
      // 결과 페이지로 이동
      router.push(`/student/assignments/${assignmentId}/result`);
      
    } catch (error) {
      console.error('제출 실패:', error);
      alert('제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const unansweredQuestions = worksheet?.questions?.filter(q => !answers[q.id]).length || 0;

  // 데이터 로딩 중이거나 문제가 없는 경우 처리
  if (!currentQuestion) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto container-mobile space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">
                {totalQuestions === 0 ? '문제가 없습니다' : '문제를 불러오는 중...'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {totalQuestions === 0 
                  ? '이 학습지에는 아직 문제가 추가되지 않았습니다.' 
                  : '잠시만 기다려주세요.'
                }
              </p>
              <Link href="/student/assignments">
                <Button>학습지 목록으로 돌아가기</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto container-mobile space-y-4 sm:space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/student/assignments">
              <Button variant="ghost" size="sm" className="gap-2 touch-target">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">학습지 목록</span>
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold line-clamp-1">{assignment.title}</h1>
              <p className="text-muted-foreground text-sm line-clamp-1">{worksheet.title}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))}</span>
            </div>
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {totalQuestions}
            </Badge>
          </div>
        </div>

        {/* 진행률 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">진행률</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* 메인 문제 영역 */}
          <div className="lg:col-span-3">
            <Card className="card-mobile">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">문제 {currentQuestionIndex + 1}</span>
                    <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                      {getDifficultyLabel(currentQuestion.difficulty)}
                    </Badge>
                    {currentQuestion.source !== 'internal' && (
                      <Badge variant="outline" className="text-xs">
                        {currentQuestion.source === 'textbook' ? '교재' : '기출'}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmark}
                    className={`touch-target ${bookmarkedQuestions.has(currentQuestion.id) ? 'text-yellow-600' : ''}`}
                  >
                    {bookmarkedQuestions.has(currentQuestion.id) ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 문제 내용 */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {currentQuestion.content}
                  </p>
                </div>

                {/* 답안 입력 */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">답안</label>
                  
                  {currentQuestion.type === 'multiple_choice' && currentQuestion.choices ? (
                    <div className="space-y-2">
                      {currentQuestion.choices.map((choice, index) => (
                        <label key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={choice}
                            checked={answers[currentQuestion.id] === choice}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            className="w-4 h-4"
                          />
                          <span>{choice}</span>
                        </label>
                      ))}
                    </div>
                  ) : currentQuestion.type === 'short_answer' ? (
                    <Input
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="답안을 입력하세요"
                      className="text-lg"
                    />
                  ) : (
                    <Textarea
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="답안을 입력하세요"
                      rows={4}
                      className="text-lg"
                    />
                  )}
                </div>

                {/* 네비게이션 버튼 */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => goToQuestion(currentQuestionIndex - 1)}
                    disabled={currentQuestionIndex === 0}
                    className="gap-2 btn-mobile"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    이전 문제
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 btn-mobile order-last sm:order-none"
                  >
                    <Save className="h-4 w-4" />
                    임시저장
                  </Button>
                  
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <Button
                      onClick={() => setShowSubmitDialog(true)}
                      className="gap-2 btn-mobile"
                    >
                      <Send className="h-4 w-4" />
                      제출하기
                    </Button>
                  ) : (
                    <Button
                      onClick={() => goToQuestion(currentQuestionIndex + 1)}
                      className="gap-2 btn-mobile"
                    >
                      다음 문제
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-4">
            {/* 문제 네비게이션 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">문제 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {worksheet?.questions?.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(index)}
                      className={`
                        w-8 h-8 rounded text-xs font-medium transition-colors
                        ${index === currentQuestionIndex 
                          ? 'bg-primary text-primary-foreground' 
                          : answers[question.id]
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-muted hover:bg-muted/80'
                        }
                        ${bookmarkedQuestions.has(question.id) ? 'ring-2 ring-yellow-400' : ''}
                      `}
                    >
                      {index + 1}
                    </button>
                  )) || []}
                </div>
                
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>현재 문제</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span>답안 작성 완료</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted border rounded"></div>
                    <span>미완료</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-yellow-400 rounded"></div>
                    <span>북마크</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 과제 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">학습지 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">총 문항:</span>
                  <span className="ml-2 font-medium">{totalQuestions}문제</span>
                </div>
                <div>
                  <span className="text-muted-foreground">완료:</span>
                  <span className="ml-2 font-medium">{answeredCount}문제</span>
                </div>
                <div>
                  <span className="text-muted-foreground">마감일:</span>
                  <span className="ml-2 font-medium">
                    {new Date(assignment.dueDate).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">소요시간:</span>
                  <span className="ml-2 font-medium">
                    {formatTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 북마크된 문제 */}
            {bookmarkedQuestions.size > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-yellow-600" />
                    북마크 ({bookmarkedQuestions.size})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Array.from(bookmarkedQuestions).map(questionId => {
                      const questionIndex = worksheet?.questions?.findIndex(q => q.id === questionId) ?? -1;
                      if (questionIndex === -1) return null;
                      return (
                        <button
                          key={questionId}
                          onClick={() => goToQuestion(questionIndex)}
                          className="w-full text-left p-2 rounded hover:bg-muted/50 text-sm"
                        >
                          문제 {questionIndex + 1}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 제출 확인 다이얼로그 */}
        {showSubmitDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                  학습지 제출
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p>학습지를 제출하시겠습니까?</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• 총 {totalQuestions}문제 중 {answeredCount}문제 완료</div>
                    {unansweredQuestions > 0 && (
                      <div className="text-orange-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {unansweredQuestions}문제가 미완료 상태입니다
                      </div>
                    )}
                    <div>• 제출 후에는 수정할 수 없습니다</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitDialog(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? '제출 중...' : '제출하기'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AssignmentSolvePage;
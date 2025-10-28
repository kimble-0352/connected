'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  BookOpen,
  Eye,
  Download,
  Clock,
  Target,
  TrendingUp,
  Brain,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { 
  useCurrentUser, 
  useAssignments,
  useLearningResults,
  useWorksheets
} from '@/app/lib/contexts/AppContext';
import { SimilarQuestions } from '@/components/features/SimilarQuestions';
import { RetestWorksheetGenerator } from '@/components/features/RetestWorksheetGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const AssignmentResultPage = () => {
  const params = useParams();
  const assignmentId = params.id as string;
  const currentUser = useCurrentUser();
  const assignments = useAssignments(undefined, currentUser?.id);
  const learningResults = useLearningResults(currentUser?.id);
  const worksheets = useWorksheets();
  
  const assignment = assignments.find(a => a.id === assignmentId);
  const result = learningResults.find(r => r.assignmentId === assignmentId);
  const worksheet = assignment ? worksheets.find(w => w.id === assignment.worksheetId) : null;

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

  if (!assignment || !result || !worksheet) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">결과를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">요청하신 과제 결과가 존재하지 않습니다.</p>
            <Link href="/student/assignments">
              <Button>과제 목록으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분 ${secs}초`;
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return '우수한 성과입니다! 🎉';
    if (score >= 80) return '좋은 결과네요! 👏';
    if (score >= 70) return '잘했어요! 💪';
    if (score >= 60) return '조금 더 노력해봐요! 📚';
    return '다음엔 더 잘할 수 있을 거예요! 💪';
  };

  const correctAnswers = result.answers.filter(a => a.isCorrect).length;
  const wrongAnswers = result.answers.filter(a => !a.isCorrect).length;
  const averageTimePerQuestion = Math.round(result.totalTimeSpent / worksheet.questions.length);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Link href="/student/assignments">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                과제 목록
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{assignment.title}</h1>
              <p className="text-muted-foreground mt-1">{worksheet.title}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              결과 다운로드
            </Button>
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              오답노트
            </Button>
          </div>
        </div>

        {/* 점수 및 성과 요약 */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.totalScore)}`}>
                {result.totalScore}점
              </div>
              <div className="text-xl text-muted-foreground mb-4">
                정답률 {result.correctRate}%
              </div>
              <p className="text-lg font-medium text-gray-700">
                {getPerformanceMessage(result.totalScore)}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-muted-foreground">정답</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
                <div className="text-sm text-muted-foreground">오답</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatTime(result.totalTimeSpent)}</div>
                <div className="text-sm text-muted-foreground">소요시간</div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* 탭 구조 */}
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary" className="gap-2">
              <Target className="h-4 w-4" />
              학습요약
            </TabsTrigger>
            <TabsTrigger value="questions" className="gap-2">
              <BookOpen className="h-4 w-4" />
              문제별 결과
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2">
              <Brain className="h-4 w-4" />
              AI 학습분석
            </TabsTrigger>
          </TabsList>

          {/* 학습요약 탭 */}
          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 과제 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    과제 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">과제명:</span>
                    <div className="font-medium mt-1">{assignment.title}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">학습지:</span>
                    <div className="font-medium mt-1">{worksheet.title}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">배정일:</span>
                    <div className="font-medium mt-1">{formatDate(assignment.assignedAt)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">제출일:</span>
                    <div className="font-medium mt-1">{formatDate(result.submittedAt)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">마감일:</span>
                    <div className="font-medium mt-1">{formatDate(assignment.dueDate)}</div>
                  </div>
                </CardContent>
              </Card>

              {/* 난이도별 성과 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    난이도별 성과
                  </CardTitle>
                  <CardDescription>각 난이도별 정답률을 확인하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(result.difficultyPerformance).map(([difficulty, performance]) => {
                      if (performance.total === 0) return null;
                      
                      return (
                        <div key={difficulty} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={getDifficultyColor(difficulty)}>
                                {getDifficultyLabel(difficulty)}
                              </Badge>
                              <span className="text-sm">
                                {performance.correct}/{performance.total} 정답
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {performance.rate}%
                            </span>
                          </div>
                          <Progress value={performance.rate} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 시간 분석 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    시간 분석
                  </CardTitle>
                  <CardDescription>문제 해결 시간 패턴을 분석합니다</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {formatTime(result.totalTimeSpent)}
                      </div>
                      <div className="text-xs text-muted-foreground">총 소요시간</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {Math.round(averageTimePerQuestion)}초
                      </div>
                      <div className="text-xs text-muted-foreground">평균 시간</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>가장 빠른 문제:</span>
                      <span className="font-medium">
                        {Math.min(...result.answers.map(a => a.timeSpent))}초
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>가장 오래 걸린 문제:</span>
                      <span className="font-medium">
                        {Math.max(...result.answers.map(a => a.timeSpent))}초
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>시간 효율성:</span>
                      <span className="font-medium">
                        {averageTimePerQuestion < 60 ? '우수' : averageTimePerQuestion < 120 ? '보통' : '개선필요'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 문제별 결과 탭 */}
          <TabsContent value="questions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 문제 풀이 내역 */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      문제 풀이 내역
                    </CardTitle>
                    <CardDescription>각 문제의 정답 여부와 소요 시간을 확인하세요</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {worksheet.questions.map((question, index) => {
                        const answer = result.answers[index];
                        const isCorrect = answer?.isCorrect;
                        
                        return (
                          <div key={question.id} className="flex items-start justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-medium">문제 {index + 1}</span>
                                <Badge className={getDifficultyColor(question.difficulty)}>
                                  {getDifficultyLabel(question.difficulty)}
                                </Badge>
                                {isCorrect ? (
                                  <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3" />
                                    정답
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive" className="gap-1">
                                    <XCircle className="h-3 w-3" />
                                    오답
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {question.content}
                              </p>
                              
                              <div className="space-y-1 text-sm">
                                <div>
                                  <span className="text-muted-foreground">내 답안:</span>
                                  <span className="ml-2 font-medium">
                                    {answer?.studentAnswer || '미작성'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">정답:</span>
                                  <span className="ml-2 font-medium text-green-600">
                                    {question.correctAnswer}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right ml-4">
                              <div className="text-sm text-muted-foreground">소요시간</div>
                              <div className="font-medium">
                                {formatTime(answer?.timeSpent || 0)}
                              </div>
                              <Button variant="ghost" size="sm" className="mt-2">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 오답 재시험지 생성 */}
              <RetestWorksheetGenerator
                studentId={currentUser.id}
                originalWorksheetId={worksheet.id}
                learningResult={result}
                onWorksheetGenerated={(worksheet) => {
                  console.log('재시험지 생성됨:', worksheet);
                }}
              />

              {/* 유사 문항 추천 */}
              {result.answers.find(a => !a.isCorrect) && (
                <SimilarQuestions
                  originalQuestionId={result.answers.find(a => !a.isCorrect)!.questionId}
                  onQuestionSelect={(question) => {
                    console.log('유사 문제 선택됨:', question);
                  }}
                  maxQuestions={3}
                />
              )}
            </div>
          </TabsContent>

          {/* AI 학습분석 탭 */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 강점 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    강점
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800 mb-1">
                      {result.totalScore >= 90 ? '뛰어난 문제 해결력' : 
                       result.totalScore >= 80 ? '안정적인 학습 능력' : 
                       result.totalScore >= 70 ? '기본기가 탄탄함' : '꾸준한 노력'}
                    </div>
                    <p className="text-sm text-green-700">
                      {result.totalScore >= 90 ? '대부분의 문제를 정확하게 해결했습니다.' : 
                       result.totalScore >= 80 ? '전반적으로 좋은 성과를 보였습니다.' : 
                       result.totalScore >= 70 ? '기본 개념을 잘 이해하고 있습니다.' : '포기하지 않고 끝까지 풀었습니다.'}
                    </p>
                  </div>
                  
                  {Object.entries(result.difficultyPerformance)
                    .filter(([_, performance]) => performance.rate >= 80 && performance.total > 0)
                    .map(([difficulty, performance]) => (
                      <div key={difficulty} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm font-medium">
                          {getDifficultyLabel(difficulty)} 난이도 우수
                        </span>
                        <Badge className="bg-green-100 text-green-800">
                          {performance.rate}%
                        </Badge>
                      </div>
                    ))}
                  
                  {averageTimePerQuestion < 60 && (
                    <div className="p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium text-green-800">빠른 문제 해결</span>
                      <p className="text-xs text-green-700">효율적으로 문제를 해결합니다</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 약점 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    약점
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(result.difficultyPerformance)
                    .filter(([_, performance]) => performance.rate < 60 && performance.total > 0)
                    .map(([difficulty, performance]) => (
                      <div key={difficulty} className="p-3 bg-orange-50 rounded-lg">
                        <div className="font-medium text-orange-800 mb-1">
                          {getDifficultyLabel(difficulty)} 난이도 보완 필요
                        </div>
                        <p className="text-sm text-orange-700">
                          정답률 {performance.rate}% ({performance.correct}/{performance.total})
                        </p>
                      </div>
                    ))}
                  
                  {wrongAnswers > correctAnswers && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-orange-800 mb-1">정확성 향상 필요</div>
                      <p className="text-sm text-orange-700">
                        오답이 정답보다 많습니다. 신중하게 문제를 읽어보세요.
                      </p>
                    </div>
                  )}
                  
                  {averageTimePerQuestion > 120 && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-orange-800 mb-1">시간 관리 개선</div>
                      <p className="text-sm text-orange-700">
                        문제당 평균 {Math.round(averageTimePerQuestion)}초로 시간이 오래 걸립니다.
                      </p>
                    </div>
                  )}
                  
                  {Object.entries(result.difficultyPerformance).every(([_, performance]) => performance.total === 0 || performance.rate >= 60) && 
                   wrongAnswers <= correctAnswers && 
                   averageTimePerQuestion <= 120 && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-600 mb-1">특별한 약점 없음</div>
                      <p className="text-sm text-gray-600">
                        전반적으로 균형잡힌 학습 상태입니다.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 개선점 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Lightbulb className="h-5 w-5" />
                    개선점
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.totalScore < 80 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800 mb-1">기본 개념 복습</div>
                      <p className="text-sm text-blue-700">
                        틀린 문제들을 다시 풀어보며 개념을 정리해보세요.
                      </p>
                    </div>
                  )}
                  
                  {wrongAnswers > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800 mb-1">오답 노트 작성</div>
                      <p className="text-sm text-blue-700">
                        {wrongAnswers}개의 틀린 문제를 정리하여 같은 실수를 방지하세요.
                      </p>
                    </div>
                  )}
                  
                  {averageTimePerQuestion > 90 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800 mb-1">시간 단축 연습</div>
                      <p className="text-sm text-blue-700">
                        유사한 문제를 반복 연습하여 풀이 속도를 높여보세요.
                      </p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800 mb-1">다음 학습 목표</div>
                    <p className="text-sm text-blue-700">
                      {result.totalScore >= 90 ? '더 어려운 문제에 도전해보세요!' :
                       result.totalScore >= 80 ? '90점 이상을 목표로 해보세요!' :
                       result.totalScore >= 70 ? '80점 이상을 목표로 해보세요!' :
                       '70점 이상을 목표로 꾸준히 연습하세요!'}
                    </p>
                  </div>
                  
                  {Object.entries(result.difficultyPerformance)
                    .filter(([_, performance]) => performance.rate < 80 && performance.total > 0)
                    .slice(0, 1)
                    .map(([difficulty]) => (
                      <div key={difficulty} className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium text-blue-800 mb-1">
                          {getDifficultyLabel(difficulty)} 난이도 집중 학습
                        </div>
                        <p className="text-sm text-blue-700">
                          해당 난이도의 문제를 더 많이 풀어보세요.
                        </p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AssignmentResultPage;
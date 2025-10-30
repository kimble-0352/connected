'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  Clock,
  Target,
  Award,
  BookOpen,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle,
  Download,
  Filter,
  Brain,
  Lightbulb,
  Focus,
  TrendingDown,
  Star,
  ArrowRight,
  Zap,
  ArrowLeft,
  User
} from 'lucide-react';
import { 
  useCurrentUser, 
  useAssignments,
  useLearningResults,
  useWorksheets,
  useStudents,
  useAppContext
} from '@/app/lib/contexts/AppContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { getStudentStats, getAIAnalysisData } from '@/app/lib/data/dummy-data';
import Link from 'next/link';

const TeacherStudentReportsPage = () => {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  const currentUser = useCurrentUser();
  const { state } = useAppContext();
  const students = useStudents(currentUser?.id);
  const assignments = useAssignments(currentUser?.id);
  const learningResults = useLearningResults();
  const worksheets = useWorksheets(currentUser?.id);
  
  const [timePeriod, setTimePeriod] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('comprehensive');

  // 해당 학생 정보 찾기
  const student = students.find(s => s.id === studentId);
  
  // 해당 학생의 데이터만 필터링
  const studentAssignments = assignments.filter(a => a.studentIds.includes(studentId));
  const studentResults = learningResults.filter(r => r.studentId === studentId);
  const advancedStats = getStudentStats(studentId);
  const aiAnalysisData = getAIAnalysisData(studentId);

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

  // 선생님 권한 확인
  if (currentUser.role !== 'teacher') {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>접근 권한이 없습니다.</p>
        </div>
      </MainLayout>
    );
  }

  // 학생이 존재하지 않는 경우
  if (!student) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">학생을 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">요청하신 학생이 존재하지 않거나 접근 권한이 없습니다.</p>
            <Link href="/teacher/students">
              <Button>학생 목록으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 필터링된 결과 계산
  const filteredResults = studentResults.filter(result => {
    // 시간 필터
    if (timePeriod !== 'all') {
      const resultDate = new Date(result.submittedAt);
      const now = new Date();
      const daysAgo = parseInt(timePeriod);
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      
      if (resultDate < cutoffDate) return false;
    }
    
    // 과목 필터
    if (subjectFilter !== 'all') {
      const assignment = studentAssignments.find(a => a.id === result.assignmentId);
      const worksheet = assignment ? worksheets.find(w => w.id === assignment.worksheetId) : null;
      if (!worksheet || worksheet.subject !== subjectFilter) return false;
    }
    
    return true;
  });

  // 통계 계산
  const totalAssignments = studentAssignments.length;
  const completedAssignments = studentResults.length;
  const averageScore = filteredResults.length > 0 
    ? filteredResults.reduce((sum, r) => sum + r.totalScore, 0) / filteredResults.length 
    : 0;
  const totalStudyTime = filteredResults.reduce((sum, r) => sum + r.totalTimeSpent, 0);
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  // 최근 성적 추이 (최근 5개)
  const recentResults = [...filteredResults]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  // 과목별 성과
  const subjectPerformance = ['math', 'english', 'korean'].map(subject => {
    const subjectResults = filteredResults.filter(result => {
      const assignment = studentAssignments.find(a => a.id === result.assignmentId);
      const worksheet = assignment ? worksheets.find(w => w.id === assignment.worksheetId) : null;
      return worksheet?.subject === subject;
    });
    
    const avgScore = subjectResults.length > 0 
      ? subjectResults.reduce((sum, r) => sum + r.totalScore, 0) / subjectResults.length 
      : 0;
    
    return {
      subject,
      name: subject === 'math' ? '수학' : subject === 'english' ? '영어' : '국어',
      count: subjectResults.length,
      averageScore: avgScore,
      totalTime: subjectResults.reduce((sum, r) => sum + r.totalTimeSpent, 0)
    };
  }).filter(s => s.count > 0);

  // 난이도별 성과
  const difficultyPerformance = {
    low: { correct: 0, total: 0, rate: 0 },
    medium: { correct: 0, total: 0, rate: 0 },
    high: { correct: 0, total: 0, rate: 0 },
    highest: { correct: 0, total: 0, rate: 0 }
  };

  filteredResults.forEach(result => {
    Object.entries(result.difficultyPerformance).forEach(([difficulty, perf]) => {
      const key = difficulty as keyof typeof difficultyPerformance;
      difficultyPerformance[key].correct += perf.correct;
      difficultyPerformance[key].total += perf.total;
    });
  });

  Object.keys(difficultyPerformance).forEach(key => {
    const perf = difficultyPerformance[key as keyof typeof difficultyPerformance];
    perf.rate = perf.total > 0 ? Math.round((perf.correct / perf.total) * 100) : 0;
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
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
      'low': 'bg-green-500',
      'medium': 'bg-blue-500',
      'high': 'bg-orange-500',
      'highest': 'bg-red-500'
    };
    return colorMap[difficulty as keyof typeof colorMap] || 'bg-gray-500';
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/teacher/students/${studentId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                학생 상세로 돌아가기
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{student.name} 학습 리포트</h1>
              <p className="text-muted-foreground mt-1">
                {student.name} 학생의 학습 성과와 성장 과정을 확인해보세요
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              리포트 다운로드
            </Button>
          </div>
        </div>

        {/* 필터 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">필터:</span>
              </div>
              
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 기간</SelectItem>
                  <SelectItem value="7">최근 1주일</SelectItem>
                  <SelectItem value="30">최근 1개월</SelectItem>
                  <SelectItem value="90">최근 3개월</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 과목</SelectItem>
                  <SelectItem value="math">수학</SelectItem>
                  <SelectItem value="english">영어</SelectItem>
                  <SelectItem value="korean">국어</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 탭 시스템 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comprehensive" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              종합 리포트
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI 학습분석
            </TabsTrigger>
          </TabsList>

          {/* 종합 리포트 탭 */}
          <TabsContent value="comprehensive" className="mt-6 space-y-6">
            {/* 주요 지표 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="완료율"
                value={`${Math.round(completionRate)}%`}
                icon={TrendingUp}
                variant="success"
              />
              <StatsCard
                title="평균 점수"
                value={`${Math.round(averageScore)}점`}
                icon={Target}
                variant="gradient"
              />
              <StatsCard
                title="총 학습시간"
                value={formatTime(totalStudyTime)}
                icon={Clock}
                variant="info"
              />
              <StatsCard
                title="완료 과제"
                value={filteredResults.length}
                icon={Award}
                variant="warning"
              />
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 성적 추이 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  최근 성적 추이
                </CardTitle>
                <CardDescription>최근 완료한 과제들의 점수 변화</CardDescription>
              </CardHeader>
              <CardContent>
                {recentResults.length > 0 ? (
                  <div className="space-y-4">
                    {/* 간단한 차트 시뮬레이션 */}
                    <div className="flex items-end justify-between h-32 gap-2">
                      {recentResults.reverse().map((result, index) => {
                        const height = (result.totalScore / 100) * 100; // 100px 기준
                        return (
                          <div key={result.id} className="flex flex-col items-center gap-2">
                            <div className="text-xs font-medium">{result.totalScore}점</div>
                            <div 
                              className="w-8 bg-blue-500 rounded-t"
                              style={{ height: `${height}px` }}
                            />
                            <div className="text-xs text-muted-foreground">
                              {formatDate(result.submittedAt)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* 추이 분석 */}
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {Math.max(...recentResults.map(r => r.totalScore))}점
                          </div>
                          <div className="text-xs text-muted-foreground">최고점</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {Math.round(recentResults.reduce((sum, r) => sum + r.totalScore, 0) / recentResults.length)}점
                          </div>
                          <div className="text-xs text-muted-foreground">평균점</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-600">
                            {Math.min(...recentResults.map(r => r.totalScore))}점
                          </div>
                          <div className="text-xs text-muted-foreground">최저점</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>분석할 데이터가 부족합니다</p>
                    <p className="text-xs">더 많은 과제를 완료해보세요!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 과목별 성과 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  과목별 성과
                </CardTitle>
                <CardDescription>각 과목별 평균 점수와 학습 시간</CardDescription>
              </CardHeader>
              <CardContent>
                {subjectPerformance.length > 0 ? (
                  <div className="space-y-4">
                    {subjectPerformance.map(subject => (
                      <div key={subject.subject} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{subject.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {subject.count}개 과제
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{Math.round(subject.averageScore)}점</div>
                            <div className="text-xs text-muted-foreground">
                              {formatTime(subject.totalTime)}
                            </div>
                          </div>
                        </div>
                        <Progress value={subject.averageScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <PieChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>과목별 데이터가 없습니다</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 난이도별 성과 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  난이도별 성과
                </CardTitle>
                <CardDescription>각 난이도별 정답률 분석</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(difficultyPerformance).map(([difficulty, performance]) => {
                    if (performance.total === 0) return null;
                    
                    return (
                      <div key={difficulty} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getDifficultyColor(difficulty)}`} />
                            <span className="font-medium">{getDifficultyLabel(difficulty)}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{performance.rate}%</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({performance.correct}/{performance.total})
                            </span>
                          </div>
                        </div>
                        <Progress value={performance.rate} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 학습 현황 요약 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">학습 현황</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.round(averageScore)}점
                  </div>
                  <p className="text-sm text-muted-foreground">전체 평균 점수</p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>완료한 과제:</span>
                    <span className="font-medium">{completedAssignments}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span>총 학습시간:</span>
                    <span className="font-medium">{formatTime(totalStudyTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>평균 소요시간:</span>
                    <span className="font-medium">
                      {completedAssignments > 0 ? formatTime(Math.round(totalStudyTime / completedAssignments)) : '0분'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>완료율:</span>
                    <span className="font-medium">{Math.round(completionRate)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 취약 유형 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  취약 유형
                </CardTitle>
              </CardHeader>
              <CardContent>
                {advancedStats?.weaknessTypes && advancedStats.weaknessTypes.length > 0 ? (
                  <div className="space-y-3">
                    {advancedStats.weaknessTypes.slice(0, 3).map((weakness, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{weakness.type}</span>
                          <span className="text-muted-foreground">{weakness.correctRate}%</span>
                        </div>
                        <Progress value={weakness.correctRate} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {weakness.questionCount}문제 중 {Math.round(weakness.questionCount * weakness.correctRate / 100)}문제 정답
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">특별한 취약점이 없습니다!</p>
                    <p className="text-xs">계속 좋은 성과를 유지하고 있어요 👏</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 최근 활동 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최근 활동</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentResults.slice(0, 3).map((result) => {
                    const assignment = studentAssignments.find(a => a.id === result.assignmentId);
                    return (
                      <div key={result.id} className="flex items-center justify-between text-sm">
                        <div>
                          <div className="font-medium line-clamp-1">
                            {assignment?.title || '과제'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(result.submittedAt)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{result.totalScore}점</div>
                          <div className="text-xs text-muted-foreground">
                            {result.correctRate}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {recentResults.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <Calendar className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">최근 활동이 없습니다</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </TabsContent>

          {/* AI 학습분석 탭 */}
          <TabsContent value="ai-analysis" className="mt-6 space-y-6">
            {aiAnalysisData ? (
              <div className="space-y-6">
                {/* 과목별 AI 분석 */}
                {(['math', 'english', 'korean'] as const)
                  .filter(subject => subjectFilter === 'all' || subject === subjectFilter)
                  .map(subject => {
                  const subjectData = aiAnalysisData.subjects[subject];
                  const subjectName = subject === 'math' ? '수학' : subject === 'english' ? '영어' : '국어';
                  
                  return (
                    <Card key={subject}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-600" />
                          {subjectName} AI 학습분석
                        </CardTitle>
                        <CardDescription>
                          AI가 분석한 {student.name} 학생의 {subjectName} 학습 패턴과 개선 방향
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* 강점 */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Star className="h-5 w-5 text-yellow-500" />
                              <h4 className="font-semibold text-lg">강점</h4>
                            </div>
                            <div className="space-y-2">
                              {subjectData.strengths.map((strength, index) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-green-800">{strength}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 약점 */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-5 w-5 text-red-500" />
                              <h4 className="font-semibold text-lg">약점</h4>
                            </div>
                            <div className="space-y-2">
                              {subjectData.weaknesses.map((weakness, index) => (
                                <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-red-800">{weakness}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 집중도 지수 */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Focus className="h-5 w-5 text-purple-600" />
                            <h4 className="font-semibold text-lg">집중도 지수</h4>
                            <Badge variant="outline" className="ml-auto">
                              {subjectData.focusIndex}점
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>종합 집중도</span>
                              <span className="font-medium">{subjectData.focusIndex}/100</span>
                            </div>
                            <Progress value={subjectData.focusIndex} className="h-3" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-lg font-bold text-blue-600">
                                  {subjectData.focusFactors.consistentPace}%
                                </div>
                                <div className="text-xs text-blue-800">일정한 풀이속도</div>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-lg font-bold text-green-600">
                                  {subjectData.focusFactors.lowSkipRate}%
                                </div>
                                <div className="text-xs text-green-800">낮은 건너뛰기 비율</div>
                              </div>
                              <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="text-lg font-bold text-purple-600">
                                  {subjectData.focusFactors.highCompletionRate}%
                                </div>
                                <div className="text-xs text-purple-800">높은 과제완료율</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 추천 학습 방향 */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-orange-500" />
                            <h4 className="font-semibold text-lg">추천 학습 방향</h4>
                          </div>
                          <div className="space-y-3">
                            {subjectData.recommendedLearningPath.map((recommendation, index) => (
                              <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                                <div className="flex items-center justify-center w-6 h-6 bg-orange-200 text-orange-800 rounded-full text-xs font-bold flex-shrink-0">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <span className="text-sm text-orange-900">{recommendation}</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 마지막 업데이트 */}
                        <div className="text-xs text-muted-foreground text-right">
                          마지막 분석: {new Date(subjectData.lastUpdated).toLocaleDateString('ko-KR')}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* 개별 과목 선택 시 AI 코치 추천 */}
                {subjectFilter !== 'all' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-indigo-600" />
                        {subjectFilter === 'math' ? '수학' : subjectFilter === 'english' ? '영어' : '국어'} AI 코치 추천
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-indigo-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-indigo-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-indigo-900 mb-2">맞춤형 학습 전략</div>
                            <div className="text-sm text-indigo-800">
                              {subjectFilter === 'math' && '수학적 사고력과 계산 능력을 균형있게 발전시키면서, 약점 영역에 대한 체계적인 보완 학습을 통해 실력을 향상시켜보세요.'}
                              {subjectFilter === 'english' && '문법 기초를 탄탄히 하면서 독해와 어휘력을 동시에 늘려가는 것이 중요합니다. 꾸준한 영어 노출을 통해 실력을 키워보세요.'}
                              {subjectFilter === 'korean' && '문학 감상 능력을 바탕으로 문법과 어법 실력을 보완하면, 더욱 균형잡힌 국어 실력을 갖출 수 있을 것입니다.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI 분석 요약 */}
                {subjectFilter === 'all' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-indigo-600" />
                        종합 AI 분석 요약
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(['math', 'english', 'korean'] as const).map(subject => {
                          const subjectData = aiAnalysisData.subjects[subject];
                          const subjectName = subject === 'math' ? '수학' : subject === 'english' ? '영어' : '국어';
                          
                          return (
                            <div key={subject} className="text-center p-4 border rounded-lg">
                              <div className="text-2xl font-bold text-indigo-600 mb-2">
                                {subjectData.focusIndex}
                              </div>
                              <div className="text-sm font-medium mb-1">{subjectName} 집중도</div>
                              <div className="text-xs text-muted-foreground">
                                {subjectData.focusIndex >= 80 ? '우수' : 
                                 subjectData.focusIndex >= 60 ? '보통' : '개선 필요'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    
                      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Brain className="h-5 w-5 text-indigo-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-indigo-900 mb-2">AI 학습 코치 추천</div>
                            <div className="text-sm text-indigo-800">
                              {student.name} 학생은 현재 학습 패턴을 분석한 결과, 꾸준한 학습 습관과 우수한 이해력을 보이고 있습니다. 
                              약점 영역에 대한 집중적인 보완 학습을 통해 더욱 향상된 성과를 기대할 수 있습니다.
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">AI 분석 데이터 준비 중</h3>
                <p className="text-muted-foreground">
                  더 많은 학습 데이터가 축적되면 AI 분석을 제공해드립니다.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TeacherStudentReportsPage;


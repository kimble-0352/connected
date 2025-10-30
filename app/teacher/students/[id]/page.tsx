'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  TrendingUp,
  Clock,
  Target,
  Eye,
  BookOpen,
  ClipboardList,
  Calendar,
  AlertCircle,
  CheckCircle,
  Timer,
  Award,
  BarChart3,
  Filter
} from 'lucide-react';
import { 
  useCurrentUser, 
  useStudents,
  useAssignments,
  useLearningResults,
  useWorksheets,
  useAppContext
} from '@/app/lib/contexts/AppContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Subject } from '@/app/types';
import Link from 'next/link';

const StudentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  const currentUser = useCurrentUser();
  const { state } = useAppContext();
  const students = useStudents(currentUser?.id);
  const assignments = useAssignments(currentUser?.id);
  const learningResults = useLearningResults();
  const worksheets = useWorksheets(currentUser?.id);
  
  // 과목별 필터링 상태
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  
  const student = students.find(s => s.id === studentId);
  const studentAssignments = assignments.filter(a => a.studentIds.includes(studentId));
  const studentResults = learningResults.filter(r => r.studentId === studentId);

  // 과목별 데이터 필터링 함수
  const getFilteredData = (subject: Subject | 'all') => {
    if (subject === 'all') {
      return {
        assignments: studentAssignments,
        results: studentResults
      };
    }
    
    const subjectWorksheets = worksheets.filter(w => w.subject === subject);
    const subjectAssignments = studentAssignments.filter(a => {
      const worksheet = worksheets.find(w => w.id === a.worksheetId);
      return worksheet?.subject === subject;
    });
    const subjectResults = studentResults.filter(r => {
      const worksheet = worksheets.find(w => w.id === r.worksheetId);
      return worksheet?.subject === subject;
    });
    
    return {
      assignments: subjectAssignments,
      results: subjectResults
    };
  };

  const filteredData = getFilteredData(selectedSubject);
  const currentAssignments = filteredData.assignments;
  const currentResults = filteredData.results;

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

  if (currentUser.role !== 'teacher') {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p>접근 권한이 없습니다.</p>
        </div>
      </MainLayout>
    );
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getWorksheetTitle = (worksheetId: string) => {
    const worksheet = worksheets.find(w => w.id === worksheetId);
    return worksheet?.title || '알 수 없는 학습지';
  };

  const getAssignmentStatus = (assignmentId: string) => {
    const result = currentResults.find(r => r.assignmentId === assignmentId);
    const assignment = currentAssignments.find(a => a.id === assignmentId);
    
    if (result) {
      return { status: 'completed', result };
    }
    
    if (assignment) {
      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      if (now > dueDate) {
        return { status: 'overdue' };
      }
    }
    
    return { status: 'pending' };
  };

  // 통계 계산 (필터링된 데이터 기준)
  const totalAssignments = currentAssignments.length;
  const completedAssignments = currentResults.length;
  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;
  const averageScore = currentResults.length > 0 
    ? currentResults.reduce((sum, r) => sum + r.totalScore, 0) / currentResults.length 
    : 0;
  const totalStudyTime = currentResults.reduce((sum, r) => sum + r.totalTimeSpent, 0);
  const pendingAssignments = totalAssignments - completedAssignments;

  // 최근 성과 분석 (필터링된 데이터 기준)
  const recentResults = currentResults
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const getPerformanceTrend = () => {
    if (recentResults.length < 2) return 'stable';
    
    const recent = recentResults.slice(0, 2);
    const older = recentResults.slice(2, 4);
    
    const recentAvg = recent.reduce((sum, r) => sum + r.totalScore, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, r) => sum + r.totalScore, 0) / older.length : recentAvg;
    
    if (recentAvg > olderAvg + 5) return 'improving';
    if (recentAvg < olderAvg - 5) return 'declining';
    return 'stable';
  };

  const performanceTrend = getPerformanceTrend();

  // 과목별 취약 유형 분석
  const getSubjectWeaknessTypes = (subject: Subject | 'all') => {
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

    if (subject === 'all') {
      // 전체 과목의 취약 유형을 합쳐서 반환
      return [
        ...weaknessTypesBySubject.math.slice(0, 2),
        ...weaknessTypesBySubject.english.slice(0, 1),
        ...weaknessTypesBySubject.korean.slice(0, 1)
      ];
    }

    return weaknessTypesBySubject[subject] || [];
  };

  const currentWeaknessTypes = getSubjectWeaknessTypes(selectedSubject);

  const getStatusBadge = (assignmentId: string) => {
    const status = getAssignmentStatus(assignmentId);
    
    switch (status.status) {
      case 'completed':
        return <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" />완료</Badge>;
      case 'overdue':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />지연</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><Timer className="h-3 w-3" />진행중</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Link href="/teacher/students">
              <Button variant="ghost" size="sm" className="gap-2">
                ← 목록으로
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{student.name}</h1>
                  {student.grade && (
                    <Badge variant="secondary" className="text-sm">{student.grade}</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  회원번호: {student.memberNumber} | {student.centerName}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">배정과목:</span>
                  <div className="flex gap-1">
                    {student.assignedSubjects?.map((subject) => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject === 'math' ? '수학' : subject === 'english' ? '영어' : '국어'}
                      </Badge>
                    )) || <span className="text-xs text-muted-foreground">미배정</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => router.push(`/teacher/students/${studentId}/reports`)}
            >
              <BarChart3 className="h-4 w-4" />
              학습 리포트
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => router.push(`/teacher/assignments/create?selectedStudents=${studentId}`)}
            >
              <ClipboardList className="h-4 w-4" />
              과제 배정
            </Button>
          </div>
        </div>

        {/* 과목별 필터링 탭 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">과목별 보기:</span>
          </div>
          <Tabs value={selectedSubject} onValueChange={(value) => setSelectedSubject(value as Subject | 'all')} className="w-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="math">수학</TabsTrigger>
              <TabsTrigger value="english">영어</TabsTrigger>
              <TabsTrigger value="korean">국어</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="과제 완료율"
            value={`${Math.round(completionRate)}%`}
            icon={TrendingUp}
            variant="success"
            trend={performanceTrend === 'improving' ? { value: 12, isPositive: true } : 
                   performanceTrend === 'declining' ? { value: 8, isPositive: false } : undefined}
          />
          <StatsCard
            title="평균 점수"
            value={`${Math.round(averageScore)}점`}
            icon={Target}
            variant="gradient"
          />
          <StatsCard
            title="총 학습시간"
            value={`${Math.round(totalStudyTime / 60)}분`}
            icon={Clock}
            variant="info"
          />
          <StatsCard
            title="미완료 과제"
            value={pendingAssignments}
            icon={AlertCircle}
            variant={pendingAssignments > 0 ? "warning" : "default"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 최근 과제 결과 */}
            <Card>
              <CardHeader>
                <CardTitle>
                  최근 과제 결과
                  {selectedSubject !== 'all' && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({selectedSubject === 'math' ? '수학' : selectedSubject === 'english' ? '영어' : '국어'})
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedSubject === 'all' ? '최근 완료한 과제들의 성과를 확인하세요' : 
                   `${selectedSubject === 'math' ? '수학' : selectedSubject === 'english' ? '영어' : '국어'} 과목의 최근 완료한 과제들의 성과를 확인하세요`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentResults.length > 0 ? (
                    recentResults.map((result) => {
                      const assignment = currentAssignments.find(a => a.id === result.assignmentId);
                      
                      return (
                        <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">
                              {assignment?.title || '알 수 없는 과제'}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {getWorksheetTitle(assignment?.worksheetId || '')}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(result.submittedAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {Math.round(result.totalTimeSpent / 60)}분
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary">{result.totalScore}점</div>
                              <div className="text-sm text-muted-foreground">정답률 {result.correctRate}%</div>
                            </div>
                            <Link href={`/teacher/assignments/${result.assignmentId}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>완료한 과제가 없습니다</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 배정된 과제 목록 */}
            <Card>
              <CardHeader>
                <CardTitle>
                  배정된 과제
                  {selectedSubject !== 'all' && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({selectedSubject === 'math' ? '수학' : selectedSubject === 'english' ? '영어' : '국어'})
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedSubject === 'all' ? '현재 배정된 모든 과제의 진행 상황' : 
                   `${selectedSubject === 'math' ? '수학' : selectedSubject === 'english' ? '영어' : '국어'} 과목의 배정된 과제 진행 상황`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentAssignments.length > 0 ? (
                    currentAssignments.map((assignment) => {
                      const status = getAssignmentStatus(assignment.id);
                      
                      return (
                        <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{assignment.title}</h4>
                              {getStatusBadge(assignment.id)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {getWorksheetTitle(assignment.worksheetId)}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                배정: {formatDate(assignment.assignedAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                마감: {formatDate(assignment.dueDate)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {status.status === 'completed' && status.result && (
                              <div className="text-right mr-3">
                                <div className="text-sm font-medium">{status.result.totalScore}점</div>
                                <div className="text-xs text-muted-foreground">
                                  {status.result.correctRate}%
                                </div>
                              </div>
                            )}
                            <Link href={`/teacher/assignments/${assignment.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>배정된 과제가 없습니다</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 학습 성과 요약 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  학습 성과
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.round(averageScore)}점
                  </div>
                  <p className="text-sm text-muted-foreground">전체 평균 점수</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">완료한 과제</span>
                    <span className="font-medium">{completedAssignments}개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">총 학습시간</span>
                    <span className="font-medium">{Math.round(totalStudyTime / 60)}분</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">평균 소요시간</span>
                    <span className="font-medium">
                      {completedAssignments > 0 ? Math.round(totalStudyTime / completedAssignments / 60) : 0}분
                    </span>
                  </div>
                </div>
                
                {performanceTrend !== 'stable' && (
                  <div className={`p-3 rounded-lg ${
                    performanceTrend === 'improving' ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'
                  }`}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <TrendingUp className={`h-4 w-4 ${
                        performanceTrend === 'improving' ? 'text-green-600' : 'text-orange-600 rotate-180'
                      }`} />
                      {performanceTrend === 'improving' ? '성과 향상 중' : '관심 필요'}
                    </div>
                    <p className="text-xs mt-1">
                      {performanceTrend === 'improving' 
                        ? '최근 성적이 향상되고 있습니다' 
                        : '최근 성적이 하락하고 있습니다'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 학습 패턴 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">학습 패턴</CardTitle>
                <CardDescription>
                  {selectedSubject === 'all' ? '전체 과목' : 
                   selectedSubject === 'math' ? '수학' :
                   selectedSubject === 'english' ? '영어' : '국어'} 기준
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">과제 완료율</span>
                    <span className="text-sm font-medium">{Math.round(completionRate)}%</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
                
                {currentResults.length > 0 && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">최고 점수</span>
                        <span className="text-sm font-medium text-green-600">
                          {Math.max(...currentResults.map(r => r.totalScore))}점
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">최저 점수</span>
                        <span className="text-sm font-medium text-orange-600">
                          {Math.min(...currentResults.map(r => r.totalScore))}점
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">최단 소요시간</span>
                        <span className="text-sm font-medium">
                          {Math.round(Math.min(...currentResults.map(r => r.totalTimeSpent)) / 60)}분
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* 취약 유형 분석 */}
                {currentWeaknessTypes.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">취약 유형 분석</h4>
                    <div className="space-y-3">
                      {currentWeaknessTypes.map((weakness, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{weakness.type}</span>
                            <span className="text-xs font-medium">{weakness.correctRate}%</span>
                          </div>
                          <Progress value={weakness.correctRate} className="h-1" />
                          <div className="text-xs text-muted-foreground">
                            {weakness.questionCount}문제 분석
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDetailPage;

'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  ClipboardList, 
  Users, 
  TrendingUp,
  Plus,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  useCurrentUser, 
  useTeacherDashboardStats,
  useWorksheets,
  useAssignments,
  useStudents,
  useLearningResults,
  useAppContext
} from '@/app/lib/contexts/AppContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Subject } from '@/app/types';
import Link from 'next/link';

const TeacherDashboard = () => {
  const currentUser = useCurrentUser();
  const dashboardStats = useTeacherDashboardStats();
  const { state } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  
  // 전체 학습지와 과제 데이터
  const allWorksheets = useWorksheets(currentUser?.id);
  const allAssignments = useAssignments(currentUser?.id);
  const students = useStudents(currentUser?.id);
  const learningResults = useLearningResults();
  
  // 과목별 필터링된 데이터
  const getFilteredWorksheets = (subject: Subject | 'all') => {
    const worksheets = allWorksheets.slice(0, 5);
    if (subject === 'all') return worksheets;
    return worksheets.filter(worksheet => worksheet.subject === subject);
  };
  
  const getFilteredAssignments = (subject: Subject | 'all') => {
    const assignments = allAssignments.slice(0, 5);
    if (subject === 'all') return assignments;
    return assignments.filter(assignment => {
      const worksheet = state.worksheets.find(w => w.id === assignment.worksheetId);
      return worksheet?.subject === subject;
    });
  };
  
  // 과목 라벨 매핑
  const subjectLabels = {
    all: '전체',
    math: '수학',
    english: '영어',
    korean: '국어'
  } as const;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'published': { label: '게시됨', variant: 'default' as const },
      'draft': { label: '임시저장', variant: 'secondary' as const },
      'in_progress': { label: '진행중', variant: 'default' as const },
      'completed': { label: '완료', variant: 'secondary' as const },
      'overdue': { label: '지연', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <Badge variant={statusInfo?.variant || 'default'}>
        {statusInfo?.label || status}
      </Badge>
    );
  };

  function getStudentStats(studentId: string) {
    const studentAssignments = allAssignments.filter(a => a.studentIds.includes(studentId));
    const studentResults = learningResults.filter(r => r.studentId === studentId);
    
    const totalAssignments = studentAssignments.length;
    const completedAssignments = studentResults.length;
    const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;
    const averageScore = studentResults.length > 0 
      ? studentResults.reduce((sum, r) => sum + r.totalScore, 0) / studentResults.length 
      : 0;
    const totalStudyTime = studentResults.reduce((sum, r) => sum + r.totalTimeSpent, 0);

    return {
      totalAssignments,
      completedAssignments,
      completionRate,
      averageScore,
      totalStudyTime
    };
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">대시보드</h1>
            <p className="text-muted-foreground mt-1">
              안녕하세요, {currentUser.name} 선생님! 오늘도 좋은 하루 되세요.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/teacher/worksheets/create">
              <Button className="gap-2" size="sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">학습지 만들기</span>
                <span className="sm:hidden">만들기</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard
            title="총 학습지 수"
            value={dashboardStats.totalWorksheets}
            icon={BookOpen}
            variant="gradient"
          />
          <StatsCard
            title="배정된 과제"
            value={dashboardStats.totalAssignments}
            icon={ClipboardList}
            variant="info"
          />
          <StatsCard
            title="과제 완료율"
            value={`${dashboardStats.assignmentCompletionRate}%`}
            icon={TrendingUp}
            variant="success"
            trend={{
              value: 5.2,
              isPositive: true
            }}
          />
          <StatsCard
            title="담당 학생"
            value={dashboardStats.totalStudents}
            icon={Users}
            variant="warning"
          />
        </div>

        {/* 과목별 최근 학습지 및 과제 */}
        <Tabs value={selectedSubject} onValueChange={(value) => setSelectedSubject(value as Subject | 'all')} className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">최근 활동</h2>
              <p className="text-muted-foreground text-sm">과목별로 최근 학습지와 과제를 확인하세요</p>
            </div>
            <TabsList className="grid w-full max-w-md grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="all">{subjectLabels.all}</TabsTrigger>
              <TabsTrigger value="math">{subjectLabels.math}</TabsTrigger>
              <TabsTrigger value="english">{subjectLabels.english}</TabsTrigger>
              <TabsTrigger value="korean">{subjectLabels.korean}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={selectedSubject} className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* 최근 학습지 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>최근 학습지</CardTitle>
                    <CardDescription>
                      {selectedSubject === 'all' 
                        ? '최근에 생성된 학습지 목록' 
                        : `${subjectLabels[selectedSubject]} 최근 학습지`}
                    </CardDescription>
                  </div>
                  <Link href="/teacher/worksheets">
                    <Button variant="outline" size="sm">전체보기</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const filteredWorksheets = getFilteredWorksheets(selectedSubject);
                      return filteredWorksheets.length > 0 ? (
                        filteredWorksheets.map((worksheet) => (
                          <div key={worksheet.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{worksheet.title}</h4>
                                {getStatusBadge(worksheet.status)}
                                <Badge variant="outline" className="text-xs">
                                  {subjectLabels[worksheet.subject]}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  {worksheet.totalQuestions}문제
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(worksheet.createdAt)}
                                </span>
                              </div>
                            </div>
                            <Link href={`/teacher/worksheets/${worksheet.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>
                            {selectedSubject === 'all' 
                              ? '생성된 학습지가 없습니다.' 
                              : `${subjectLabels[selectedSubject]} 학습지가 없습니다.`}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* 최근 과제 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>최근 과제</CardTitle>
                    <CardDescription>
                      {selectedSubject === 'all' 
                        ? '최근에 배정된 과제 현황' 
                        : `${subjectLabels[selectedSubject]} 최근 과제`}
                    </CardDescription>
                  </div>
                  <Link href="/teacher/assignments">
                    <Button variant="outline" size="sm">전체보기</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const filteredAssignments = getFilteredAssignments(selectedSubject);
                      return filteredAssignments.length > 0 ? (
                        filteredAssignments.map((assignment) => {
                          const worksheet = state.worksheets.find(w => w.id === assignment.worksheetId);
                          return (
                            <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg border">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm">{assignment.title}</h4>
                                  {getStatusBadge(assignment.status)}
                                  {worksheet && (
                                    <Badge variant="outline" className="text-xs">
                                      {subjectLabels[worksheet.subject]}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {assignment.studentIds.length}명
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {assignment.completionRate}% 완료
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(assignment.dueDate)}
                                  </span>
                                </div>
                              </div>
                              <Link href={`/teacher/assignments/${assignment.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>
                            {selectedSubject === 'all' 
                              ? '배정된 과제가 없습니다.' 
                              : `${subjectLabels[selectedSubject]} 과제가 없습니다.`}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 성과 분석 */}
        {students.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  우수 학생 ({students.filter(s => getStudentStats(s.id).averageScore >= 80).length}명)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {students
                    .filter(s => getStudentStats(s.id).averageScore >= 80)
                    .slice(0, 3)
                    .map(student => (
                      <div key={student.id} className="flex items-center justify-between text-sm">
                        <span>{student.name}</span>
                        <span className="font-medium text-green-600">
                          {Math.round(getStudentStats(student.id).averageScore)}점
                        </span>
                      </div>
                    ))}
                  {students.filter(s => getStudentStats(s.id).averageScore >= 80).length === 0 && (
                    <p className="text-sm text-muted-foreground">우수 학생이 없습니다</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  관심 필요 학생
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {students
                    .filter(s => getStudentStats(s.id).completionRate < 50)
                    .slice(0, 3)
                    .map(student => (
                      <div key={student.id} className="flex items-center justify-between text-sm">
                        <span>{student.name}</span>
                        <span className="font-medium text-orange-600">
                          {Math.round(getStudentStats(student.id).completionRate)}%
                        </span>
                      </div>
                    ))}
                  {students.filter(s => getStudentStats(s.id).completionRate < 50).length === 0 && (
                    <p className="text-sm text-muted-foreground">모든 학생이 양호합니다</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  이번 주 활동
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>새 과제 완료</span>
                    <span className="font-medium">
                      {learningResults.filter(r => {
                        const submittedDate = new Date(r.submittedAt);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return submittedDate > weekAgo;
                      }).length}건
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>평균 학습시간</span>
                    <span className="font-medium">25분</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>활성 학생</span>
                    <span className="font-medium">{students.filter(s => {
                      const stats = getStudentStats(s.id);
                      return stats.totalAssignments > 0;
                    }).length}명</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TeacherDashboard;

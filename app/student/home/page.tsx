'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  TrendingUp,
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle,
  Target,
  Filter
} from 'lucide-react';
import { 
  useCurrentUser, 
  useAssignments,
  useStudentStats,
  useLearningResults
} from '@/app/lib/contexts/AppContext';
import { AdvancedStudentDashboard } from '@/components/features/AdvancedStudentDashboard';
import { getStudentStats, getTotalStudentStats, getSubjectStats } from '@/app/lib/data/dummy-data';
import Link from 'next/link';

const StudentHome = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'math' | 'english' | 'korean'>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'in_progress' | 'completed' | 'overdue'>('all');
  
  const currentUser = useCurrentUser();
  const assignments = useAssignments(undefined, currentUser?.id);
  const studentStats = useStudentStats(currentUser?.id || '');
  const learningResults = useLearningResults(currentUser?.id);
  const advancedStats = currentUser ? getStudentStats(currentUser.id) : null;
  
  // 전체 합계 통계
  const totalStats = currentUser ? getTotalStudentStats(currentUser.id) : null;
  
  // 과목별 데이터
  const mathStats = currentUser ? getSubjectStats(currentUser.id, 'math') : null;
  const englishStats = currentUser ? getSubjectStats(currentUser.id, 'english') : null;
  const koreanStats = currentUser ? getSubjectStats(currentUser.id, 'korean') : null;

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

  const inProgressAssignments = assignments.filter(a => a.status === 'in_progress');
  const completedAssignments = assignments.filter(a => a.status === 'completed');
  const overdueAssignments = assignments.filter(a => a.status === 'overdue');

  // 필터링된 과제 목록 생성
  const getFilteredAssignments = () => {
    let filteredAssignments = [...assignments];
    
    // 완료된 과제는 learningResults를 기준으로 판단
    const assignmentsWithStatus = filteredAssignments.map(assignment => {
      const result = learningResults.find(r => r.assignmentId === assignment.id);
      let status = assignment.status;
      
      if (result) {
        status = 'completed';
      } else if (assignment.status === 'overdue') {
        status = 'overdue';
      } else {
        status = 'in_progress';
      }
      
      return { ...assignment, actualStatus: status };
    });

    // 필터 적용
    if (assignmentFilter !== 'all') {
      filteredAssignments = assignmentsWithStatus.filter(a => a.actualStatus === assignmentFilter);
    } else {
      filteredAssignments = assignmentsWithStatus;
    }

    // 최신순으로 정렬 (완료된 것은 결과 날짜, 진행중인 것은 생성 날짜)
    return filteredAssignments.sort((a, b) => {
      const aResult = learningResults.find(r => r.assignmentId === a.id);
      const bResult = learningResults.find(r => r.assignmentId === b.id);
      
      const aDate = aResult ? new Date(aResult.submittedAt) : new Date(a.assignedAt);
      const bDate = bResult ? new Date(bResult.submittedAt) : new Date(b.assignedAt);
      
      return bDate.getTime() - aDate.getTime();
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusButton = (assignment: any) => {
    const result = learningResults.find(r => r.assignmentId === assignment.id);
    
    if (result) {
      return (
        <Link href={`/student/assignments/${assignment.id}/result`}>
          <Button size="sm" variant="outline" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            결과보기
          </Button>
        </Link>
      );
    }

    return (
      <Link href={`/student/assignments/${assignment.id}`}>
        <Button size="sm" className="gap-2">
          <Play className="h-4 w-4" />
          시작하기
        </Button>
      </Link>
    );
  };

  const getStatusBadge = (assignment: any) => {
    const result = learningResults.find(r => r.assignmentId === assignment.id);
    
    if (result) {
      return <Badge variant="secondary">완료</Badge>;
    }
    
    if (assignment.status === 'overdue') {
      return <Badge variant="destructive">지연</Badge>;
    }
    
    return <Badge variant="default">진행중</Badge>;
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">안녕하세요, {currentUser.name}님!</h1>
            <p className="text-muted-foreground mt-1">
              오늘도 열심히 공부해봐요! 💪
            </p>
          </div>
        </div>

        {/* 도전과제 - 최상위권 학생용 (카드들 상단에 배치) */}
        {advancedStats?.isTopTier && (
          <AdvancedStudentDashboard 
            studentId={currentUser.id}
            studentStats={advancedStats}
          />
        )}

        {/* 주요 지표 - 전체 합계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard
            title="과제 완료율"
            value={`${totalStats?.completionRate || 0}%`}
            icon={TrendingUp}
            variant="success"
          />
          <StatsCard
            title="평균 점수"
            value={`${totalStats?.averageScore || 0}점`}
            icon={Target}
            variant="gradient"
          />
          <StatsCard
            title="총 학습 시간"
            value={`${Math.floor((totalStats?.totalStudyTime || 0) / 60)}시간`}
            icon={Clock}
            variant="info"
          />
          <StatsCard
            title="진행 중 과제"
            value={totalStats?.inProgressCount || 0}
            icon={BookOpen}
            variant={(totalStats?.inProgressCount || 0) > 0 ? "warning" : "default"}
          />
        </div>

        {/* 과목별 탭 컨텐츠 */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'math' | 'english' | 'korean')} className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="math">수학</TabsTrigger>
            <TabsTrigger value="english">영어</TabsTrigger>
            <TabsTrigger value="korean">국어</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* 최근 과제 - 전체 */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          최근 과제 (전체)
                        </CardTitle>
                        <CardDescription>최근 과제들을 확인하고 관리하세요</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select 
                          value={assignmentFilter} 
                          onChange={(e) => setAssignmentFilter(e.target.value as 'all' | 'in_progress' | 'completed' | 'overdue')}
                          className="text-xs sm:text-sm border rounded px-2 py-1 bg-background"
                        >
                          <option value="all">전체</option>
                          <option value="in_progress">진행 중</option>
                          <option value="completed">완료</option>
                          <option value="overdue">지연</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(() => {
                        const filteredAssignments = getFilteredAssignments();
                        return filteredAssignments.length > 0 ? (
                          filteredAssignments.slice(0, 6).map((assignment) => {
                            const result = learningResults.find(r => r.assignmentId === assignment.id);
                            return (
                              <div key={assignment.id} className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium">{assignment.title}</h4>
                                    {result ? (
                                      <Badge variant="secondary">완료</Badge>
                                    ) : assignment.status === 'overdue' ? (
                                      <Badge variant="destructive">지연</Badge>
                                    ) : (
                                      <Badge variant="outline">진행중</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      마감: {formatDate(assignment.dueDate)}
                                    </span>
                                    {result && (
                                      <>
                                        <span className="flex items-center gap-1">
                                          <Target className="h-3 w-3" />
                                          {result.totalScore}점
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <TrendingUp className="h-3 w-3" />
                                          정답률 {result.correctRate}%
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {assignment.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {assignment.description}
                                    </p>
                                  )}
                                </div>
                                <div className="ml-4">
                                  {getStatusButton(assignment)}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>
                              {assignmentFilter === 'all' && '과제가 없습니다.'}
                              {assignmentFilter === 'in_progress' && '진행 중인 과제가 없습니다.'}
                              {assignmentFilter === 'completed' && '완료한 과제가 없습니다.'}
                              {assignmentFilter === 'overdue' && '지연된 과제가 없습니다.'}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 취약 유형 분석 - 전체 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    취약 유형 분석 (전체)
                  </CardTitle>
                  <CardDescription>집중 학습이 필요한 유형들</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {advancedStats?.weaknessTypes && advancedStats.weaknessTypes.length > 0 ? (
                      advancedStats.weaknessTypes.slice(0, 5).map((weakness, index) => (
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
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <Target className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">분석할 데이터가 부족합니다.</p>
                        <p className="text-xs">더 많은 과제를 완료해보세요!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 수학 탭 */}
          <TabsContent value="math" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* 최근 과제 - 수학 */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          최근 과제 (수학)
                        </CardTitle>
                        <CardDescription>수학 과제들을 확인하고 관리하세요</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select 
                          value={assignmentFilter} 
                          onChange={(e) => setAssignmentFilter(e.target.value as 'all' | 'in_progress' | 'completed' | 'overdue')}
                          className="text-xs sm:text-sm border rounded px-2 py-1 bg-background"
                        >
                          <option value="all">전체</option>
                          <option value="in_progress">진행 중</option>
                          <option value="completed">완료</option>
                          <option value="overdue">지연</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(() => {
                        const mathAssignments = mathStats?.assignments || [];
                        const mathResults = mathStats?.results || [];
                        
                        const mathAssignmentsWithStatus = mathAssignments.map(assignment => {
                          const result = mathResults.find(r => r.assignmentId === assignment.id);
                          let status = assignment.status;
                          
                          if (result) {
                            status = 'completed';
                          } else if (assignment.status === 'overdue') {
                            status = 'overdue';
                          } else {
                            status = 'in_progress';
                          }
                          
                          return { ...assignment, actualStatus: status };
                        });

                        let filteredMathAssignments = mathAssignmentsWithStatus;
                        if (assignmentFilter !== 'all') {
                          filteredMathAssignments = mathAssignmentsWithStatus.filter(a => a.actualStatus === assignmentFilter);
                        }

                        return filteredMathAssignments.length > 0 ? (
                          filteredMathAssignments.slice(0, 6).map((assignment) => {
                            const result = mathResults.find(r => r.assignmentId === assignment.id);
                            return (
                              <div key={assignment.id} className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium">{assignment.title}</h4>
                                    <Badge variant="default">수학</Badge>
                                    {result ? (
                                      <Badge variant="secondary">완료</Badge>
                                    ) : assignment.status === 'overdue' ? (
                                      <Badge variant="destructive">지연</Badge>
                                    ) : (
                                      <Badge variant="outline">진행중</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      마감: {formatDate(assignment.dueDate)}
                                    </span>
                                    {result && (
                                      <>
                                        <span className="flex items-center gap-1">
                                          <Target className="h-3 w-3" />
                                          {result.totalScore}점
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <TrendingUp className="h-3 w-3" />
                                          정답률 {result.correctRate}%
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {assignment.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {assignment.description}
                                    </p>
                                  )}
                                </div>
                                <div className="ml-4">
                                  {result ? (
                                    <Link href={`/student/assignments/${assignment.id}/result`}>
                                      <Button size="sm" variant="outline" className="gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        결과보기
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Link href={`/student/assignments/${assignment.id}`}>
                                      <Button size="sm" className="gap-2">
                                        <Play className="h-4 w-4" />
                                        시작하기
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>
                              {assignmentFilter === 'all' && '수학 과제가 없습니다.'}
                              {assignmentFilter === 'in_progress' && '진행 중인 수학 과제가 없습니다.'}
                              {assignmentFilter === 'completed' && '완료한 수학 과제가 없습니다.'}
                              {assignmentFilter === 'overdue' && '지연된 수학 과제가 없습니다.'}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 취약 유형 분석 - 수학 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    취약 유형 분석 (수학)
                  </CardTitle>
                  <CardDescription>수학 집중 학습 유형</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mathStats?.weaknessTypes && mathStats.weaknessTypes.length > 0 ? (
                      mathStats.weaknessTypes.slice(0, 5).map((weakness, index) => (
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
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <Target className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">수학 데이터가 부족합니다.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 영어 탭 */}
          <TabsContent value="english" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* 최근 과제 - 영어 */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          최근 과제 (영어)
                        </CardTitle>
                        <CardDescription>영어 과제들을 확인하고 관리하세요</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select 
                          value={assignmentFilter} 
                          onChange={(e) => setAssignmentFilter(e.target.value as 'all' | 'in_progress' | 'completed' | 'overdue')}
                          className="text-xs sm:text-sm border rounded px-2 py-1 bg-background"
                        >
                          <option value="all">전체</option>
                          <option value="in_progress">진행 중</option>
                          <option value="completed">완료</option>
                          <option value="overdue">지연</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(() => {
                        const englishAssignments = englishStats?.assignments || [];
                        const englishResults = englishStats?.results || [];
                        
                        const englishAssignmentsWithStatus = englishAssignments.map(assignment => {
                          const result = englishResults.find(r => r.assignmentId === assignment.id);
                          let status = assignment.status;
                          
                          if (result) {
                            status = 'completed';
                          } else if (assignment.status === 'overdue') {
                            status = 'overdue';
                          } else {
                            status = 'in_progress';
                          }
                          
                          return { ...assignment, actualStatus: status };
                        });

                        let filteredEnglishAssignments = englishAssignmentsWithStatus;
                        if (assignmentFilter !== 'all') {
                          filteredEnglishAssignments = englishAssignmentsWithStatus.filter(a => a.actualStatus === assignmentFilter);
                        }

                        return filteredEnglishAssignments.length > 0 ? (
                          filteredEnglishAssignments.slice(0, 6).map((assignment) => {
                            const result = englishResults.find(r => r.assignmentId === assignment.id);
                            return (
                              <div key={assignment.id} className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium">{assignment.title}</h4>
                                    <Badge variant="secondary">영어</Badge>
                                    {result ? (
                                      <Badge variant="secondary">완료</Badge>
                                    ) : assignment.status === 'overdue' ? (
                                      <Badge variant="destructive">지연</Badge>
                                    ) : (
                                      <Badge variant="outline">진행중</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      마감: {formatDate(assignment.dueDate)}
                                    </span>
                                    {result && (
                                      <>
                                        <span className="flex items-center gap-1">
                                          <Target className="h-3 w-3" />
                                          {result.totalScore}점
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <TrendingUp className="h-3 w-3" />
                                          정답률 {result.correctRate}%
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {assignment.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {assignment.description}
                                    </p>
                                  )}
                                </div>
                                <div className="ml-4">
                                  {result ? (
                                    <Link href={`/student/assignments/${assignment.id}/result`}>
                                      <Button size="sm" variant="outline" className="gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        결과보기
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Link href={`/student/assignments/${assignment.id}`}>
                                      <Button size="sm" className="gap-2">
                                        <Play className="h-4 w-4" />
                                        시작하기
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>
                              {assignmentFilter === 'all' && '영어 과제가 없습니다.'}
                              {assignmentFilter === 'in_progress' && '진행 중인 영어 과제가 없습니다.'}
                              {assignmentFilter === 'completed' && '완료한 영어 과제가 없습니다.'}
                              {assignmentFilter === 'overdue' && '지연된 영어 과제가 없습니다.'}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 취약 유형 분석 - 영어 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    취약 유형 분석 (영어)
                  </CardTitle>
                  <CardDescription>영어 집중 학습 유형</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {englishStats?.weaknessTypes && englishStats.weaknessTypes.length > 0 ? (
                      englishStats.weaknessTypes.slice(0, 5).map((weakness, index) => (
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
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <Target className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">영어 데이터가 부족합니다.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 국어 탭 */}
          <TabsContent value="korean" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* 최근 과제 - 국어 */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          최근 과제 (국어)
                        </CardTitle>
                        <CardDescription>국어 과제들을 확인하고 관리하세요</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select 
                          value={assignmentFilter} 
                          onChange={(e) => setAssignmentFilter(e.target.value as 'all' | 'in_progress' | 'completed' | 'overdue')}
                          className="text-xs sm:text-sm border rounded px-2 py-1 bg-background"
                        >
                          <option value="all">전체</option>
                          <option value="in_progress">진행 중</option>
                          <option value="completed">완료</option>
                          <option value="overdue">지연</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(() => {
                        const koreanAssignments = koreanStats?.assignments || [];
                        const koreanResults = koreanStats?.results || [];
                        
                        const koreanAssignmentsWithStatus = koreanAssignments.map(assignment => {
                          const result = koreanResults.find(r => r.assignmentId === assignment.id);
                          let status = assignment.status;
                          
                          if (result) {
                            status = 'completed';
                          } else if (assignment.status === 'overdue') {
                            status = 'overdue';
                          } else {
                            status = 'in_progress';
                          }
                          
                          return { ...assignment, actualStatus: status };
                        });

                        let filteredKoreanAssignments = koreanAssignmentsWithStatus;
                        if (assignmentFilter !== 'all') {
                          filteredKoreanAssignments = koreanAssignmentsWithStatus.filter(a => a.actualStatus === assignmentFilter);
                        }

                        return filteredKoreanAssignments.length > 0 ? (
                          filteredKoreanAssignments.slice(0, 6).map((assignment) => {
                            const result = koreanResults.find(r => r.assignmentId === assignment.id);
                            return (
                              <div key={assignment.id} className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium">{assignment.title}</h4>
                                    <Badge variant="outline">국어</Badge>
                                    {result ? (
                                      <Badge variant="secondary">완료</Badge>
                                    ) : assignment.status === 'overdue' ? (
                                      <Badge variant="destructive">지연</Badge>
                                    ) : (
                                      <Badge variant="outline">진행중</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      마감: {formatDate(assignment.dueDate)}
                                    </span>
                                    {result && (
                                      <>
                                        <span className="flex items-center gap-1">
                                          <Target className="h-3 w-3" />
                                          {result.totalScore}점
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <TrendingUp className="h-3 w-3" />
                                          정답률 {result.correctRate}%
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {assignment.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {assignment.description}
                                    </p>
                                  )}
                                </div>
                                <div className="ml-4">
                                  {result ? (
                                    <Link href={`/student/assignments/${assignment.id}/result`}>
                                      <Button size="sm" variant="outline" className="gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        결과보기
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Link href={`/student/assignments/${assignment.id}`}>
                                      <Button size="sm" className="gap-2">
                                        <Play className="h-4 w-4" />
                                        시작하기
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>
                              {assignmentFilter === 'all' && '국어 과제가 없습니다.'}
                              {assignmentFilter === 'in_progress' && '진행 중인 국어 과제가 없습니다.'}
                              {assignmentFilter === 'completed' && '완료한 국어 과제가 없습니다.'}
                              {assignmentFilter === 'overdue' && '지연된 국어 과제가 없습니다.'}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 취약 유형 분석 - 국어 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    취약 유형 분석 (국어)
                  </CardTitle>
                  <CardDescription>국어 집중 학습 유형</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {koreanStats?.weaknessTypes && koreanStats.weaknessTypes.length > 0 ? (
                      koreanStats.weaknessTypes.slice(0, 5).map((weakness, index) => (
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
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <Target className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">국어 데이터가 부족합니다.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>


        {/* 지연된 과제 알림 */}
        {overdueAssignments.length > 0 && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                지연된 과제 ({overdueAssignments.length}개)
              </CardTitle>
              <CardDescription>빠른 시일 내에 완료해주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdueAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{assignment.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        마감일: {formatDate(assignment.dueDate)}
                      </p>
                    </div>
                    <Link href={`/student/assignments/${assignment.id}`}>
                      <Button size="sm" variant="destructive" className="gap-2">
                        <RotateCcw className="h-4 w-4" />
                        지금 시작
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </MainLayout>
  );
};

export default StudentHome;

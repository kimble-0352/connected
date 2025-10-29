'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardList, 
  Users, 
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  Timer,
  BookOpen,
  User
} from 'lucide-react';
import { 
  useCurrentUser, 
  useAssignments,
  useWorksheets,
  useStudents,
  useLearningResults,
  useAppContext
} from '@/app/lib/contexts/AppContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Link from 'next/link';

const AssignmentDetailPage = () => {
  const params = useParams();
  const assignmentId = params.id as string;
  const currentUser = useCurrentUser();
  const { state } = useAppContext();
  const assignments = useAssignments(currentUser?.id);
  const worksheets = useWorksheets(currentUser?.id);
  const students = useStudents(currentUser?.id);
  const learningResults = useLearningResults();
  
  const assignment = assignments.find(a => a.id === assignmentId);
  const worksheet = assignment ? worksheets.find(w => w.id === assignment.worksheetId) : null;
  const assignedStudents = assignment ? students.filter(s => assignment.studentIds.includes(s.id)) : [];
  const assignmentResults = learningResults.filter(r => r.assignmentId === assignmentId);

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

  if (!assignment) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">과제를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">요청하신 과제가 존재하지 않거나 삭제되었습니다.</p>
            <Link href="/teacher/assignments">
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

  const getStatusBadge = () => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    if (assignment.status === 'completed') {
      return <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" />완료</Badge>;
    }
    
    if (now > dueDate) {
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />지연</Badge>;
    }
    
    return <Badge variant="default" className="gap-1"><Timer className="h-3 w-3" />진행중</Badge>;
  };

  const getDaysUntilDue = () => {
    const now = new Date();
    const due = new Date(assignment.dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)}일 지연`;
    if (diffDays === 0) return '오늘 마감';
    if (diffDays === 1) return '내일 마감';
    return `${diffDays}일 남음`;
  };

  const getStudentStatus = (studentId: string) => {
    const result = assignmentResults.find(r => r.studentId === studentId);
    if (result) {
      return {
        status: 'completed',
        score: result.totalScore,
        correctRate: result.correctRate,
        submittedAt: result.submittedAt,
        timeSpent: result.totalTimeSpent
      };
    }
    return { status: 'pending' };
  };

  const completedCount = assignmentResults.length;
  const pendingCount = assignment.studentIds.length - completedCount;
  const averageScore = assignmentResults.length > 0 
    ? assignmentResults.reduce((sum, r) => sum + r.totalScore, 0) / assignmentResults.length 
    : 0;
  const averageTime = assignmentResults.length > 0
    ? assignmentResults.reduce((sum, r) => sum + r.totalTimeSpent, 0) / assignmentResults.length
    : 0;

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/teacher/assignments">
                <Button variant="ghost" size="sm" className="gap-2">
                  ← 목록으로
                </Button>
              </Link>
              {getStatusBadge()}
            </div>
            <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
            {assignment.description && (
              <p className="text-muted-foreground text-lg">{assignment.description}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              결과 다운로드
            </Button>
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              학습지 보기
            </Button>
          </div>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="배정 학생"
            value={assignment.studentIds.length}
            icon={Users}
            variant="gradient"
          />
          <StatsCard
            title="완료율"
            value={`${assignment.completionRate}%`}
            icon={TrendingUp}
            variant="success"
          />
          <StatsCard
            title="평균 점수"
            value={`${Math.round(averageScore)}점`}
            icon={Target}
            variant="info"
          />
          <StatsCard
            title="평균 소요시간"
            value={`${Math.round(averageTime / 60)}분`}
            icon={Clock}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 과제 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>과제 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">학습지</p>
                    <div className="flex items-center gap-2 mt-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{worksheet?.title || '알 수 없는 학습지'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">문제 수</p>
                    <p className="font-medium mt-1">{worksheet?.totalQuestions || 0}문제</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">배정일</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(assignment.assignedAt)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">마감일</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(assignment.dueDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">전체 진행률</span>
                    <span className="text-sm text-muted-foreground">
                      {getDaysUntilDue()}
                    </span>
                  </div>
                  <Progress value={assignment.completionRate} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{completedCount}명 완료</span>
                    <span>{pendingCount}명 미완료</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 학생별 진행 현황 */}
            <Card>
              <CardHeader>
                <CardTitle>학생별 진행 현황</CardTitle>
                <CardDescription>각 학생의 과제 수행 상태를 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignedStudents.map((student) => {
                    const studentStatus = getStudentStatus(student.id);
                    
                    return (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">{student.memberNumber}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {studentStatus.status === 'completed' ? (
                            <>
                              <div className="text-right">
                                <div className="text-sm font-medium">{studentStatus.score}점</div>
                                <div className="text-xs text-muted-foreground">
                                  정답률 {studentStatus.correctRate}%
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {Math.round((studentStatus.timeSpent || 0) / 60)}분
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(studentStatus.submittedAt || '').toLocaleDateString('ko-KR')}
                                </div>
                              </div>
                              <Badge variant="secondary" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                완료
                              </Badge>
                            </>
                          ) : (
                            <>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">미제출</div>
                                <div className="text-xs text-muted-foreground">
                                  {getDaysUntilDue()}
                                </div>
                              </div>
                              <Badge variant="outline" className="gap-1">
                                <Timer className="h-3 w-3" />
                                진행중
                              </Badge>
                            </>
                          )}
                          
                          <Button variant="ghost" size="sm">
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

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 진행 상태 요약 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">진행 상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">완료</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{completedCount}명</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">미완료</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{pendingCount}명</span>
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {assignment.completionRate}%
                    </div>
                    <p className="text-sm text-muted-foreground">전체 완료율</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 성과 분석 */}
            {assignmentResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">성과 분석</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">평균 점수</span>
                      <span className="text-sm font-medium">{Math.round(averageScore)}점</span>
                    </div>
                    <Progress value={averageScore} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">최고 점수</span>
                      <span className="text-sm font-medium">
                        {Math.max(...assignmentResults.map(r => r.totalScore))}점
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">최저 점수</span>
                      <span className="text-sm font-medium">
                        {Math.min(...assignmentResults.map(r => r.totalScore))}점
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">평균 소요시간</span>
                      <span className="text-sm font-medium">
                        {Math.round(averageTime / 60)}분
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 빠른 작업 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">빠른 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Download className="h-4 w-4" />
                  결과 엑셀 다운로드
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Eye className="h-4 w-4" />
                  학습지 미리보기
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Users className="h-4 w-4" />
                  미완료 학생 알림
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AssignmentDetailPage;
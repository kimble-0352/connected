'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { 
  FileText, 
  Search, 
  Calendar,
  Clock,
  Play,
  CheckCircle,
  AlertCircle,
  Timer,
  BookOpen,
  Target,
  RotateCcw
} from 'lucide-react';
import { 
  useCurrentUser, 
  useAssignments,
  useLearningResults,
  useWorksheets,
  useAppContext
} from '@/app/lib/contexts/AppContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Link from 'next/link';

const StudentAssignmentsPage = () => {
  const currentUser = useCurrentUser();
  const { state } = useAppContext();
  const assignments = useAssignments(undefined, currentUser?.id);
  const learningResults = useLearningResults(currentUser?.id);
  const worksheets = useWorksheets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const filteredAssignments = assignments.filter(assignment => {
    // 검색어 필터
    if (searchQuery && !assignment.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // 상태 필터
    if (statusFilter && statusFilter !== 'all') {
      const result = learningResults.find(r => r.assignmentId === assignment.id);
      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      
      if (statusFilter === 'completed' && !result) return false;
      if (statusFilter === 'in_progress' && result) return false;
      if (statusFilter === 'overdue' && (result || now <= dueDate)) return false;
    }
    
    return true;
  }).sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()); // 최신 순으로 정렬

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWorksheetTitle = (worksheetId: string) => {
    const worksheet = worksheets.find(w => w.id === worksheetId);
    return worksheet?.title || '알 수 없는 학습지';
  };

  const getWorksheet = (worksheetId: string) => {
    return worksheets.find(w => w.id === worksheetId);
  };

  const getAssignmentStatus = (assignment: any) => {
    const result = learningResults.find(r => r.assignmentId === assignment.id);
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    if (result) {
      return { 
        status: 'completed', 
        result,
        badge: <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" />완료</Badge>
      };
    }
    
    if (now > dueDate) {
      return { 
        status: 'overdue',
        badge: <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />지연</Badge>
      };
    }
    
    return { 
      status: 'in_progress',
      badge: <Badge variant="default" className="gap-1"><Timer className="h-3 w-3" />진행중</Badge>
    };
  };

  const getActionButton = (assignment: any) => {
    const status = getAssignmentStatus(assignment);
    
    if (status.status === 'completed') {
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
          {status.status === 'overdue' ? (
            <>
              <RotateCcw className="h-4 w-4" />
              지금 시작
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              시작하기
            </>
          )}
        </Button>
      </Link>
    );
  };

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)}일 지연`;
    if (diffDays === 0) return '오늘 마감';
    if (diffDays === 1) return '내일 마감';
    return `${diffDays}일 남음`;
  };

  // 통계 계산
  const totalAssignments = assignments.length;
  const completedAssignments = learningResults.length;
  const inProgressAssignments = assignments.filter(a => {
    const result = learningResults.find(r => r.assignmentId === a.id);
    const now = new Date();
    const dueDate = new Date(a.dueDate);
    return !result && now <= dueDate;
  }).length;
  const overdueAssignments = assignments.filter(a => {
    const result = learningResults.find(r => r.assignmentId === a.id);
    const now = new Date();
    const dueDate = new Date(a.dueDate);
    return !result && now > dueDate;
  }).length;

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">나의 학습지</h1>
            <p className="text-muted-foreground mt-1">
              배정받은 학습지를 확인하고 완료해보세요
            </p>
          </div>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">전체 학습지</p>
                  <p className="text-2xl font-bold">{totalAssignments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">완료</p>
                  <p className="text-2xl font-bold">{completedAssignments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Timer className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">진행중</p>
                  <p className="text-2xl font-bold">{inProgressAssignments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">지연</p>
                  <p className="text-2xl font-bold">{overdueAssignments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card className="card-mobile">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="학습지명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-base" // iOS 줌 방지
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="상태별 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="in_progress">진행중</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                  <SelectItem value="overdue">지연</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 과제 목록 */}
        <div className="mt-8">
        {filteredAssignments.length > 0 ? (
          <div className="flex flex-col gap-8">
            {filteredAssignments.map((assignment) => {
              const status = getAssignmentStatus(assignment);
              const worksheet = getWorksheet(assignment.worksheetId);
              
              return (
                <Card key={assignment.id} className="card-hover card-mobile">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold line-clamp-2">{assignment.title}</h3>
                          {status.badge}
                        </div>
                        
                        {assignment.description && (
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {assignment.description}
                          </p>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 flex-shrink-0" />
                            <span className="line-clamp-1">{getWorksheetTitle(assignment.worksheetId)}</span>
                          </div>
                          {worksheet && (
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4 flex-shrink-0" />
                              <span>{worksheet.totalQuestions}문제</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span className="hidden sm:inline">배정: </span>
                            <span>{formatDate(assignment.assignedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span className="hidden sm:inline">마감: </span>
                            <span>{formatDate(assignment.dueDate)}</span>
                          </div>
                        </div>
                        
                        {/* 완료된 과제의 경우 점수 표시 */}
                        {status.status === 'completed' && status.result && (
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="text-lg font-bold text-primary">{status.result.totalScore}점</div>
                              <div className="text-sm text-muted-foreground">
                                정답률 {status.result.correctRate}%
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              소요시간: {Math.round(status.result.totalTimeSpent / 60)}분
                            </div>
                          </div>
                        )}
                        
                        {/* 마감일 정보 */}
                        <div className="text-sm">
                          <span className={`font-medium ${
                            getDaysUntilDue(assignment.dueDate).includes('지연') ? 'text-destructive' :
                            getDaysUntilDue(assignment.dueDate).includes('오늘') || getDaysUntilDue(assignment.dueDate).includes('내일') ? 'text-warning' :
                            'text-muted-foreground'
                          }`}>
                            {getDaysUntilDue(assignment.dueDate)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end gap-3 sm:ml-4">
                        <div className="w-full sm:w-auto">
                          {getActionButton(assignment)}
                        </div>
                        
                        {worksheet && (
                          <div className="text-left sm:text-right text-sm text-muted-foreground">
                            <div>예상 소요시간</div>
                            <div className="font-medium">{Math.round(worksheet.totalQuestions * 1.5)}분</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="배정된 학습지가 없습니다"
            description="선생님이 학습지를 배정하면 여기에 표시됩니다"
          />
        )}
        </div>

      </div>
    </MainLayout>
  );
};

export default StudentAssignmentsPage;
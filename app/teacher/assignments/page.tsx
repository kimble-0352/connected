'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/ui/empty-state';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Eye,
  AlertCircle,
  CheckCircle,
  Timer
} from 'lucide-react';
import { 
  useCurrentUser, 
  useAssignments,
  useWorksheets,
  useAppContext
} from '@/app/lib/contexts/AppContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Assignment } from '@/app/types';
import Link from 'next/link';

const AssignmentsPage = () => {
  const currentUser = useCurrentUser();
  const { state } = useAppContext();
  const assignments = useAssignments(currentUser?.id);
  const worksheets = useWorksheets(currentUser?.id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

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

  const filteredAssignments = assignments.filter(assignment => {
    // 검색어 필터
    if (searchQuery && !assignment.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // 상태 필터
    if (statusFilter && statusFilter !== 'all' && assignment.status !== statusFilter) {
      return false;
    }
    
    // 과목 필터 (worksheet의 subject 기반)
    if (subjectFilter && subjectFilter !== 'all') {
      const worksheet = worksheets.find(w => w.id === assignment.worksheetId);
      if (!worksheet || worksheet.subject !== subjectFilter) {
        return false;
      }
    }
    
    // 태그 필터 (worksheet의 tags 기반)
    if (tagFilter && tagFilter !== 'all') {
      const worksheet = worksheets.find(w => w.id === assignment.worksheetId);
      if (!worksheet || !worksheet.tags.includes(tagFilter)) {
        return false;
      }
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

  const getStatusBadge = (assignment: Assignment) => {
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

  const getWorksheetTitle = (worksheetId: string) => {
    const worksheet = worksheets.find(w => w.id === worksheetId);
    return worksheet?.title || '알 수 없는 학습지';
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
  const inProgressAssignments = assignments.filter(a => a.status === 'in_progress').length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const overdueAssignments = assignments.filter(a => {
    const now = new Date();
    const dueDate = new Date(a.dueDate);
    return now > dueDate && a.status !== 'completed';
  }).length;
  const averageCompletionRate = assignments.length > 0 
    ? assignments.reduce((sum, a) => sum + a.completionRate, 0) / assignments.length 
    : 0;

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">과제 관리</h1>
            <p className="text-muted-foreground mt-1">
              배정된 과제의 진행 상황을 확인하고 새로운 과제를 배정하세요
            </p>
          </div>
          <Link href="/teacher/assignments/create">
            <Button className="gap-2 button-hover">
              <Plus className="h-4 w-4" />
              과제 배정하기
            </Button>
          </Link>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard
            title="총 과제 수"
            value={totalAssignments}
            icon={ClipboardList}
            variant="gradient"
          />
          <StatsCard
            title="진행 중"
            value={inProgressAssignments}
            icon={Timer}
            variant="info"
          />
          <StatsCard
            title="완료"
            value={completedAssignments}
            icon={TrendingUp}
            variant="success"
          />
          <StatsCard
            title="과제"
            value={overdueAssignments}
            icon={AlertCircle}
            variant={overdueAssignments > 0 ? "warning" : "default"}
          />
          <StatsCard
            title="평균 소요시간"
            value="25분"
            icon={Clock}
            variant="default"
          />
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 검색 입력 */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="과제명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* 필터 옵션들 */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-2">
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-full sm:w-32 lg:w-28">
                    <SelectValue placeholder="과목" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="math">수학</SelectItem>
                    <SelectItem value="english">영어</SelectItem>
                    <SelectItem value="korean">국어</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger className="w-full sm:w-32 lg:w-28">
                    <SelectValue placeholder="태그" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="basic">기초</SelectItem>
                    <SelectItem value="intermediate">중급</SelectItem>
                    <SelectItem value="advanced">고급</SelectItem>
                    <SelectItem value="exam">시험</SelectItem>
                    <SelectItem value="homework">숙제</SelectItem>
                    <SelectItem value="review">복습</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32 lg:w-28">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="in_progress">진행중</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="overdue">지연</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 과제 목록 */}
        {filteredAssignments.length > 0 ? (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{assignment.title}</h3>
                        {getStatusBadge(assignment)}
                      </div>
                      
                      {assignment.description && (
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {assignment.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <ClipboardList className="h-4 w-4" />
                          <span>{getWorksheetTitle(assignment.worksheetId)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{assignment.studentIds.length}명 배정</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>배정: {formatDate(assignment.assignedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>마감: {formatDate(assignment.dueDate)}</span>
                        </div>
                      </div>
                      
                      {/* 진행률 */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>완료율</span>
                          <span className="font-medium">{assignment.completionRate}%</span>
                        </div>
                        <Progress value={assignment.completionRate} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {assignment.studentIds.length}명 중
                          </span>
                          <span className={`font-medium ${
                            getDaysUntilDue(assignment.dueDate).includes('지연') ? 'text-destructive' :
                            getDaysUntilDue(assignment.dueDate).includes('오늘') || getDaysUntilDue(assignment.dueDate).includes('내일') ? 'text-warning' :
                            'text-muted-foreground'
                          }`}>
                            {getDaysUntilDue(assignment.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Link href={`/teacher/assignments/${assignment.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          상세보기
                        </Button>
                      </Link>
                      
                      {assignment.averageScore > 0 && (
                        <div className="text-center p-2 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">{assignment.averageScore}점</div>
                          <div className="text-xs text-muted-foreground">평균 점수</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="배정된 과제가 없습니다"
            description="학습지를 선택하여 학생들에게 과제를 배정해보세요"
            action={{
              label: "과제 배정하기",
              onClick: () => window.location.href = '/teacher/assignments/create'
            }}
          />
        )}

      </div>
    </MainLayout>
  );
};

export default AssignmentsPage;
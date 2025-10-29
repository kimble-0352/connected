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
  Users, 
  Search, 
  TrendingUp,
  Clock,
  Target,
  Eye,
  User
} from 'lucide-react';
import { 
  useCurrentUser, 
  useStudents,
  useAssignments,
  useLearningResults,
  useAppContext
} from '@/app/lib/contexts/AppContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { User as UserType } from '@/app/types';
import Link from 'next/link';

const StudentsPage = () => {
  const currentUser = useCurrentUser();
  const students = useStudents(currentUser?.id);
  const assignments = useAssignments(currentUser?.id);
  const learningResults = useLearningResults();
  const { state } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');

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

  const filteredStudents = students.filter(student => {
    if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !student.memberNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'memberNumber':
        return a.memberNumber.localeCompare(b.memberNumber);
      case 'completionRate':
        const aStats = getStudentStats(a.id);
        const bStats = getStudentStats(b.id);
        return (bStats.completionRate || 0) - (aStats.completionRate || 0);
      case 'averageScore':
        const aAvg = getStudentStats(a.id).averageScore || 0;
        const bAvg = getStudentStats(b.id).averageScore || 0;
        return bAvg - aAvg;
      default:
        return 0;
    }
  });

  function getStudentStats(studentId: string) {
    const studentAssignments = assignments.filter(a => a.studentIds.includes(studentId));
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

  function getStudentBadge(studentId: string) {
    const stats = getStudentStats(studentId);
    
    if (stats.completionRate >= 90) {
      return <Badge variant="default" className="bg-green-100 text-green-800">우수</Badge>;
    } else if (stats.completionRate >= 70) {
      return <Badge variant="secondary">양호</Badge>;
    } else if (stats.completionRate >= 50) {
      return <Badge variant="outline">보통</Badge>;
    } else {
      return <Badge variant="destructive">관심필요</Badge>;
    }
  }

  function getSubjectName(subject: string) {
    const subjectMap: { [key: string]: string } = {
      'math': '수학',
      'english': '영어',
      'korean': '국어'
    };
    return subjectMap[subject] || subject;
  }

  // 전체 통계 계산
  const totalStudents = students.length;
  const activeStudents = students.filter(s => {
    const stats = getStudentStats(s.id);
    return stats.totalAssignments > 0;
  }).length;
  const averageCompletionRate = students.length > 0 
    ? students.reduce((sum, s) => sum + getStudentStats(s.id).completionRate, 0) / students.length 
    : 0;
  const topPerformers = students.filter(s => getStudentStats(s.id).averageScore >= 80).length;

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">학생 관리</h1>
            <p className="text-muted-foreground mt-1">
              담당 학생들의 학습 현황을 확인하고 관리하세요
            </p>
          </div>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="총 학생 수"
            value={totalStudents}
            icon={Users}
            variant="gradient"
          />
          <StatsCard
            title="활성 학생"
            value={activeStudents}
            icon={User}
            variant="info"
          />
          <StatsCard
            title="평균 완료율"
            value={`${Math.round(averageCompletionRate)}%`}
            icon={TrendingUp}
            variant="success"
          />
          <StatsCard
            title="우수 학생"
            value={topPerformers}
            icon={Target}
            variant="warning"
          />
        </div>

        {/* 검색 및 정렬 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="학생 이름 또는 회원번호로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">이름순</SelectItem>
                  <SelectItem value="memberNumber">회원번호순</SelectItem>
                  <SelectItem value="completionRate">완료율순</SelectItem>
                  <SelectItem value="averageScore">평균점수순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 학생 목록 */}
        {sortedStudents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedStudents.map((student) => {
              const stats = getStudentStats(student.id);
              
              return (
                <Card key={student.id} className="card-hover">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{student.name}</CardTitle>
                            {student.grade && (
                              <Badge variant="secondary" className="text-xs">{student.grade}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{student.memberNumber}</p>
                        </div>
                      </div>
                      {getStudentBadge(student.id)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* 배정과목 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">배정과목</span>
                        <div className="flex gap-1">
                          {student.assignedSubjects?.map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {getSubjectName(subject)}
                            </Badge>
                          )) || <span className="text-xs text-muted-foreground">미배정</span>}
                        </div>
                      </div>
                    </div>

                    {/* 주요 지표 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-lg font-bold text-primary">{stats.completedAssignments}</div>
                        <div className="text-xs text-muted-foreground">완료 과제</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{Math.round(stats.averageScore)}</div>
                        <div className="text-xs text-muted-foreground">평균 점수</div>
                      </div>
                    </div>
                    
                    {/* 완료율 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>과제 완료율</span>
                        <span className="font-medium">{Math.round(stats.completionRate)}%</span>
                      </div>
                      <Progress value={stats.completionRate} className="h-2" />
                    </div>
                    
                    {/* 학습 시간 */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>총 학습시간</span>
                      </div>
                      <span className="font-medium">
                        {Math.round(stats.totalStudyTime / 60)}분
                      </span>
                    </div>
                    
                    {/* 액션 버튼 */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/teacher/students/${student.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Eye className="h-4 w-4" />
                          상세보기
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="학생이 없습니다"
            description="담당 학생이 배정되지 않았습니다"
          />
        )}

      </div>
    </MainLayout>
  );
};

export default StudentsPage;
'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { FolderManagementDialog } from '@/components/ui/folder-management-dialog';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  Calendar,
  FileText,
  Folder,
  Share2
} from 'lucide-react';
import { 
  useCurrentUser, 
  useWorksheets,
  useFolders,
  useAppContext
} from '@/app/lib/contexts/AppContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { WorksheetFilter, Worksheet } from '@/app/types';
import Link from 'next/link';

const WorksheetsPage = () => {
  const currentUser = useCurrentUser();
  const { state } = useAppContext();
  const worksheets = useWorksheets(currentUser?.id);
  const folders = useFolders(currentUser?.id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<WorksheetFilter>({});
  const [showFolderManagement, setShowFolderManagement] = useState(false);

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

  const filteredWorksheets = worksheets.filter(worksheet => {
    // 검색어 필터
    if (searchQuery && !worksheet.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // 상태 필터
    if (filter.status && worksheet.status !== filter.status) {
      return false;
    }
    
    // 폴더 필터
    if (filter.folderId && worksheet.folderId !== filter.folderId) {
      return false;
    }
    
    // 과목 필터
    if (filter.subject && worksheet.subject !== filter.subject) {
      return false;
    }
    
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'published': { label: '게시됨', variant: 'default' as const },
      'draft': { label: '임시저장', variant: 'secondary' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <Badge variant={statusInfo?.variant || 'default'}>
        {statusInfo?.label || status}
      </Badge>
    );
  };

  const getDifficultyBadges = (worksheet: Worksheet) => {
    const difficulties = Object.entries(worksheet.difficultyDistribution)
      .filter(([_, count]) => count > 0)
      .map(([difficulty, count]) => ({ difficulty, count }));
    
    const difficultyMap = {
      'low': { label: '하', color: 'bg-green-100 text-green-800' },
      'medium': { label: '중', color: 'bg-blue-100 text-blue-800' },
      'high': { label: '상', color: 'bg-orange-100 text-orange-800' },
      'highest': { label: '최상', color: 'bg-red-100 text-red-800' }
    };
    
    return difficulties.map(({ difficulty, count }) => {
      const diffInfo = difficultyMap[difficulty as keyof typeof difficultyMap];
      return (
        <span
          key={difficulty}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${diffInfo?.color || 'bg-gray-100 text-gray-800'}`}
        >
          {diffInfo?.label || difficulty} {count}
        </span>
      );
    });
  };

  const getFolderName = (folderId?: string) => {
    if (!folderId) return '미분류';
    const folder = folders.find(f => f.id === folderId);
    return folder?.name || '미분류';
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">학습지 관리</h1>
            <p className="text-muted-foreground mt-1">
              생성된 학습지를 관리하고 새로운 학습지를 만들어보세요
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowFolderManagement(true)}
            >
              <Folder className="h-4 w-4" />
              폴더 관리
            </Button>
            <Link href="/teacher/worksheets/create">
              <Button className="gap-2 button-hover">
                <Plus className="h-4 w-4" />
                학습지 만들기
              </Button>
            </Link>
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">전체 학습지</p>
                  <p className="text-2xl font-bold">{worksheets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">게시된 학습지</p>
                  <p className="text-2xl font-bold">{worksheets.filter(w => w.status === 'published').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Edit className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">임시저장</p>
                  <p className="text-2xl font-bold">{worksheets.filter(w => w.status === 'draft').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Folder className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">폴더 수</p>
                  <p className="text-2xl font-bold">{folders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="학습지 제목으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filter.subject || 'all'} onValueChange={(value) => setFilter(prev => ({ ...prev, subject: value === 'all' ? undefined : value as any }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="과목" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="math">수학</SelectItem>
                    <SelectItem value="english">영어</SelectItem>
                    <SelectItem value="korean">국어</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filter.status || 'all'} onValueChange={(value) => setFilter(prev => ({ ...prev, status: value === 'all' ? undefined : value as any }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="published">게시됨</SelectItem>
                    <SelectItem value="draft">임시저장</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filter.folderId || 'all'} onValueChange={(value) => setFilter(prev => ({ ...prev, folderId: value === 'all' ? undefined : value === 'uncategorized' ? '' : value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="폴더" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="uncategorized">미분류</SelectItem>
                    {folders.map(folder => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 학습지 목록 */}
        {filteredWorksheets.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWorksheets.map((worksheet) => (
              <Card key={worksheet.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 mb-2">
                        {worksheet.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(worksheet.status)}
                        <Badge variant="outline" className="text-xs">
                          {worksheet.subject === 'math' ? '수학' : 
                           worksheet.subject === 'english' ? '영어' : '국어'}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          {worksheet.grade}-{worksheet.semester}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {worksheet.description && (
                    <CardDescription className="line-clamp-2">
                      {worksheet.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* 문제 정보 */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">문제 수</span>
                    <span className="font-medium">{worksheet.totalQuestions}문제</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">평균 정답률</span>
                    <span className="font-medium">{worksheet.averageCorrectRate}%</span>
                  </div>
                  
                  {/* 난이도 분포 */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">난이도 분포</p>
                    <div className="flex flex-wrap gap-1">
                      {getDifficultyBadges(worksheet)}
                    </div>
                  </div>
                  
                  {/* 폴더 및 생성일 */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Folder className="h-3 w-3" />
                      <span>{getFolderName(worksheet.folderId)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(worksheet.createdAt)}</span>
                    </div>
                  </div>
                  
                  {/* 액션 버튼들 */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/teacher/worksheets/${worksheet.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Eye className="h-4 w-4" />
                        상세보기
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="학습지가 없습니다"
            description="새로운 학습지를 만들어 학생들에게 배정해보세요"
            action={{
              label: "학습지 만들기",
              onClick: () => window.location.href = '/teacher/worksheets/create'
            }}
          />
        )}

        {/* 폴더 관리 Dialog */}
        <FolderManagementDialog
          open={showFolderManagement}
          onOpenChange={setShowFolderManagement}
        />
      </div>
    </MainLayout>
  );
};

export default WorksheetsPage;
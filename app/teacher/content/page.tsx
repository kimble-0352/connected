'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Upload, Eye, Share2, Download, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useCurrentUser } from '@/app/lib/contexts/AppContext';
import { getContentItems } from '@/app/lib/data/dummy-data';
import { ContentItem, ContentFilter, Subject, SharingSettings } from '@/app/types';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SharingSettingsComponent } from '@/components/ui/sharing-settings';

const ContentManagementPage = () => {
  const currentUser = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ContentFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContentForShare, setSelectedContentForShare] = useState<ContentItem | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSavingShare, setIsSavingShare] = useState(false);

  const contentItems = getContentItems();

  // 필터링된 콘텐츠 목록
  const filteredContent = useMemo(() => {
    return contentItems.filter(item => {
      // 검색어 필터
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!item.title.toLowerCase().includes(query) &&
            !item.description?.toLowerCase().includes(query) &&
            !item.metadata.schoolName?.toLowerCase().includes(query) &&
            !item.tags.some(tag => tag.toLowerCase().includes(query))) {
          return false;
        }
      }

      // 과목 필터
      if (filter.subject && item.metadata.subject !== filter.subject) {
        return false;
      }

      // 상태 필터
      if (filter.status && item.status !== filter.status) {
        return false;
      }

      // 공유 타입 필터
      if (filter.sharingType && item.sharingSettings.type !== filter.sharingType) {
        return false;
      }

      // 학교명 필터
      if (filter.schoolName && item.metadata.schoolName !== filter.schoolName) {
        return false;
      }

      // 지역 필터
      if (filter.region && item.metadata.region !== filter.region) {
        return false;
      }

      // 학년 필터
      if (filter.grade && item.metadata.grade !== filter.grade) {
        return false;
      }

      return true;
    });
  }, [contentItems, searchQuery, filter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">완료</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">처리중</Badge>;
      case 'failed':
        return <Badge variant="destructive">실패</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSharingBadge = (sharingType: string, isPublic: boolean) => {
    if (isPublic) {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">전체 공개</Badge>;
    }
    switch (sharingType) {
      case 'selective':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">선택 공유</Badge>;
      case 'private':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">비공개</Badge>;
      default:
        return <Badge variant="outline">{sharingType}</Badge>;
    }
  };

  const getSubjectName = (subject: Subject) => {
    switch (subject) {
      case 'math': return '수학';
      case 'english': return '영어';
      case 'korean': return '국어';
      default: return subject;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleShareClick = (item: ContentItem) => {
    setSelectedContentForShare(item);
    setIsShareDialogOpen(true);
  };

  const handleDownloadClick = (item: ContentItem) => {
    try {
      const link = document.createElement('a');
      link.href = item.filePath || '#';
      link.download = item.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('다운로드 실패:', error);
    }
  };

  const handleShareSettingsChange = (settings: SharingSettings) => {
    console.log('공유 설정 변경:', settings);
  };

  const handleSaveShareSettings = async () => {
    setIsSavingShare(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsShareDialogOpen(false);
      setSelectedContentForShare(null);
    } catch (error) {
      console.error('공유 설정 저장 실패:', error);
    } finally {
      setIsSavingShare(false);
    }
  };

  if (!currentUser || currentUser.role !== 'teacher') {
    return <div>접근 권한이 없습니다.</div>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">콘텐츠 관리</h1>
          <p className="text-muted-foreground">학교 기출문제 및 자체 제작 문항을 관리하세요</p>
        </div>
        <Link href="/teacher/content/upload">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            콘텐츠 업로드
          </Button>
        </Link>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="제목, 설명, 학교명, 태그로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              필터
            </Button>
          </div>

          {showFilters && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">과목</label>
                  <Select value={filter.subject || 'all'} onValueChange={(value) => 
                    setFilter(prev => ({ ...prev, subject: value === 'all' ? undefined : value as Subject }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="math">수학</SelectItem>
                      <SelectItem value="english">영어</SelectItem>
                      <SelectItem value="korean">국어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">상태</label>
                  <Select value={filter.status || 'all'} onValueChange={(value) => 
                    setFilter(prev => ({ ...prev, status: value === 'all' ? undefined : value as any }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                      <SelectItem value="processing">처리중</SelectItem>
                      <SelectItem value="failed">실패</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">공유 설정</label>
                  <Select value={filter.sharingType || 'all'} onValueChange={(value) => 
                    setFilter(prev => ({ ...prev, sharingType: value === 'all' ? undefined : value as any }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="public">전체 공개</SelectItem>
                      <SelectItem value="selective">선택 공유</SelectItem>
                      <SelectItem value="private">비공개</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">학년</label>
                  <Select value={filter.grade || 'all'} onValueChange={(value) => 
                    setFilter(prev => ({ ...prev, grade: value === 'all' ? undefined : value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="중1">중1</SelectItem>
                      <SelectItem value="중2">중2</SelectItem>
                      <SelectItem value="중3">중3</SelectItem>
                      <SelectItem value="고1">고1</SelectItem>
                      <SelectItem value="고2">고2</SelectItem>
                      <SelectItem value="고3">고3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{contentItems.length}</div>
            <div className="text-sm text-muted-foreground">전체 콘텐츠</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {contentItems.filter(item => item.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">처리 완료</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {contentItems.filter(item => item.status === 'processing').length}
            </div>
            <div className="text-sm text-muted-foreground">처리 중</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {contentItems.filter(item => item.sharingSettings.isPublic).length}
            </div>
            <div className="text-sm text-muted-foreground">공개 콘텐츠</div>
          </CardContent>
        </Card>
      </div>

      {/* 콘텐츠 목록 */}
      <div className="space-y-4">
        {filteredContent.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">콘텐츠가 없습니다</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || Object.keys(filter).length > 0 
                  ? '검색 조건에 맞는 콘텐츠가 없습니다.' 
                  : '첫 번째 콘텐츠를 업로드해보세요.'}
              </p>
              <Link href="/teacher/content/upload">
                <Button>콘텐츠 업로드</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredContent.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <Link href={`/teacher/content/${item.id}`}>
                          <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                            {item.title}
                          </h3>
                        </Link>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/teacher/content/${item.id}`} className="flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              상세 보기
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShareClick(item)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            공유 설정
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadClick(item)}>
                            <Download className="h-4 w-4 mr-2" />
                            다운로드
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(item.status)}
                      {getSharingBadge(item.sharingSettings.type, item.sharingSettings.isPublic)}
                      <Badge variant="outline">{getSubjectName(item.metadata.subject)}</Badge>
                      <Badge variant="outline">{item.metadata.grade}</Badge>
                      {item.metadata.schoolName && (
                        <Badge variant="outline">{item.metadata.schoolName}</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>파일: {item.fileName}</span>
                      <span>크기: {formatFileSize(item.fileSize)}</span>
                      <span>문항: {item.metadata.questionCount}개</span>
                      <span>업로드: {formatDate(item.createdAt)}</span>
                      <span>작성자: {item.teacherName}</span>
                    </div>

                    {item.status === 'processing' && item.ocrResult && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>OCR 처리 중...</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    )}

                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 공유 설정 다이얼로그 */}
      {selectedContentForShare && (
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>공유 설정 - {selectedContentForShare.title}</DialogTitle>
            </DialogHeader>
            <SharingSettingsComponent
              initialSettings={selectedContentForShare.sharingSettings}
              onSettingsChange={handleShareSettingsChange}
              onSave={handleSaveShareSettings}
              isSaving={isSavingShare}
            />
          </DialogContent>
        </Dialog>
      )}
      </div>
    </MainLayout>
  );
};

export default ContentManagementPage;

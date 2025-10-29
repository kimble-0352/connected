'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Share2, Download, Eye, FileText, Image, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCurrentUser } from '@/app/lib/contexts/AppContext';
import { getContentItemById } from '@/app/lib/data/dummy-data';
import { Subject, SharingSettings } from '@/app/types';
import { MainLayout } from '@/components/layout/MainLayout';
import { SharingSettingsComponent } from '@/components/ui/sharing-settings';

interface ContentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ContentDetailPage = ({ params }: ContentDetailPageProps) => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSavingShare, setIsSavingShare] = useState(false);
  
  const { id } = use(params);
  const contentItem = getContentItemById(id);

  if (!currentUser || currentUser.role !== 'teacher') {
    return <div>접근 권한이 없습니다.</div>;
  }

  if (!contentItem) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">콘텐츠를 찾을 수 없습니다</h1>
            <Button onClick={() => router.push('/teacher/content')}>
              콘텐츠 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 gap-1">
            <CheckCircle className="h-3 w-3" />
            완료
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 gap-1">
            <Clock className="h-3 w-3" />
            처리중
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            실패
          </Badge>
        );
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') {
      return <FileText className="h-6 w-6 text-red-500" />;
    }
    if (fileType === 'image') {
      return <Image className="h-6 w-6 text-blue-500" />;
    }
    return <FileText className="h-6 w-6 text-gray-500" />;
  };

  const handleShareSettingsChange = (settings: SharingSettings) => {
    // 실제 구현에서는 API 호출로 설정을 업데이트
    console.log('공유 설정 변경:', settings);
  };

  const handleSaveShareSettings = async () => {
    setIsSavingShare(true);
    try {
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsShareDialogOpen(false);
      // 성공 메시지 표시 등
    } catch (error) {
      console.error('공유 설정 저장 실패:', error);
    } finally {
      setIsSavingShare(false);
    }
  };

  const handleDownload = async () => {
    try {
      // 실제 구현에서는 파일 다운로드 API 호출
      const link = document.createElement('a');
      link.href = contentItem.filePath || '#';
      link.download = contentItem.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('다운로드 실패:', error);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{contentItem.title}</h1>
            <p className="text-muted-foreground">{contentItem.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/teacher/content/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            편집
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            공유
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            다운로드
          </Button>
        </div>
      </div>

      {/* 상태 및 메타데이터 */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">상태</h4>
              <div className="flex flex-col gap-2">
                {getStatusBadge(contentItem.status)}
                {getSharingBadge(contentItem.sharingSettings.type, contentItem.sharingSettings.isPublic)}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">파일 정보</h4>
              <div className="flex items-center gap-2">
                {getFileIcon(contentItem.fileType)}
                <div>
                  <p className="text-sm font-medium">{contentItem.fileName}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(contentItem.fileSize)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">교육 정보</h4>
              <div className="space-y-1">
                <div className="flex gap-2">
                  <Badge variant="outline">{getSubjectName(contentItem.metadata.subject)}</Badge>
                  <Badge variant="outline">{contentItem.metadata.grade}</Badge>
                  {contentItem.metadata.semester && (
                    <Badge variant="outline">{contentItem.metadata.semester}</Badge>
                  )}
                </div>
                {contentItem.metadata.examType && (
                  <Badge variant="secondary">{contentItem.metadata.examType}</Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">업로드 정보</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">작성자:</span> {contentItem.teacherName}</p>
                <p><span className="text-muted-foreground">업로드:</span> {formatDate(contentItem.createdAt)}</p>
                <p><span className="text-muted-foreground">수정:</span> {formatDate(contentItem.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 탭 컨텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="questions">문항</TabsTrigger>
          <TabsTrigger value="sharing">공유 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 메타데이터 상세 */}
            <Card>
              <CardHeader>
                <CardTitle>메타데이터</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">학교명:</span>
                    <p className="font-medium">{contentItem.metadata.schoolName || '미지정'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">지역:</span>
                    <p className="font-medium">{contentItem.metadata.region || '미지정'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">학기:</span>
                    <p className="font-medium">{contentItem.metadata.semester || '미지정'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">출제년도:</span>
                    <p className="font-medium">{contentItem.metadata.examYear || '미지정'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">문항 수:</span>
                    <p className="font-medium">{contentItem.metadata.questionCount}개</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">난이도:</span>
                    <p className="font-medium">{contentItem.metadata.difficulty || '미지정'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">자동 태깅:</span>
                    <p className="font-medium">{contentItem.metadata.autoTagged ? '예' : '아니오'}</p>
                  </div>
                </div>
                
                {contentItem.tags.length > 0 && (
                  <div>
                    <span className="text-muted-foreground text-sm">태그:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {contentItem.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 파일 미리보기 */}
            <Card>
              <CardHeader>
                <CardTitle>파일 미리보기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                  {contentItem.thumbnailPath ? (
                    <img 
                      src={contentItem.thumbnailPath} 
                      alt="파일 미리보기"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      {getFileIcon(contentItem.fileType)}
                      <p className="text-sm text-muted-foreground mt-2">미리보기 없음</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    전체 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>문항 분석 및 OCR 처리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
                <h3 className="text-xl font-semibold mb-3">추후 구현 예정입니다</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  문항 자동 추출, OCR 처리, 그리고 문항 분석 기능은 현재 개발 중입니다. 
                  곧 더 나은 기능으로 찾아뵙겠습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>공유 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">현재 공유 상태</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">공유 유형:</span>
                      {getSharingBadge(contentItem.sharingSettings.type, contentItem.sharingSettings.isPublic)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">전체 공개:</span>
                      <span className="text-sm">{contentItem.sharingSettings.isPublic ? '예' : '아니오'}</span>
                    </div>
                    {contentItem.sharingSettings.sharedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">공유 시작:</span>
                        <span className="text-sm">{formatDate(contentItem.sharingSettings.sharedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">권한 설정</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>보기:</span>
                      <span>{contentItem.sharingSettings.permissions.canView ? '허용' : '차단'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>편집:</span>
                      <span>{contentItem.sharingSettings.permissions.canEdit ? '허용' : '차단'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>다운로드:</span>
                      <span>{contentItem.sharingSettings.permissions.canDownload ? '허용' : '차단'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {contentItem.sharingSettings.allowedTeachers.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">공유 대상 선생님</h4>
                  <div className="flex flex-wrap gap-2">
                    {contentItem.sharingSettings.allowedTeachers.map((teacherId, index) => (
                      <Badge key={index} variant="outline">
                        선생님 {teacherId}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <Button onClick={() => setIsShareDialogOpen(true)}>공유 설정 변경</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 공유 설정 다이얼로그 */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>공유 설정 - {contentItem.title}</DialogTitle>
          </DialogHeader>
          <SharingSettingsComponent
            initialSettings={contentItem.sharingSettings}
            onSettingsChange={handleShareSettingsChange}
            onSave={handleSaveShareSettings}
            isSaving={isSavingShare}
          />
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
};

export default ContentDetailPage;

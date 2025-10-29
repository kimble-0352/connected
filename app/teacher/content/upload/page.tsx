'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/app/lib/contexts/AppContext';
import { Subject, ContentMetadata } from '@/app/types';
import { FileUpload, UploadFile } from '@/components/ui/file-upload';
import { MetadataTagging } from '@/components/features/MetadataTagging';
import { MainLayout } from '@/components/layout/MainLayout';

interface FormData {
  title: string;
  description: string;
  tags: string[];
}

const ContentUploadPage = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    tags: []
  });
  const [metadata, setMetadata] = useState<ContentMetadata>({
    subject: 'math',
    grade: '',
    questionCount: 0,
    autoTagged: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isAutoTagging, setIsAutoTagging] = useState(false);

  const handleFilesChange = (files: UploadFile[]) => {
    setUploadFiles(files);
  };

  const handleFileRemove = (id: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleMetadataChange = (newMetadata: ContentMetadata) => {
    setMetadata(newMetadata);
  };

  const handleAutoTag = () => {
    setIsAutoTagging(true);
    // 자동 태깅 시뮬레이션
    setTimeout(() => {
      setIsAutoTagging(false);
    }, 2000);
  };



  const simulateUpload = async (fileId: string) => {
    const fileIndex = uploadFiles.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;

    // 업로드 시뮬레이션
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadFiles(prev => {
        const newFiles = [...prev];
        if (newFiles[fileIndex]) {
          newFiles[fileIndex] = {
            ...newFiles[fileIndex],
            progress,
            status: progress === 100 ? 'completed' : 'uploading'
          };
        }
        return newFiles;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadFiles.length === 0) {
      alert('업로드할 파일을 선택해주세요.');
      return;
    }

    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!metadata.subject) {
      alert('과목을 선택해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      // 모든 파일 업로드 시뮬레이션
      await Promise.all(uploadFiles.map(file => simulateUpload(file.id)));

      // OCR 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('콘텐츠가 성공적으로 업로드되었습니다!');
      router.push('/teacher/content');
    } catch (error) {
      console.error('Upload error:', error);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!currentUser || currentUser.role !== 'teacher') {
    return <div>접근 권한이 없습니다.</div>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">콘텐츠 업로드</h1>
          <p className="text-muted-foreground">학교 기출문제나 자체 제작 문항을 업로드하세요</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 파일 업로드 영역 */}
        <Card>
          <CardHeader>
            <CardTitle>파일 업로드</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              files={uploadFiles}
              onFilesChange={handleFilesChange}
              onFileRemove={handleFileRemove}
              disabled={isUploading}
            />
          </CardContent>
        </Card>

        {/* 기본 정보 입력 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="예: 서울고등학교 2024년 1학기 중간고사"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="콘텐츠에 대한 간단한 설명을 입력하세요"
                rows={3}
              />
            </div>

          </CardContent>
        </Card>

        {/* 메타데이터 자동 태깅 */}
        <MetadataTagging
          initialMetadata={metadata}
          extractedText=""
          fileName={uploadFiles.length > 0 ? uploadFiles[0].file.name : ''}
          tags={formData.tags}
          onMetadataChange={handleMetadataChange}
          onTagsChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
          onAutoTag={handleAutoTag}
          isAutoTagging={isAutoTagging}
        />

        <Separator />

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" disabled={isUploading || uploadFiles.length === 0}>
            {isUploading ? '업로드 중...' : '업로드 시작'}
          </Button>
        </div>
      </form>
      </div>
    </MainLayout>
  );
};

export default ContentUploadPage;

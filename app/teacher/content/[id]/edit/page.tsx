'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, Upload, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/app/lib/contexts/AppContext';
import { getContentItemById } from '@/app/lib/data/dummy-data';
import { Subject } from '@/app/types';
import { MainLayout } from '@/components/layout/MainLayout';

interface ContentEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ContentEditPage = ({ params }: ContentEditPageProps) => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const { id } = use(params);
  const contentItem = getContentItemById(id);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: contentItem?.title || '',
    description: contentItem?.description || '',
    subject: contentItem?.metadata.subject || 'math',
    grade: contentItem?.metadata.grade || '',
    semester: contentItem?.metadata.semester || '',
    schoolName: contentItem?.metadata.schoolName || '',
    region: contentItem?.metadata.region || '',
    examYear: contentItem?.metadata.examYear || new Date().getFullYear(),
    examType: contentItem?.metadata.examType || '',
    difficulty: contentItem?.metadata.difficulty || '',
    tags: contentItem?.tags.join(', ') || ''
  });

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

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 성공 시 상세보기 페이지로 이동
      router.push(`/teacher/content/${id}`);
    } catch (error) {
      console.error('저장 실패:', error);
      // 에러 처리
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const getSubjectName = (subject: Subject) => {
    switch (subject) {
      case 'math': return '수학';
      case 'english': return '영어';
      case 'korean': return '국어';
      default: return subject;
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (fileType === 'image') {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">콘텐츠 편집</h1>
              <p className="text-muted-foreground">콘텐츠 정보를 수정하세요</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 편집 영역 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="콘텐츠 제목을 입력하세요"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="콘텐츠에 대한 설명을 입력하세요"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 교육 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>교육 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">과목 *</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">수학</SelectItem>
                        <SelectItem value="english">영어</SelectItem>
                        <SelectItem value="korean">국어</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">학년 *</Label>
                    <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="semester">학기 *</Label>
                    <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="학기 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-1">1-1</SelectItem>
                        <SelectItem value="1-2">1-2</SelectItem>
                        <SelectItem value="2-1">2-1</SelectItem>
                        <SelectItem value="2-2">2-2</SelectItem>
                        <SelectItem value="3-1">3-1</SelectItem>
                        <SelectItem value="3-2">3-2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="examType">시험 유형</Label>
                    <Input
                      id="examType"
                      value={formData.examType}
                      onChange={(e) => handleInputChange('examType', e.target.value)}
                      placeholder="예: 중간고사, 기말고사"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">난이도</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="난이도 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">쉬움</SelectItem>
                        <SelectItem value="medium">보통</SelectItem>
                        <SelectItem value="hard">어려움</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 학교 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>학교 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">학교명</Label>
                    <Input
                      id="schoolName"
                      value={formData.schoolName}
                      onChange={(e) => handleInputChange('schoolName', e.target.value)}
                      placeholder="학교명을 입력하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">지역</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      placeholder="지역을 입력하세요"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examYear">출제년도</Label>
                  <Input
                    id="examYear"
                    type="number"
                    value={formData.examYear}
                    onChange={(e) => handleInputChange('examYear', parseInt(e.target.value) || new Date().getFullYear())}
                    min="2000"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 태그 */}
            <Card>
              <CardHeader>
                <CardTitle>태그</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="태그1, 태그2, 태그3"
                  />
                  <p className="text-sm text-muted-foreground">
                    태그를 쉼표(,)로 구분하여 입력하세요
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 파일 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>파일 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  {getFileIcon(contentItem.fileType)}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{contentItem.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {(contentItem.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  파일 교체
                </Button>
              </CardContent>
            </Card>

            {/* 미리보기 */}
            <Card>
              <CardHeader>
                <CardTitle>미리보기</CardTitle>
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
              </CardContent>
            </Card>

            {/* 현재 태그 미리보기 */}
            {formData.tags && (
              <Card>
                <CardHeader>
                  <CardTitle>태그 미리보기</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContentEditPage;

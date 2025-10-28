'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { FormField } from '@/components/ui/form-field';
import { 
  ArrowLeft,
  Save,
  BookOpen,
  FolderOpen,
  QrCode,
  FileText,
  Tag,
  Plus,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  useCurrentUser, 
  useWorksheets,
  useFolders
} from '@/app/lib/contexts/AppContext';
import Link from 'next/link';

const EditWorksheetPage = () => {
  const params = useParams();
  const router = useRouter();
  const worksheetId = params.id as string;
  const currentUser = useCurrentUser();
  const worksheets = useWorksheets(currentUser?.id);
  const folders = useFolders(currentUser?.id);
  
  const worksheet = worksheets.find(w => w.id === worksheetId);
  
  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    folderId: 'none',
    qrCodeEnabled: true,
    status: 'draft' as 'draft' | 'published'
  });
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // 기본 태그 목록
  const defaultTags = [
    '연습문제',
    '과제', 
    '일일테스트',
    '주간테스트',
    '월간테스트',
    '내신대비',
    '복습',
    '예습',
    '심화',
    '기초'
  ];

  // 학습지 데이터 로드
  useEffect(() => {
    if (worksheet) {
      setFormData({
        title: worksheet.title,
        description: worksheet.description || '',
        tags: worksheet.tags || [],
        folderId: worksheet.folderId || 'none',
        qrCodeEnabled: worksheet.qrCode !== null,
        status: worksheet.status
      });
    }
  }, [worksheet]);

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

  if (!worksheet) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">학습지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">요청하신 학습지가 존재하지 않거나 삭제되었습니다.</p>
            <Link href="/teacher/worksheets">
              <Button>학습지 목록으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 제거
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddDefaultTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = '학습지 제목을 입력해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (isDraft: boolean = true) => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // 실제 구현에서는 API 호출
      const saveData = {
        id: worksheetId,
        ...formData,
        folderId: formData.folderId === 'none' ? undefined : formData.folderId,
        status: isDraft ? 'draft' : 'published'
      };
      console.log('학습지 수정:', saveData);
      
      // 임시 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      
      if (!isDraft) {
        router.push(`/teacher/worksheets/${worksheetId}`);
      }
    } catch (error) {
      console.error('학습지 수정 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubjectLabel = (subject: string) => {
    const subjectMap = {
      'math': '수학',
      'english': '영어',
      'korean': '국어'
    };
    return subjectMap[subject as keyof typeof subjectMap] || subject;
  };

  const getFolderName = (folderId?: string) => {
    if (!folderId || folderId === 'none') return '미분류';
    const folder = folders.find(f => f.id === folderId);
    return folder?.name || '미분류';
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/teacher/worksheets/${worksheetId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                돌아가기
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">학습지 편집</h1>
              <p className="text-muted-foreground mt-1">
                학습지 정보를 수정할 수 있습니다
              </p>
            </div>
          </div>
          
          {isSaved && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">저장되었습니다</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 편집 영역 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  기본 정보
                </CardTitle>
                <CardDescription>
                  학습지의 기본 정보를 수정하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  label="학습지 제목"
                  required
                  error={errors.title}
                >
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="학습지 제목을 입력하세요"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                </FormField>

                <FormField
                  label="설명"
                >
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="학습지 설명을 입력하세요"
                    rows={3}
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* 태그 관리 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  태그
                </CardTitle>
                <CardDescription>
                  학습지를 분류하고 검색하기 쉽게 태그를 추가하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 현재 태그 */}
                {formData.tags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">현재 태그</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:bg-red-100 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 태그 추가 */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">새 태그 추가</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="태그 입력"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 기본 태그 */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">추천 태그</Label>
                  <div className="flex flex-wrap gap-2">
                    {defaultTags
                      .filter(tag => !formData.tags.includes(tag))
                      .map((tag) => (
                        <Button
                          key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddDefaultTag(tag)}
                          className="text-xs"
                        >
                          + {tag}
                        </Button>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 폴더 및 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  분류 및 설정
                </CardTitle>
                <CardDescription>
                  학습지의 분류와 추가 설정을 관리하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  label="폴더"
                >
                  <Select
                    value={formData.folderId}
                    onValueChange={(value) => handleInputChange('folderId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="폴더 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">미분류</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">QR 코드 생성</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      학생들이 쉽게 접근할 수 있도록 QR 코드를 생성합니다
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={formData.qrCodeEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('qrCodeEnabled', !formData.qrCodeEnabled)}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    {formData.qrCodeEnabled ? '활성화됨' : '비활성화'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 학습지 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">학습지 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">과목</p>
                  <p className="font-medium">{getSubjectLabel(worksheet.subject)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">총 문항 수</p>
                  <p className="font-medium">{worksheet.totalQuestions}문제</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">평균 정답률</p>
                  <p className="font-medium">{worksheet.averageCorrectRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">현재 폴더</p>
                  <p className="font-medium">{getFolderName(formData.folderId)}</p>
                </div>
              </CardContent>
            </Card>

            {/* 저장 버튼 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">저장 옵션</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleSave(true)}
                  disabled={isSubmitting}
                  className="w-full"
                  variant="outline"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? '저장 중...' : '임시저장'}
                </Button>
                
                <Button
                  onClick={() => handleSave(false)}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? '저장 중...' : '저장 후 게시'}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  임시저장은 언제든지 다시 편집할 수 있습니다
                </p>
              </CardContent>
            </Card>

            {/* 주의사항 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  주의사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• 문제 내용은 편집할 수 없습니다</p>
                  <p>• 이미 배정된 과제가 있는 경우 일부 변경사항이 반영되지 않을 수 있습니다</p>
                  <p>• 게시된 학습지는 학생들이 즉시 확인할 수 있습니다</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditWorksheetPage;

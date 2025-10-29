'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Save, RotateCcw } from 'lucide-react';
import { ContentMetadata, Subject, Difficulty } from '@/app/types';

interface MetadataFormProps {
  initialMetadata: ContentMetadata;
  onMetadataChange: (metadata: ContentMetadata) => void;
  onSave?: (metadata: ContentMetadata) => void;
  onReset?: () => void;
  isSaving?: boolean;
  showActions?: boolean;
  className?: string;
}

export const MetadataForm: React.FC<MetadataFormProps> = ({
  initialMetadata,
  onMetadataChange,
  onSave,
  onReset,
  isSaving = false,
  showActions = true,
  className
}) => {
  const [metadata, setMetadata] = useState<ContentMetadata>(initialMetadata);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setMetadata(initialMetadata);
  }, [initialMetadata]);

  useEffect(() => {
    onMetadataChange(metadata);
  }, [metadata, onMetadataChange]);

  const handleInputChange = (field: keyof ContentMetadata, value: any) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCustomTag = () => {
    if (tagInput.trim() && !customTags.includes(tagInput.trim())) {
      setCustomTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeCustomTag = (tag: string) => {
    setCustomTags(prev => prev.filter(t => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(metadata);
    }
  };

  const handleReset = () => {
    setMetadata(initialMetadata);
    setCustomTags([]);
    setTagInput('');
    if (onReset) {
      onReset();
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

  const getDifficultyName = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'low': return '하';
      case 'medium': return '중';
      case 'high': return '상';
      case 'highest': return '최상';
      default: return difficulty;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>메타데이터 편집</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 기본 정보 */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">기본 정보</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schoolName">학교명</Label>
              <Input
                id="schoolName"
                value={metadata.schoolName || ''}
                onChange={(e) => handleInputChange('schoolName', e.target.value)}
                placeholder="예: 서울고등학교"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">지역</Label>
              <Input
                id="region"
                value={metadata.region || ''}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder="예: 서울특별시"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">과목 *</Label>
              <Select 
                value={metadata.subject} 
                onValueChange={(value) => handleInputChange('subject', value as Subject)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="과목 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">수학</SelectItem>
                  <SelectItem value="english">영어</SelectItem>
                  <SelectItem value="korean">국어</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">학년</Label>
              <Select 
                value={metadata.grade} 
                onValueChange={(value) => handleInputChange('grade', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="학년 선택" />
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
        </div>

        <Separator />

        {/* 시험 정보 */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">시험 정보</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="examYear">출제년도</Label>
              <Input
                id="examYear"
                type="number"
                value={metadata.examYear || ''}
                onChange={(e) => handleInputChange('examYear', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="2024"
                min="2000"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examType">시험 유형</Label>
              <Select 
                value={metadata.examType || ''} 
                onValueChange={(value) => handleInputChange('examType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="시험 유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="중간고사">중간고사</SelectItem>
                  <SelectItem value="기말고사">기말고사</SelectItem>
                  <SelectItem value="모의고사">모의고사</SelectItem>
                  <SelectItem value="단원평가">단원평가</SelectItem>
                  <SelectItem value="자체제작">자체제작</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">난이도</Label>
              <Select 
                value={metadata.difficulty || ''} 
                onValueChange={(value) => handleInputChange('difficulty', value as Difficulty)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="난이도 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">하</SelectItem>
                  <SelectItem value="medium">중</SelectItem>
                  <SelectItem value="high">상</SelectItem>
                  <SelectItem value="highest">최상</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount">문항 수</Label>
              <Input
                id="questionCount"
                type="number"
                value={metadata.questionCount}
                onChange={(e) => handleInputChange('questionCount', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* 추가 태그 */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">추가 태그</h4>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="태그 입력 후 Enter"
              />
              <Button type="button" onClick={addCustomTag} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {customTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    #{tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeCustomTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* 자동 태깅 정보 */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">자동 태깅 정보</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm">자동 태깅 적용:</span>
            <Badge variant={metadata.autoTagged ? "default" : "outline"}>
              {metadata.autoTagged ? '적용됨' : '미적용'}
            </Badge>
          </div>
          {metadata.autoTagged && (
            <p className="text-xs text-muted-foreground">
              이 메타데이터는 자동 태깅 시스템에 의해 생성되었습니다.
            </p>
          )}
        </div>

        {/* 현재 설정 요약 */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-sm mb-3">현재 설정 요약</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">과목:</span>
              <span className="ml-2 font-medium">{getSubjectName(metadata.subject)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">학년:</span>
              <span className="ml-2 font-medium">{metadata.grade || '미지정'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">학교:</span>
              <span className="ml-2 font-medium">{metadata.schoolName || '미지정'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">지역:</span>
              <span className="ml-2 font-medium">{metadata.region || '미지정'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">시험유형:</span>
              <span className="ml-2 font-medium">{metadata.examType || '미지정'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">난이도:</span>
              <span className="ml-2 font-medium">
                {metadata.difficulty ? getDifficultyName(metadata.difficulty) : '미지정'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">출제년도:</span>
              <span className="ml-2 font-medium">{metadata.examYear || '미지정'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">문항수:</span>
              <span className="ml-2 font-medium">{metadata.questionCount}개</span>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        {showActions && (
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              disabled={isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              초기화
            </Button>
            {onSave && (
              <Button 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    저장
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

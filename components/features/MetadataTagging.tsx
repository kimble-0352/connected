'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Wand2, Check, X } from 'lucide-react';
import { ContentMetadata, Subject, Difficulty } from '@/app/types';

interface MetadataTaggingProps {
  initialMetadata?: Partial<ContentMetadata>;
  extractedText?: string;
  fileName?: string;
  tags?: string[];
  onMetadataChange: (metadata: ContentMetadata) => void;
  onTagsChange?: (tags: string[]) => void;
  onAutoTag?: () => void;
  isAutoTagging?: boolean;
}

interface AutoTagSuggestion {
  field: keyof ContentMetadata;
  value: string;
  confidence: number;
  reason: string;
}

export const MetadataTagging: React.FC<MetadataTaggingProps> = ({
  initialMetadata = {},
  extractedText = '',
  fileName = '',
  tags = [],
  onMetadataChange,
  onTagsChange,
  onAutoTag,
  isAutoTagging = false
}) => {
  const [metadata, setMetadata] = useState<ContentMetadata>({
    subject: 'math',
    grade: '',
    questionCount: 0,
    autoTagged: false,
    ...initialMetadata
  });

  const [suggestions, setSuggestions] = useState<AutoTagSuggestion[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    onMetadataChange(metadata);
  }, [metadata, onMetadataChange]);

  useEffect(() => {
    if (extractedText || fileName) {
      generateAutoTagSuggestions();
    }
  }, [extractedText, fileName]);

  const generateAutoTagSuggestions = () => {
    const newSuggestions: AutoTagSuggestion[] = [];
    const text = (extractedText + ' ' + fileName).toLowerCase();

    // 학교명 추출
    const schoolPatterns = [
      /([가-힣]+(?:초등학교|중학교|고등학교|학교))/g,
      /([가-힣]+(?:초|중|고))/g
    ];
    
    for (const pattern of schoolPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        newSuggestions.push({
          field: 'schoolName',
          value: matches[0],
          confidence: 85,
          reason: '파일명/내용에서 학교명 패턴 감지'
        });
        break;
      }
    }

    // 지역 추출
    const regionPatterns = [
      /(서울특별시|서울|부산광역시|부산|대구광역시|대구|인천광역시|인천|광주광역시|광주|대전광역시|대전|울산광역시|울산|세종특별자치시|세종)/g,
      /([가-힣]+시|[가-힣]+구|[가-힣]+군)/g
    ];

    for (const pattern of regionPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        newSuggestions.push({
          field: 'region',
          value: matches[0],
          confidence: 80,
          reason: '파일명/내용에서 지역명 패턴 감지'
        });
        break;
      }
    }

    // 과목 추출
    const subjectKeywords = {
      math: ['수학', 'mathematics', 'math', '대수', '기하', '확률', '통계', '미적분'],
      english: ['영어', 'english', '문법', 'grammar', '독해', 'reading'],
      korean: ['국어', 'korean', '문학', '작문', '화법', '독서']
    };

    for (const [subject, keywords] of Object.entries(subjectKeywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          newSuggestions.push({
            field: 'subject',
            value: subject,
            confidence: 90,
            reason: `'${keyword}' 키워드 감지`
          });
          break;
        }
      }
    }

    // 학년 추출
    const gradePatterns = [
      /(중1|중2|중3|고1|고2|고3)/g,
      /(1학년|2학년|3학년)/g,
      /([1-3])년/g
    ];

    for (const pattern of gradePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        newSuggestions.push({
          field: 'grade',
          value: matches[0],
          confidence: 85,
          reason: '파일명/내용에서 학년 패턴 감지'
        });
        break;
      }
    }

    // 학기 추출
    const semesterPatterns = [
      /(1학기.*중간|1-1)/g,
      /(1학기.*기말|1-2)/g,
      /(2학기.*중간|2-1)/g,
      /(2학기.*기말|2-2)/g
    ];

    const semesterValues = ['1-1', '1-2', '2-1', '2-2'];
    for (let i = 0; i < semesterPatterns.length; i++) {
      const matches = text.match(semesterPatterns[i]);
      if (matches) {
        newSuggestions.push({
          field: 'semester',
          value: semesterValues[i],
          confidence: 80,
          reason: '파일명/내용에서 학기 패턴 감지'
        });
        break;
      }
    }

    // 시험 유형 추출
    const examTypes = ['중간고사', '기말고사', '모의고사', '단원평가', '월말고사'];
    for (const examType of examTypes) {
      if (text.includes(examType)) {
        newSuggestions.push({
          field: 'examType',
          value: examType,
          confidence: 95,
          reason: `'${examType}' 키워드 감지`
        });
        break;
      }
    }

    // 출제년도 추출
    const yearPattern = /(20\d{2})/g;
    const yearMatches = text.match(yearPattern);
    if (yearMatches) {
      const year = parseInt(yearMatches[0]);
      const currentYear = new Date().getFullYear();
      if (year >= 2000 && year <= currentYear) {
        newSuggestions.push({
          field: 'examYear',
          value: year.toString(),
          confidence: 90,
          reason: '파일명/내용에서 연도 패턴 감지'
        });
      }
    }

    // 문항 수 추출 (간단한 패턴 매칭)
    const questionCount = (extractedText.match(/\d+\./g) || []).length;
    if (questionCount > 0) {
      newSuggestions.push({
        field: 'questionCount',
        value: questionCount.toString(),
        confidence: 70,
        reason: `${questionCount}개의 문항 번호 패턴 감지`
      });
    }

    setSuggestions(newSuggestions);
  };

  const applySuggestion = (suggestion: AutoTagSuggestion) => {
    setMetadata(prev => ({
      ...prev,
      [suggestion.field]: suggestion.field === 'examYear' || suggestion.field === 'questionCount' 
        ? parseInt(suggestion.value) 
        : suggestion.value,
      autoTagged: true
    }));

    // 적용된 제안 제거
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  const rejectSuggestion = (suggestion: AutoTagSuggestion) => {
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  const handleAutoTag = async () => {
    if (onAutoTag) {
      onAutoTag();
    }
    
    // 모든 제안 자동 적용 (신뢰도 80% 이상)
    const highConfidenceSuggestions = suggestions.filter(s => s.confidence >= 80);
    highConfidenceSuggestions.forEach(applySuggestion);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && onTagsChange) {
      onTagsChange([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (onTagsChange) {
      onTagsChange(tags.filter(tag => tag !== tagToRemove));
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
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
    <div className="space-y-6">
      {/* 자동 태깅 제안 */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                자동 태깅 제안
              </CardTitle>
              <Button 
                onClick={handleAutoTag}
                disabled={isAutoTagging}
                size="sm"
              >
                {isAutoTagging ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    처리중...
                  </>
                ) : (
                  '모두 적용'
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {suggestion.field === 'schoolName' && '학교명'}
                      {suggestion.field === 'region' && '지역'}
                      {suggestion.field === 'subject' && '과목'}
                      {suggestion.field === 'grade' && '학년'}
                      {suggestion.field === 'semester' && '학기'}
                      {suggestion.field === 'examType' && '시험유형'}
                      {suggestion.field === 'examYear' && '출제년도'}
                      {suggestion.field === 'questionCount' && '문항수'}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.confidence}%
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{suggestion.value}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectSuggestion(suggestion)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 메타데이터 편집 폼 */}
      <Card>
        <CardHeader>
          <CardTitle>메타데이터 편집</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schoolName">학교명</Label>
              <Input
                id="schoolName"
                value={metadata.schoolName || ''}
                onChange={(e) => setMetadata(prev => ({ ...prev, schoolName: e.target.value }))}
                placeholder="예: 서울고등학교"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">지역</Label>
              <Input
                id="region"
                value={metadata.region || ''}
                onChange={(e) => setMetadata(prev => ({ ...prev, region: e.target.value }))}
                placeholder="예: 서울특별시"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">과목 *</Label>
              <Select 
                value={metadata.subject} 
                onValueChange={(value) => setMetadata(prev => ({ ...prev, subject: value as Subject }))}
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
                onValueChange={(value) => setMetadata(prev => ({ ...prev, grade: value }))}
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

            <div className="space-y-2">
              <Label htmlFor="semester">학기</Label>
              <Select 
                value={metadata.semester || ''} 
                onValueChange={(value) => setMetadata(prev => ({ ...prev, semester: value }))}
              >
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

            <div className="space-y-2">
              <Label htmlFor="examYear">출제년도</Label>
              <Input
                id="examYear"
                type="number"
                value={metadata.examYear || ''}
                onChange={(e) => setMetadata(prev => ({ 
                  ...prev, 
                  examYear: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="2024"
                min="2000"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examType">시험 유형</Label>
              <Select 
                value={metadata.examType || ''} 
                onValueChange={(value) => setMetadata(prev => ({ ...prev, examType: value }))}
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
                onValueChange={(value) => setMetadata(prev => ({ ...prev, difficulty: value as Difficulty }))}
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
                onChange={(e) => setMetadata(prev => ({ 
                  ...prev, 
                  questionCount: parseInt(e.target.value) || 0 
                }))}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 태그 관리 */}
      {onTagsChange && (
        <Card>
          <CardHeader>
            <CardTitle>태그</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>태그</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="태그 입력 후 Enter"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  추가
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      #{tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

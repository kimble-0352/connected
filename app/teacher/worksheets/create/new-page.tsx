'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { TreeView, TreeNode } from '@/components/ui/tree-view';
import { 
  ArrowLeft,
  BookOpen,
  Search,
  Settings,
  FileText,
  Users,
  ChevronRight,
  Target,
  Zap
} from 'lucide-react';
import { 
  useCurrentUser
} from '@/app/lib/contexts/AppContext';
import { 
  Subject,
  QuestionType,
  Difficulty
} from '@/app/types';
import { 
  dummyCurriculum,
  dummyQuestions
} from '@/app/lib/data/dummy-data';
import Link from 'next/link';

// 탭 타입 정의
type ContentTab = 'unit' | 'textbook' | 'exam';

// 학년-학기 데이터
const gradeTerms = [
  { id: '1-1', label: '중1-1' },
  { id: '1-2', label: '중1-2' },
  { id: '2-1', label: '중2-1' },
  { id: '2-2', label: '중2-2' },
  { id: '3-1', label: '중3-1' },
  { id: '3-2', label: '중3-2' },
];

// 교재 데이터 (예시)
const textbookData: TreeNode[] = [
  {
    id: 'textbook-1',
    label: '천재교육',
    type: 'folder',
    children: [
      {
        id: 'textbook-1-1',
        label: 'RPM - 중등수학1(상)',
        type: 'folder',
        metadata: { count: 245 },
        children: [
          { id: 'textbook-1-1-1', label: '소인수분해', metadata: { count: 15 } },
          { id: 'textbook-1-1-2', label: '최대공약수와 최소공배수', metadata: { count: 20 } },
        ]
      }
    ]
  },
  {
    id: 'textbook-2',
    label: '비상교육',
    type: 'folder',
    children: [
      {
        id: 'textbook-2-1',
        label: '개념원리 - 중등수학1(상)',
        type: 'folder',
        metadata: { count: 180 },
      }
    ]
  }
];

const NewCreateWorksheetPage = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState<ContentTab>('unit');
  const [selectedGradeTerm, setSelectedGradeTerm] = useState('1-1');
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
  const [questionCount, setQuestionCount] = useState(50);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(['multiple_choice']);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 추가 옵션
  const [includeBasicProblems, setIncludeBasicProblems] = useState(false);
  const [includeReviewProblems, setIncludeReviewProblems] = useState(true);
  const [includeVariationProblems, setIncludeVariationProblems] = useState(false);
  const [autoDistribution, setAutoDistribution] = useState(true);

  // 단원 트리 데이터 생성
  const generateUnitTreeData = (): TreeNode[] => {
    const curriculum = dummyCurriculum.find(c => c.subject === 'math');
    if (!curriculum) return [];

    return curriculum.chapters.map(chapter => ({
      id: chapter.id,
      label: chapter.name,
      type: 'folder' as const,
      metadata: { count: Math.floor(Math.random() * 50) + 10 },
      children: chapter.sections.map(section => ({
        id: section.id,
        label: section.name,
        type: 'folder' as const,
        metadata: { count: Math.floor(Math.random() * 20) + 5 },
        children: section.lessons.map(lesson => ({
          id: lesson.id,
          label: lesson.name,
          metadata: { count: Math.floor(Math.random() * 10) + 2 }
        }))
      }))
    }));
  };

  const [unitTreeData] = useState<TreeNode[]>(generateUnitTreeData());

  // 선택된 문제 수 계산
  const calculateSelectedProblems = () => {
    // 실제로는 선택된 단원들의 문제 수를 계산해야 함
    return Math.min(selectedUnits.size * 15, 500);
  };

  const handleQuestionTypeToggle = (type: QuestionType) => {
    setQuestionTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

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

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/teacher/worksheets">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                목록으로
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">학습지 만들기</h1>
              <p className="text-muted-foreground mt-1">
                원하는 컨텐츠를 선택하여 학습지를 만들어보세요
              </p>
            </div>
          </div>
        </div>

        {/* 메인 레이아웃: 2-컬럼 구조 */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* 좌측: 설정 영역 (70%) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 상단 탭 네비게이션 */}
            <Card className="p-1">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('unit')}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'unit'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  단원·유형별
                </button>
                <button
                  onClick={() => setActiveTab('textbook')}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'textbook'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  시중교재
                </button>
                <button
                  onClick={() => setActiveTab('exam')}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'exam'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  수능/모의고사
                </button>
              </div>
            </Card>

            {/* 탭 컨텐츠 */}
            {activeTab === 'unit' && (
              <div className="space-y-6">
                {/* 학년-학기 선택 */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">1</span>
                      </div>
                      학년·학기 선택
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {gradeTerms.map(term => (
                        <button
                          key={term.id}
                          onClick={() => setSelectedGradeTerm(term.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedGradeTerm === term.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {term.label}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 단원 선택 */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">2</span>
                      </div>
                      단원 선택
                    </CardTitle>
                    <CardDescription>
                      학습지에 포함할 단원을 선택하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <TreeView
                        data={unitTreeData}
                        selectedIds={selectedUnits}
                        onSelectionChange={setSelectedUnits}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'textbook' && (
              <div className="space-y-6">
                {/* 검색 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="교재명으로 검색해보세요"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 교재 선택 */}
                <Card>
                  <CardHeader>
                    <CardTitle>교재 선택</CardTitle>
                    <CardDescription>
                      사용할 교재를 선택하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <TreeView
                        data={textbookData}
                        selectedIds={selectedUnits}
                        onSelectionChange={setSelectedUnits}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'exam' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>수능/모의고사</CardTitle>
                    <CardDescription>
                      수능 및 모의고사 문제를 선택하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">
                      수능/모의고사 컨텐츠는 준비 중입니다.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* 우측: 요약 패널 (30%) */}
          <div className="lg:col-span-3">
            <Card className="sticky top-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Target className="h-3 w-3 text-white" />
                  </div>
                  학습지 구성
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 문제 수 설정 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">문제 수</Label>
                    <span className="text-lg font-bold text-blue-600">{questionCount}</span>
                  </div>
                  <Slider
                    value={[questionCount]}
                    onValueChange={([value]) => setQuestionCount(value)}
                    max={150}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10</span>
                    <span>150</span>
                  </div>
                </div>

                {/* 대상 문제 수 */}
                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">대상 문제의 생동이 문제</span>
                    <span className="font-semibold">{calculateSelectedProblems()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">유사문제</span>
                    <span className="font-semibold">{Math.floor(calculateSelectedProblems() * 0.3)}</span>
                  </div>
                </div>

                {/* 문제 타입 */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">문제 타입</Label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQuestionTypes(['multiple_choice', 'short_answer'])}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        questionTypes.length === 2
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      전체
                    </button>
                    <button
                      onClick={() => handleQuestionTypeToggle('multiple_choice')}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        questionTypes.includes('multiple_choice')
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      객관식
                    </button>
                    <button
                      onClick={() => handleQuestionTypeToggle('short_answer')}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        questionTypes.includes('short_answer')
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      주관식
                    </button>
                  </div>
                </div>

                {/* 추가 옵션 */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">추가 옵션</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={includeBasicProblems}
                        onCheckedChange={(checked) => setIncludeBasicProblems(checked === true)}
                      />
                      <span className="text-sm">기초 출제 문제 제외</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={includeReviewProblems}
                        onCheckedChange={(checked) => setIncludeReviewProblems(checked === true)}
                      />
                      <span className="text-sm">교육 과정 외 문제 제외</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={includeVariationProblems}
                        onCheckedChange={(checked) => setIncludeVariationProblems(checked === true)}
                      />
                      <span className="text-sm">유형별 최대 문제 수 제한</span>
                      <span className="text-xs text-gray-500 ml-auto">3개</span>
                    </label>
                  </div>
                </div>

                {/* 하단 정보 */}
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      학습지 문제 수 {questionCount}개
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      유형 {selectedUnits.size}개
                    </p>
                  </div>
                </div>

                {/* 다음 단계 버튼 */}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                  disabled={selectedUnits.size === 0}
                  onClick={() => router.push('/teacher/worksheets/create/step2')}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    다음 단계
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewCreateWorksheetPage;

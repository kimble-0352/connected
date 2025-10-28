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
type ContentTab = 'unit' | 'exam';

// 학년-학기 데이터
const gradeTerms = [
  { id: '1-1', label: '중1-1' },
  { id: '1-2', label: '중1-2' },
  { id: '2-1', label: '중2-1' },
  { id: '2-2', label: '중2-2' },
  { id: '3-1', label: '중3-1' },
  { id: '3-2', label: '중3-2' },
];


const CreateWorksheetPage = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState<ContentTab>('unit');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('math');
  const [selectedGradeTerm, setSelectedGradeTerm] = useState('1-1');
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
  const [questionCount, setQuestionCount] = useState(50);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(['multiple_choice']);
  
  // 난이도 설정
  const [difficultyMode, setDifficultyMode] = useState<'single' | 'mixed'>('single');
  const [singleDifficulty, setSingleDifficulty] = useState<Difficulty>('medium');
  const [difficultyRatios, setDifficultyRatios] = useState({
    highest: 10,
    high: 30,
    medium: 40,
    low: 20
  });
  
  // 추가 옵션
  const [equalDistribution, setEqualDistribution] = useState(false);
  const [limitQuestionTypes, setLimitQuestionTypes] = useState(false);
  const [maxQuestionsPerType, setMaxQuestionsPerType] = useState(3);

  // 과목별 단원 트리 데이터 생성
  const generateUnitTreeData = (subject: Subject): TreeNode[] => {
    const curriculum = dummyCurriculum.find(c => c.subject === subject);
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

  // 과목별 기출문제 데이터
  const getExamDataBySubject = (subject: Subject): TreeNode[] => {
    switch (subject) {
      case 'math':
        return [
          {
            id: 'exam-math-1',
            label: '수능 기출',
            type: 'folder',
            children: [
              {
                id: 'exam-math-1-1',
                label: '2024년 수능',
                type: 'folder',
                metadata: { count: 30 },
                children: [
                  { id: 'exam-math-1-1-1', label: '확률과 통계', metadata: { count: 8 } },
                  { id: 'exam-math-1-1-2', label: '미적분', metadata: { count: 12 } },
                  { id: 'exam-math-1-1-3', label: '기하', metadata: { count: 10 } },
                ]
              },
              {
                id: 'exam-math-1-2',
                label: '2023년 수능',
                type: 'folder',
                metadata: { count: 30 },
              }
            ]
          },
          {
            id: 'exam-math-2',
            label: '모의고사',
            type: 'folder',
            children: [
              {
                id: 'exam-math-2-1',
                label: '2024년 6월 모의고사',
                type: 'folder',
                metadata: { count: 30 },
              },
              {
                id: 'exam-math-2-2',
                label: '2024년 9월 모의고사',
                type: 'folder',
                metadata: { count: 30 },
              }
            ]
          }
        ];
      case 'english':
        return [
          {
            id: 'exam-eng-1',
            label: '수능 기출',
            type: 'folder',
            children: [
              {
                id: 'exam-eng-1-1',
                label: '2024년 수능',
                type: 'folder',
                metadata: { count: 45 },
                children: [
                  { id: 'exam-eng-1-1-1', label: '듣기', metadata: { count: 17 } },
                  { id: 'exam-eng-1-1-2', label: '독해', metadata: { count: 28 } },
                ]
              },
              {
                id: 'exam-eng-1-2',
                label: '2023년 수능',
                type: 'folder',
                metadata: { count: 45 },
              }
            ]
          },
          {
            id: 'exam-eng-2',
            label: '모의고사',
            type: 'folder',
            children: [
              {
                id: 'exam-eng-2-1',
                label: '2024년 6월 모의고사',
                type: 'folder',
                metadata: { count: 45 },
                children: [
                  { id: 'exam-eng-2-1-1', label: '빈칸추론', metadata: { count: 8 } },
                  { id: 'exam-eng-2-1-2', label: '순서배열', metadata: { count: 6 } },
                  { id: 'exam-eng-2-1-3', label: '문장삽입', metadata: { count: 5 } },
                ]
              },
              {
                id: 'exam-eng-2-2',
                label: '2024년 9월 모의고사',
                type: 'folder',
                metadata: { count: 45 },
              }
            ]
          }
        ];
      case 'korean':
        return [
          {
            id: 'exam-kor-1',
            label: '수능 기출',
            type: 'folder',
            children: [
              {
                id: 'exam-kor-1-1',
                label: '2024년 수능',
                type: 'folder',
                metadata: { count: 45 },
                children: [
                  { id: 'exam-kor-1-1-1', label: '화법과 작문', metadata: { count: 15 } },
                  { id: 'exam-kor-1-1-2', label: '언어와 매체', metadata: { count: 15 } },
                  { id: 'exam-kor-1-1-3', label: '문학', metadata: { count: 15 } },
                ]
              },
              {
                id: 'exam-kor-1-2',
                label: '2023년 수능',
                type: 'folder',
                metadata: { count: 45 },
              }
            ]
          },
          {
            id: 'exam-kor-2',
            label: '모의고사',
            type: 'folder',
            children: [
              {
                id: 'exam-kor-2-1',
                label: '2024년 6월 모의고사',
                type: 'folder',
                metadata: { count: 45 },
                children: [
                  { id: 'exam-kor-2-1-1', label: '현대시', metadata: { count: 8 } },
                  { id: 'exam-kor-2-1-2', label: '고전시가', metadata: { count: 6 } },
                  { id: 'exam-kor-2-1-3', label: '현대소설', metadata: { count: 8 } },
                  { id: 'exam-kor-2-1-4', label: '고전소설', metadata: { count: 6 } },
                ]
              },
              {
                id: 'exam-kor-2-2',
                label: '2024년 9월 모의고사',
                type: 'folder',
                metadata: { count: 45 },
              }
            ]
          }
        ];
      default:
        return [];
    }
  };

  const [unitTreeData, setUnitTreeData] = useState<TreeNode[]>(generateUnitTreeData(selectedSubject));
  const [examTreeData, setExamTreeData] = useState<TreeNode[]>(getExamDataBySubject(selectedSubject));

  // 과목 변경 시 트리 데이터 업데이트
  useEffect(() => {
    setUnitTreeData(generateUnitTreeData(selectedSubject));
    setExamTreeData(getExamDataBySubject(selectedSubject));
    setSelectedUnits(new Set()); // 선택 초기화
  }, [selectedSubject]);

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

  // 문제 수 프리셋 설정
  const questionPresets = [10, 20, 30, 40, 50];
  
  const handleQuestionCountPreset = (count: number) => {
    setQuestionCount(count);
  };

  // 난이도 비율 조정
  const handleDifficultyRatioChange = (difficulty: keyof typeof difficultyRatios, value: number) => {
    setDifficultyRatios(prev => ({
      ...prev,
      [difficulty]: value
    }));
  };

  // 난이도 비율 총합 계산
  const totalDifficultyRatio = Object.values(difficultyRatios).reduce((sum, value) => sum + value, 0);


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
            {/* 과목 선택 - 최상단으로 이동 */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  과목 선택
                </CardTitle>
                <CardDescription>
                  학습지를 만들 과목을 선택하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'math', label: '수학', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                    { id: 'english', label: '영어', color: 'bg-green-100 text-green-700 border-green-200' },
                    { id: 'korean', label: '국어', color: 'bg-purple-100 text-purple-700 border-purple-200' }
                  ].map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject.id as Subject)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                        selectedSubject === subject.id
                          ? subject.color + ' shadow-md'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {subject.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 탭 네비게이션 - 카드 스타일로 변경 */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  컨텐츠 유형 선택
                </CardTitle>
                <CardDescription>
                  학습지에 포함할 컨텐츠 유형을 선택하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTab('unit')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'unit'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    단원·유형별
                  </button>
                  <button
                    onClick={() => setActiveTab('exam')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'exam'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    기출
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* 탭 컨텐츠 */}
            {activeTab === 'unit' && (
              <div className="space-y-6">
                {/* 학년-학기 선택 */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">3</span>
                      </div>
                      학년·학기 선택
                    </CardTitle>
                    <CardDescription>
                      {selectedSubject === 'math' && '수학'}
                      {selectedSubject === 'english' && '영어'}
                      {selectedSubject === 'korean' && '국어'} 학습지의 학년과 학기를 선택하세요
                    </CardDescription>
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
                        <span className="text-blue-600 text-sm font-bold">4</span>
                      </div>
                      단원 선택
                    </CardTitle>
                    <CardDescription>
                      {selectedSubject === 'math' && '수학'}
                      {selectedSubject === 'english' && '영어'}
                      {selectedSubject === 'korean' && '국어'} {selectedGradeTerm} 학습지에 포함할 단원을 선택하세요
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

            {activeTab === 'exam' && (
              <div className="space-y-6">
                {/* 기출문제 선택 */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">3</span>
                      </div>
                      기출문제 선택
                    </CardTitle>
                    <CardDescription>
                      {selectedSubject === 'math' && '수학'}
                      {selectedSubject === 'english' && '영어'}
                      {selectedSubject === 'korean' && '국어'} 수능 및 모의고사 기출문제를 선택하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <TreeView
                        data={examTreeData}
                        selectedIds={selectedUnits}
                        onSelectionChange={setSelectedUnits}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* 우측: 요약 패널 (30%) */}
          <div className="lg:col-span-3">
            <Card className="sticky top-6">
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">문제 수 (최대 150문제)</Label>
                    <span className="text-lg font-bold text-blue-600">{questionCount}문제</span>
                  </div>
                  
                  {/* 프리셋 버튼 */}
                  <div className="flex flex-wrap gap-2">
                    {questionPresets.map(preset => (
                      <button
                        key={preset}
                        onClick={() => handleQuestionCountPreset(preset)}
                        className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                          questionCount === preset
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  
                  {/* 직접 입력 */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Math.min(150, Math.max(1, parseInt(e.target.value) || 1)))}
                      min={1}
                      max={150}
                      className="w-20 h-8 text-sm"
                    />
                    <span className="text-sm text-gray-500">직접 입력</span>
                  </div>
                  
                  <Slider
                    value={[questionCount]}
                    onValueChange={([value]) => setQuestionCount(value)}
                    max={150}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>150</span>
                  </div>
                </div>

                {/* 난이도 설정 */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">난이도</Label>
                  
                  {/* 난이도 모드 선택 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDifficultyMode('single')}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        difficultyMode === 'single'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      단일 난이도
                    </button>
                    <button
                      onClick={() => setDifficultyMode('mixed')}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        difficultyMode === 'mixed'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      복합 난이도
                    </button>
                  </div>

                  {/* 단일 난이도 설정 */}
                  {difficultyMode === 'single' && (
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'highest', label: '최상', color: 'bg-red-100 text-red-700' },
                        { id: 'high', label: '상', color: 'bg-orange-100 text-orange-700' },
                        { id: 'medium', label: '중', color: 'bg-yellow-100 text-yellow-700' },
                        { id: 'low', label: '하', color: 'bg-green-100 text-green-700' }
                      ].map(difficulty => (
                        <button
                          key={difficulty.id}
                          onClick={() => setSingleDifficulty(difficulty.id as Difficulty)}
                          className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                            singleDifficulty === difficulty.id
                              ? difficulty.color + ' border-2 border-current'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {difficulty.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 복합 난이도 설정 */}
                  {difficultyMode === 'mixed' && (
                    <div className="space-y-3">
                      <div className="text-xs text-gray-500 mb-2">
                        난이도 비율 조정 (총 {totalDifficultyRatio}%)
                      </div>
                      {[
                        { key: 'highest', label: '최상', color: 'text-red-600' },
                        { key: 'high', label: '상', color: 'text-orange-600' },
                        { key: 'medium', label: '중', color: 'text-yellow-600' },
                        { key: 'low', label: '하', color: 'text-green-600' }
                      ].map(({ key, label, color }) => (
                        <div key={key} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium ${color}`}>{label}</span>
                            <span className="text-xs text-gray-500">{difficultyRatios[key as keyof typeof difficultyRatios]}%</span>
                          </div>
                          <Slider
                            value={[difficultyRatios[key as keyof typeof difficultyRatios]]}
                            onValueChange={([value]) => handleDifficultyRatioChange(key as keyof typeof difficultyRatios, value)}
                            max={100}
                            min={0}
                            step={5}
                            className="w-full h-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 문제 유형 */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">문제 유형</Label>
                  <div className="space-y-2">
                    {[
                      { id: 'multiple_choice', label: '객관식' },
                      { id: 'short_answer', label: '단답형' },
                      { id: 'essay', label: '서술형' }
                    ].map(type => (
                      <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={questionTypes.includes(type.id as QuestionType)}
                          onCheckedChange={() => handleQuestionTypeToggle(type.id as QuestionType)}
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 추가 옵션 */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">추가 옵션</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={equalDistribution}
                        onCheckedChange={(checked) => setEqualDistribution(checked as boolean)}
                      />
                      <span className="text-sm">문제 수 균등 배분</span>
                    </label>
                    <div className="text-xs text-gray-500 ml-6 -mt-1">
                      단원별 문제수가 균등 배분됩니다
                    </div>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={limitQuestionTypes}
                        onCheckedChange={(checked) => setLimitQuestionTypes(checked as boolean)}
                      />
                      <span className="text-sm">유형별 최대 문제수 제한</span>
                    </label>
                    
                    {limitQuestionTypes && (
                      <div className="ml-6 flex items-center gap-2">
                        <span className="text-xs text-gray-500">최대</span>
                        <Input
                          type="number"
                          value={maxQuestionsPerType}
                          onChange={(e) => setMaxQuestionsPerType(Math.max(1, parseInt(e.target.value) || 1))}
                          min={1}
                          className="w-16 h-6 text-xs"
                        />
                        <span className="text-xs text-gray-500">문제</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 하단 정보 */}
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      학습지 문제 수 {questionCount}개
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      선택된 유형 {selectedUnits.size}개
                    </p>
                    {difficultyMode === 'single' && (
                      <p className="text-xs text-gray-500 mt-1">
                        난이도: {singleDifficulty === 'highest' ? '최상' : 
                                singleDifficulty === 'high' ? '상' :
                                singleDifficulty === 'medium' ? '중' : '하'}
                      </p>
                    )}
                  </div>
                </div>

                {/* 다음 단계 버튼 */}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                  disabled={selectedUnits.size === 0}
                  onClick={() => {
                    // 1단계 데이터를 세션 스토리지에 저장
                    console.log('Step1 - 선택된 단원들:', Array.from(selectedUnits));
                    console.log('Step1 - 선택된 과목:', selectedSubject);
                    console.log('Step1 - 활성 탭:', activeTab);
                    
                    const step1Data = {
                      subject: selectedSubject,
                      questionCount: questionCount,
                      difficulty: difficultyMode === 'single' 
                        ? { type: 'single' as const, single: singleDifficulty }
                        : { type: 'mixed' as const, mixed: difficultyRatios },
                      questionTypes: questionTypes,
                      curriculum: Array.from(selectedUnits).map(unitId => {
                        // unitId를 기반으로 올바른 커리큘럼 구조 생성
                        // unitId 형태에 따라 적절한 매핑
                        console.log('Step1 - unitId:', unitId);
                        
                        // 새로운 구조에 맞게 매핑
                        // 예: "chapter-2-1" -> {chapterId: "chapter-2-1", sectionId: "section-2-1-1", lessonId: "lesson-2-1-1-1"}
                        if (unitId.includes('chapter-')) {
                          return {
                            chapterId: unitId,
                            sectionId: unitId.replace('chapter-', 'section-') + '-1',
                            lessonId: unitId.replace('chapter-', 'lesson-') + '-1-1'
                          };
                        }
                        
                        // 기본 매핑 (기존 방식)
                        return {
                          chapterId: unitId,
                          sectionId: `section-${unitId}`,
                          lessonId: `lesson-${unitId}`
                        };
                      }),
                      sources: activeTab === 'unit' ? ['internal'] : ['school_exam'],
                      options: {
                        evenDistribution: equalDistribution,
                        limitQuestionTypes: limitQuestionTypes,
                        maxQuestionsPerType: maxQuestionsPerType,
                        prioritizeHighDifficulty: false
                      }
                    };
                    
                    console.log('Step1 - 저장할 데이터:', step1Data);
                    sessionStorage.setItem('worksheetCreationStep1', JSON.stringify(step1Data));
                    console.log('Step1 - 세션스토리지에 저장 완료');
                    router.push('/teacher/worksheets/create/step2');
                  }}
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

export default CreateWorksheetPage;
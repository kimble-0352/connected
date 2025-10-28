'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/contexts/AppContext';
import { useFavorites } from '@/app/lib/contexts/FavoritesContext';
import { dummyQuestions } from '@/app/lib/data/dummy-data';
import { 
  WorksheetCreationStep1, 
  WorksheetCreationStep2, 
  Question, 
  Difficulty, 
  QuestionSource 
} from '@/app/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Target,
  Clock,
  TrendingUp,
  CheckCircle,
  Plus,
  Minus,
  Eye,
  Search,
  Filter,
  GripVertical,
  X,
  RefreshCw,
  Lightbulb,
  Zap,
  Heart,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function CreateWorksheetStep2Page() {
  const router = useRouter();
  const { state } = useAppContext();
  const currentUser = state.currentUser;
  const { addFavorite, removeFavorite, isFavorite, state: favoritesState } = useFavorites();
  
  const [step1Data, setStep1Data] = useState<WorksheetCreationStep1 | null>(null);
  const [formData, setFormData] = useState<WorksheetCreationStep2>({
    selectedQuestions: [],
    summary: {
      totalQuestions: 0,
      averageCorrectRate: 0,
      difficultyDistribution: {
        low: 0,
        medium: 0,
        high: 0,
        highest: 0
      },
      sourceDistribution: {
        internal: 0,
        textbook: 0,
        school_exam: 0
      }
    }
  });

  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  
  // 문제 추가 관련 상태
  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [recommendedQuestions, setRecommendedQuestions] = useState<Question[]>([]);
  const [addMode, setAddMode] = useState<'search' | 'recommend' | 'favorites'>('search');
  
  // 드래그 앤 드롭 관련 상태
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // 유사 문제 교체 관련 상태
  const [showSimilarDialog, setShowSimilarDialog] = useState(false);
  const [currentQuestionForSimilar, setCurrentQuestionForSimilar] = useState<Question | null>(null);
  const [similarQuestions, setSimilarQuestions] = useState<Question[]>([]);

  // 중복 로그 방지를 위한 ref
  const lastLoggedFilterCount = useRef<number>(-1);

  // 1단계 데이터 로드
  useEffect(() => {
    const savedData = sessionStorage.getItem('worksheetCreationStep1');
    
    if (savedData) {
      const step1: WorksheetCreationStep1 = JSON.parse(savedData);
      setStep1Data(step1);
    } else {
      router.push('/teacher/worksheets/create');
    }
  }, [router]);

  // 필터링된 문제들 - useMemo로 최적화 (완화된 필터링 조건)
  const filteredQuestions = useMemo(() => {
    if (!step1Data) return [];
    
    const filtered = dummyQuestions.filter(q => {
      // 1. 과목 필터 (필수)
      if (q.subject !== step1Data.subject) {
        return false;
      }
      
      // 2. 출처 필터 (완화) - 출처가 없거나 매칭되면 포함
      if (step1Data.sources.length > 0 && !step1Data.sources.includes(q.source)) {
        return false;
      }
      
      // 3. 커리큘럼 필터 완화 - 선택된 단원이 없으면 모든 문제 포함
      if (step1Data.curriculum.length === 0) {
        return true;
      }
      
      // 4. 완화된 커리큘럼 매칭 로직
      return step1Data.curriculum.some(curr => {
        // 정확한 매칭
        if (q.curriculum.chapterId === curr.chapterId &&
            q.curriculum.sectionId === curr.sectionId &&
            q.curriculum.lessonId === curr.lessonId) {
          return true;
        }
        
        // chapterId 기반 매칭 (가장 중요)
        if (q.curriculum.chapterId === curr.chapterId) {
          return true;
        }
        
        // 부분 문자열 매칭 (완화)
        if (q.curriculum.chapterId.includes(curr.chapterId) ||
            curr.chapterId.includes(q.curriculum.chapterId)) {
          return true;
        }
        
        // sectionId 기반 매칭 (추가)
        if (q.curriculum.sectionId === curr.sectionId) {
          return true;
        }
        
        // 매우 완화된 매칭 - 같은 과목이면 포함 (최후 수단)
        return true;
      });
    });
    
    // 필터링된 문제가 부족한 경우 추가 문제 포함
    if (filtered.length < step1Data.questionCount) {
      const additionalQuestions = dummyQuestions.filter(q => {
        // 기본 조건만 확인 (과목만 일치)
        return q.subject === step1Data.subject && 
               !filtered.some(f => f.id === q.id); // 중복 제거
      });
      
      // 부족한 만큼 추가
      const needed = step1Data.questionCount - filtered.length;
      filtered.push(...additionalQuestions.slice(0, needed));
    }
    
    // 로그 출력
    if (filtered.length > 0 && lastLoggedFilterCount.current !== filtered.length) {
      console.log(`Step2 - 필터링 완료: ${filtered.length}/${dummyQuestions.length}개 문제 선택됨`);
      console.log(`Step2 - 목표 문제수: ${step1Data.questionCount}개, 사용가능: ${filtered.length}개`);
      lastLoggedFilterCount.current = filtered.length;
    }
    return filtered;
  }, [step1Data?.subject, step1Data?.sources, step1Data?.curriculum, step1Data?.questionCount]);

  // 필터링된 문제가 변경될 때 자동 선택 실행
  useEffect(() => {
    if (step1Data && filteredQuestions.length > 0) {
      setAvailableQuestions(filteredQuestions);
      autoSelectQuestions(step1Data, filteredQuestions);
    }
  }, [step1Data, filteredQuestions]);

  // 개선된 자동 문제 선택 로직
  const autoSelectQuestions = (step1: WorksheetCreationStep1, questions: Question[]) => {
    let selected: Question[] = [];
    
    if (step1.difficulty.type === 'single') {
      // 단일 난이도
      const filteredByDifficulty = questions.filter(q => q.difficulty === step1.difficulty.single);
      selected = shuffleArray(filteredByDifficulty).slice(0, step1.questionCount);
      
      // 부족한 경우 다른 난이도에서 보충
      if (selected.length < step1.questionCount) {
        const remaining = questions.filter(q => 
          q.difficulty !== step1.difficulty.single && 
          !selected.some(s => s.id === q.id)
        );
        const needed = step1.questionCount - selected.length;
        selected.push(...shuffleArray(remaining).slice(0, needed));
      }
    } else {
      // 혼합 난이도
      const difficultyOrder: Difficulty[] = step1.options.prioritizeHighDifficulty 
        ? ['highest', 'high', 'medium', 'low']
        : ['low', 'medium', 'high', 'highest'];
      
      for (const difficulty of difficultyOrder) {
        const needed = Math.round((step1.difficulty.mixed![difficulty] / 100) * step1.questionCount);
        if (needed > 0) {
          const availableForDifficulty = questions.filter(q => 
            q.difficulty === difficulty && !selected.some(s => s.id === q.id)
          );
          
          const selectedForDifficulty = shuffleArray(availableForDifficulty).slice(0, needed);
          selected.push(...selectedForDifficulty);
        }
      }
      
      // 목표 문제 수에 맞지 않는 경우 조정
      if (selected.length < step1.questionCount) {
        const remaining = questions.filter(q => !selected.some(s => s.id === q.id));
        const needed = step1.questionCount - selected.length;
        selected.push(...shuffleArray(remaining).slice(0, needed));
      } else if (selected.length > step1.questionCount) {
        selected = selected.slice(0, step1.questionCount);
      }
    }
    
    // 균등 분배 옵션이 활성화된 경우 단원별로 고르게 분배
    if (step1.options.evenDistribution && step1.curriculum.length > 1) {
      selected = distributeEvenly(selected, step1);
    }
    
    // 최종적으로 정확한 문제 수 보장
    if (selected.length < step1.questionCount && questions.length >= step1.questionCount) {
      const remaining = questions.filter(q => !selected.some(s => s.id === q.id));
      const needed = step1.questionCount - selected.length;
      selected.push(...shuffleArray(remaining).slice(0, needed));
    }
    
    console.log(`Step2 - 자동선택 완료: ${selected.length}/${step1.questionCount}개 문제 선택됨`);
    
    setFormData(prev => ({
      ...prev,
      selectedQuestions: selected,
      summary: calculateSummary(selected)
    }));
    
    setSelectedQuestionIds(new Set(selected.map(q => q.id)));
  };

  // 배열 셔플 함수
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 균등 분배 함수
  const distributeEvenly = (questions: Question[], step1: WorksheetCreationStep1): Question[] => {
    const questionsByCurriculum = new Map<string, Question[]>();
    
    // 커리큘럼별로 문제 그룹화
    step1.curriculum.forEach(curr => {
      const key = `${curr.chapterId}-${curr.sectionId}-${curr.lessonId}`;
      questionsByCurriculum.set(key, []);
    });
    
    questions.forEach(q => {
      const key = `${q.curriculum.chapterId}-${q.curriculum.sectionId}-${q.curriculum.lessonId}`;
      const group = questionsByCurriculum.get(key);
      if (group) {
        group.push(q);
      }
    });
    
    // 각 커리큘럼에서 고르게 선택
    const distributed: Question[] = [];
    const questionsPerCurriculum = Math.floor(step1.questionCount / step1.curriculum.length);
    const remainder = step1.questionCount % step1.curriculum.length;
    
    let curriculumIndex = 0;
    for (const [key, curriculumQuestions] of questionsByCurriculum) {
      const count = questionsPerCurriculum + (curriculumIndex < remainder ? 1 : 0);
      distributed.push(...curriculumQuestions.slice(0, count));
      curriculumIndex++;
    }
    
    return distributed;
  };

  // 요약 정보 계산
  const calculateSummary = (questions: Question[]): WorksheetCreationStep2['summary'] => {
    const totalQuestions = questions.length;
    const averageCorrectRate = totalQuestions > 0 
      ? questions.reduce((sum, q) => sum + q.correctRate, 0) / totalQuestions 
      : 0;
    
    const difficultyDistribution = {
      low: questions.filter(q => q.difficulty === 'low').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      high: questions.filter(q => q.difficulty === 'high').length,
      highest: questions.filter(q => q.difficulty === 'highest').length,
    };
    
    const sourceDistribution = {
      internal: questions.filter(q => q.source === 'internal').length,
      textbook: questions.filter(q => q.source === 'textbook').length,
      school_exam: questions.filter(q => q.source === 'school_exam').length,
    };
    
    return {
      totalQuestions,
      averageCorrectRate: Math.round(averageCorrectRate),
      difficultyDistribution,
      sourceDistribution
    };
  };

  // 문제 선택/해제
  const toggleQuestion = (question: Question) => {
    const newSelected = selectedQuestionIds.has(question.id)
      ? formData.selectedQuestions.filter(q => q.id !== question.id)
      : [...formData.selectedQuestions, question];
    
    setFormData(prev => ({
      ...prev,
      selectedQuestions: newSelected,
      summary: calculateSummary(newSelected)
    }));
    
    const newSelectedIds = new Set(newSelected.map(q => q.id));
    setSelectedQuestionIds(newSelectedIds);
  };


  // 문제 검색 기능
  const searchQuestions = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = dummyQuestions.filter(q => {
      // 기본 조건 (과목, 출처 등)
      if (!step1Data) return false;
      if (q.subject !== step1Data.subject) return false;
      if (!step1Data.sources.includes(q.source)) return false;
      
      // 이미 선택된 문제는 제외
      if (selectedQuestionIds.has(q.id)) return false;
      
      // 검색어 매칭
      return q.content.toLowerCase().includes(query.toLowerCase()) ||
             q.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    }).slice(0, 20); // 최대 20개
    
    setSearchResults(results);
  };

  // 추천 문제 생성
  const generateRecommendedQuestions = () => {
    if (!step1Data) return;
    
    // 현재 선택된 문제들의 정답률 분석
    const selectedQuestions = formData.selectedQuestions;
    const avgCorrectRate = selectedQuestions.length > 0 
      ? selectedQuestions.reduce((sum, q) => sum + q.correctRate, 0) / selectedQuestions.length 
      : 70;
    
    // 추천 조건: 정답률이 낮거나 최근 오답이 많은 문항
    const recommended = dummyQuestions.filter(q => {
      if (!step1Data) return false;
      if (q.subject !== step1Data.subject) return false;
      if (!step1Data.sources.includes(q.source)) return false;
      if (selectedQuestionIds.has(q.id)) return false;
      
      // 커리큘럼 매칭
      const matchesCurriculum = step1Data.curriculum.some(curr => {
        return q.curriculum.chapterId === curr.chapterId &&
               q.curriculum.sectionId === curr.sectionId &&
               q.curriculum.lessonId === curr.lessonId;
      });
      
      if (!matchesCurriculum) return false;
      
      // 정답률이 평균보다 낮은 문제들 우선
      return q.correctRate < avgCorrectRate - 10;
    }).slice(0, 15);
    
    setRecommendedQuestions(recommended);
  };

  // 문제 순서 변경 (드래그 앤 드롭)
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    
    const newQuestions = [...formData.selectedQuestions];
    const draggedQuestion = newQuestions[draggedIndex];
    
    // 드래그된 문제 제거
    newQuestions.splice(draggedIndex, 1);
    
    // 새 위치에 삽입
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newQuestions.splice(insertIndex, 0, draggedQuestion);
    
    setFormData(prev => ({
      ...prev,
      selectedQuestions: newQuestions,
      summary: calculateSummary(newQuestions)
    }));
    
    setDraggedIndex(null);
  };

  // 문제 제거
  const removeQuestion = (questionId: string) => {
    const newSelected = formData.selectedQuestions.filter(q => q.id !== questionId);
    
    setFormData(prev => ({
      ...prev,
      selectedQuestions: newSelected,
      summary: calculateSummary(newSelected)
    }));
    
    const newSelectedIds = new Set(newSelected.map(q => q.id));
    setSelectedQuestionIds(newSelectedIds);
  };

  // 문제 추가
  const addQuestion = (question: Question) => {
    if (selectedQuestionIds.has(question.id)) return;
    
    const newSelected = [...formData.selectedQuestions, question];
    
    setFormData(prev => ({
      ...prev,
      selectedQuestions: newSelected,
      summary: calculateSummary(newSelected)
    }));
    
    const newSelectedIds = new Set(newSelected.map(q => q.id));
    setSelectedQuestionIds(newSelectedIds);
  };

  // 유사 문제 로드
  const loadSimilarQuestions = (question: Question) => {
    // 유사 문제 찾기 로직
    const similar = dummyQuestions.filter(q => {
      if (q.id === question.id) return false;
      if (q.subject !== question.subject) return false;
      if (selectedQuestionIds.has(q.id)) return false;
      
      // 같은 난이도 또는 인접 난이도
      const difficultyOrder = ['low', 'medium', 'high', 'highest'];
      const currentIndex = difficultyOrder.indexOf(question.difficulty);
      const similarDifficulties = [
        difficultyOrder[currentIndex - 1],
        difficultyOrder[currentIndex],
        difficultyOrder[currentIndex + 1]
      ].filter(Boolean);
      
      if (!similarDifficulties.includes(q.difficulty)) return false;
      
      // 같은 커리큘럼 또는 유사한 태그
      const sameChapter = q.curriculum.chapterId === question.curriculum.chapterId;
      const similarTags = q.tags.some(tag => question.tags.includes(tag));
      
      return sameChapter || similarTags;
    }).slice(0, 10);
    
    setSimilarQuestions(similar);
  };

  // 문제 교체
  const replaceQuestion = (oldQuestion: Question, newQuestion: Question) => {
    const newSelected = formData.selectedQuestions.map(q => 
      q.id === oldQuestion.id ? newQuestion : q
    );
    
    setFormData(prev => ({
      ...prev,
      selectedQuestions: newSelected,
      summary: calculateSummary(newSelected)
    }));
    
    const newSelectedIds = new Set(newSelected.map(q => q.id));
    setSelectedQuestionIds(newSelectedIds);
    
    setShowSimilarDialog(false);
    setCurrentQuestionForSimilar(null);
  };

  // 즐겨찾기 토글
  const toggleFavorite = (question: Question) => {
    if (isFavorite(question.id)) {
      removeFavorite(question.id);
    } else {
      addFavorite(question);
    }
  };

  // 다음 단계로
  const handleNext = () => {
    if (formData.selectedQuestions.length === 0) {
      alert('최소 1개 이상의 문제를 선택해주세요.');
      return;
    }
    
    sessionStorage.setItem('worksheetCreationStep2', JSON.stringify(formData));
    router.push('/teacher/worksheets/create/step3');
  };

  // 이전 단계로
  const handlePrevious = () => {
    router.push('/teacher/worksheets/create');
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'highest': return 'bg-red-100 text-red-800';
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'low': return '하';
      case 'medium': return '중';
      case 'high': return '상';
      case 'highest': return '최상';
    }
  };

  const getSourceLabel = (source: QuestionSource) => {
    switch (source) {
      case 'internal': return '자체제작';
      case 'textbook': return '교재';
      case 'school_exam': return '학교시험';
    }
  };

  const getSubjectLabel = (subject: string) => {
    switch (subject) {
      case 'math': return '수학';
      case 'english': return '영어';
      case 'korean': return '국어';
      default: return subject;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice': return '객관식';
      case 'short_answer': return '단답형';
      case 'essay': return '서술형';
      default: return type;
    }
  };

  if (!step1Data) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/teacher/worksheets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">새 학습지 만들기</h1>
            <p className="text-gray-600 mt-1">2단계: 문제 선택 및 확인</p>
          </div>
        </div>
      </div>

      {/* 진행 단계 */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="ml-2 text-sm font-medium text-green-600">기본 설정</span>
        </div>
        <div className="w-16 h-0.5 bg-blue-600"></div>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
            2
          </div>
          <span className="ml-2 text-sm font-medium text-blue-600">문제 선택</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-300"></div>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-500 rounded-full text-sm font-semibold">
            3
          </div>
          <span className="ml-2 text-sm text-gray-500">최종 설정</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 메인 영역 - 문제 목록 */}
        <div className="lg:col-span-3 space-y-4">
          {/* 컨트롤 바 */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  선택된 문제: <span className="font-semibold text-blue-600">{formData.selectedQuestions.length}</span> / {step1Data.questionCount}
                  {formData.selectedQuestions.length === step1Data.questionCount && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  사용 가능한 문제: <span className="font-semibold">{filteredQuestions.length}</span>개
                </div>
                {formData.selectedQuestions.length < step1Data.questionCount && filteredQuestions.length >= step1Data.questionCount && (
                  <div className="text-sm text-orange-600">
                    <span className="font-semibold">알림:</span> 문제를 더 추가할 수 있습니다
                  </div>
                )}
                {filteredQuestions.length < step1Data.questionCount && (
                  <div className="text-sm text-red-600">
                    <span className="font-semibold">주의:</span> 사용 가능한 문제가 부족합니다
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (step1Data && filteredQuestions.length > 0) {
                      autoSelectQuestions(step1Data, filteredQuestions);
                    }
                  }}
                  className="flex items-center gap-2"
                  title="설정한 문제 수에 맞춰 자동으로 문제를 다시 선택합니다"
                >
                  <RefreshCw className="w-4 h-4" />
                  자동 재선택
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    generateRecommendedQuestions();
                    setShowAddQuestionDialog(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  문제 추가
                </Button>
              </div>
            </div>
          </Card>

          {/* 선택된 문제 목록 */}
          <div className="space-y-3">
            {formData.selectedQuestions.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">선택된 문제가 없습니다</p>
                  <p className="text-sm">문제 추가 버튼을 클릭하여 문제를 추가해보세요.</p>
                </div>
              </Card>
            ) : (
              formData.selectedQuestions.map((question, index) => (
                <Card 
                  key={question.id} 
                  className="p-4 border-blue-200 bg-blue-50 transition-all duration-200 hover:shadow-md"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {getSubjectLabel(question.subject)}
                            </Badge>
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {getDifficultyLabel(question.difficulty)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <TrendingUp className="w-3 h-3" />
                              {question.correctRate}%
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {getQuestionTypeLabel(question.type)}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-900 font-medium mb-2 line-clamp-2">
                            {question.content}
                          </p>
                          
                          {question.choices && (
                            <div className="text-sm text-gray-600 mb-2">
                              선택지: {question.choices.length}개
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            {question.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewQuestion(question)}
                            title="미리보기"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(question)}
                            className={isFavorite(question.id) 
                              ? "text-red-600 hover:text-red-700 hover:bg-red-50" 
                              : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                            }
                            title={isFavorite(question.id) ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                          >
                            <Heart className={`w-4 h-4 ${isFavorite(question.id) ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentQuestionForSimilar(question);
                              loadSimilarQuestions(question);
                              setShowSimilarDialog(true);
                            }}
                            title="유사 문제로 교체"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="문제 제거"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* 사이드바 - 요약 정보 */}
        <div className="space-y-4">
          <Card className="p-4 sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">선택 요약</h3>
            
            <div className="space-y-4">
              {/* 기본 정보 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">총 문항 수</span>
                  <span className="font-semibold">{formData.summary.totalQuestions}문항</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">평균 정답률</span>
                  <span className="font-semibold">{formData.summary.averageCorrectRate}%</span>
                </div>
              </div>

              {/* 난이도 분포 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">난이도 분포</h4>
                <div className="space-y-1">
                  {Object.entries(formData.summary.difficultyDistribution).map(([difficulty, count]) => (
                    <div key={difficulty} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {getDifficultyLabel(difficulty as Difficulty)}
                      </span>
                      <span className="text-sm font-medium">{count}문항</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 출처 분포 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">출처 분포</h4>
                <div className="space-y-1">
                  {Object.entries(formData.summary.sourceDistribution).map(([source, count]) => (
                    <div key={source} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {getSourceLabel(source as QuestionSource)}
                      </span>
                      <span className="text-sm font-medium">{count}문항</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 목표 vs 실제 */}
              {step1Data.difficulty.type === 'mixed' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">목표 vs 실제</h4>
                  <div className="space-y-1">
                    {Object.entries(step1Data.difficulty.mixed!).map(([difficulty, target]) => {
                      const actual = formData.summary.difficultyDistribution[difficulty as Difficulty];
                      const isMatch = target === actual;
                      
                      return (
                        <div key={difficulty} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {getDifficultyLabel(difficulty as Difficulty)}
                          </span>
                          <span className={`text-sm font-medium ${isMatch ? 'text-green-600' : 'text-orange-600'}`}>
                            {actual}/{target}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          이전 단계
        </Button>
        <Button 
          onClick={handleNext}
          disabled={formData.selectedQuestions.length === 0}
          className="flex items-center gap-2"
        >
          다음 단계
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 문제 추가 다이얼로그 */}
      <Dialog open={showAddQuestionDialog} onOpenChange={setShowAddQuestionDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>문제 추가</DialogTitle>
          </DialogHeader>
          
          <Tabs value={addMode} onValueChange={(value) => setAddMode(value as 'search' | 'recommend' | 'favorites')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                검색으로 추가
              </TabsTrigger>
              <TabsTrigger value="recommend" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                추천 문제
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                즐겨찾기 ({favoritesState.favoriteQuestions.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="문제 내용이나 태그로 검색하세요"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchQuestions(e.target.value);
                  }}
                  className="pl-10"
                />
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-2">
                {searchResults.length === 0 && searchQuery ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>검색 결과가 없습니다.</p>
                  </div>
                ) : (
                  searchResults.map((question) => (
                    <Card key={question.id} className="p-3 hover:bg-gray-50 cursor-pointer" onClick={() => addQuestion(question)}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {getSubjectLabel(question.subject)}
                            </Badge>
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {getDifficultyLabel(question.difficulty)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <TrendingUp className="w-3 h-3" />
                              {question.correctRate}%
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {getQuestionTypeLabel(question.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-900 line-clamp-2">{question.content}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {question.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(question);
                            }}
                            className={isFavorite(question.id) 
                              ? "text-red-600 hover:text-red-700 hover:bg-red-50" 
                              : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                            }
                            title={isFavorite(question.id) ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                          >
                            <Heart className={`w-4 h-4 ${isFavorite(question.id) ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recommend" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">추천 기준</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      해당 카테고리에서 정답률이 낮거나, 학생들이 자주 틀리는 문항을 추천합니다.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-2">
                {recommendedQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>추천할 문제가 없습니다.</p>
                  </div>
                ) : (
                  recommendedQuestions.map((question) => (
                    <Card key={question.id} className="p-3 hover:bg-gray-50 cursor-pointer" onClick={() => addQuestion(question)}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {getSubjectLabel(question.subject)}
                            </Badge>
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {getDifficultyLabel(question.difficulty)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <TrendingUp className="w-3 h-3" />
                              {question.correctRate}%
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {getQuestionTypeLabel(question.type)}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700">
                              추천
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-900 line-clamp-2">{question.content}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {question.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(question);
                            }}
                            className={isFavorite(question.id) 
                              ? "text-red-600 hover:text-red-700 hover:bg-red-50" 
                              : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                            }
                            title={isFavorite(question.id) ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                          >
                            <Heart className={`w-4 h-4 ${isFavorite(question.id) ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-4">
              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-pink-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-pink-900">즐겨찾기 문제</h4>
                    <p className="text-sm text-pink-700 mt-1">
                      즐겨찾기로 저장한 문제들을 선택하여 학습지에 추가할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-2">
                {favoritesState.favoriteQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>즐겨찾기한 문제가 없습니다.</p>
                    <p className="text-sm mt-1">문제 목록에서 하트 버튼을 클릭하여 즐겨찾기에 추가해보세요.</p>
                  </div>
                ) : (
                  favoritesState.favoriteQuestions
                    .filter(question => !selectedQuestionIds.has(question.id)) // 이미 선택된 문제는 제외
                    .map((question) => (
                    <Card key={question.id} className="p-3 hover:bg-gray-50 cursor-pointer" onClick={() => addQuestion(question)}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {getSubjectLabel(question.subject)}
                            </Badge>
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {getDifficultyLabel(question.difficulty)}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <TrendingUp className="w-3 h-3" />
                              {question.correctRate}%
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {getQuestionTypeLabel(question.type)}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-pink-100 text-pink-700">
                              <Heart className="w-3 h-3 mr-1 fill-current" />
                              즐겨찾기
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-900 line-clamp-2">{question.content}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {question.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFavorite(question.id);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="즐겨찾기 해제"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* 유사 문제 교체 다이얼로그 */}
      <Dialog open={showSimilarDialog} onOpenChange={setShowSimilarDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>유사 문제로 교체</DialogTitle>
          </DialogHeader>
          
          {currentQuestionForSimilar && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">현재 문제</h4>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {getSubjectLabel(currentQuestionForSimilar.subject)}
                  </Badge>
                  <Badge className={getDifficultyColor(currentQuestionForSimilar.difficulty)}>
                    {getDifficultyLabel(currentQuestionForSimilar.difficulty)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <TrendingUp className="w-3 h-3" />
                    {currentQuestionForSimilar.correctRate}%
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {getQuestionTypeLabel(currentQuestionForSimilar.type)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-900">{currentQuestionForSimilar.content}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">유사 문제 목록</h4>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {similarQuestions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>유사한 문제가 없습니다.</p>
                    </div>
                  ) : (
                    similarQuestions.map((question) => (
                      <Card key={question.id} className="p-3 hover:bg-gray-50 cursor-pointer" 
                            onClick={() => replaceQuestion(currentQuestionForSimilar, question)}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {getSubjectLabel(question.subject)}
                              </Badge>
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                {getDifficultyLabel(question.difficulty)}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <TrendingUp className="w-3 h-3" />
                                {question.correctRate}%
                              </div>
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                {getQuestionTypeLabel(question.type)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-900 line-clamp-2">{question.content}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {question.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 문제 미리보기 모달 */}
      {previewQuestion && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">문제 미리보기</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewQuestion(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {getSubjectLabel(previewQuestion.subject)}
                  </Badge>
                  <Badge className={getDifficultyColor(previewQuestion.difficulty)}>
                    {getDifficultyLabel(previewQuestion.difficulty)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <TrendingUp className="w-3 h-3" />
                    정답률 {previewQuestion.correctRate}%
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {getQuestionTypeLabel(previewQuestion.type)}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">문제</h4>
                  <p className="text-gray-900">{previewQuestion.content}</p>
                </div>
                
                {previewQuestion.choices && (
                  <div>
                    <h4 className="font-medium mb-2">선택지</h4>
                    <div className="space-y-1">
                      {previewQuestion.choices.map((choice, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span>{choice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">정답</h4>
                  <p className="text-blue-600 font-medium">{previewQuestion.correctAnswer}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">해설</h4>
                  <p className="text-gray-700">{previewQuestion.explanation}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">태그</h4>
                  <div className="flex flex-wrap gap-1">
                    {previewQuestion.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
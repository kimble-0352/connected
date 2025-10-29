'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/contexts/AppContext';
import { 
  dummyFolders, 
  dummyUsers, 
  getStudentsByTeacherId 
} from '@/app/lib/data/dummy-data';
import { 
  WorksheetCreationStep1, 
  WorksheetCreationStep2, 
  WorksheetCreationStep3,
  User,
  Worksheet,
  Assignment
} from '@/app/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/ui/form-field';
import { 
  ArrowLeft, 
  Save, 
  BookOpen, 
  FolderOpen,
  QrCode,
  FileText,
  Users,
  Calendar,
  Settings,
  CheckCircle,
  HelpCircle,
  Download,
  Send,
  User as UserIcon,
  Tag,
  Palette,
  Layout,
  Plus,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function CreateWorksheetStep3Page() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const currentUser = state.currentUser;
  
  const [step1Data, setStep1Data] = useState<WorksheetCreationStep1 | null>(null);
  const [step2Data, setStep2Data] = useState<WorksheetCreationStep2 | null>(null);
  const [formData, setFormData] = useState<WorksheetCreationStep3>({
    title: '',
    description: '',
    tags: [],
    folderId: undefined,
    qrCodeEnabled: true,
    pdfOptions: {
      includeAnswers: true,
      includeExplanations: true,
      layout: 'single',
      theme: 'default',
      watermark: true,
      sourceDisplay: 'end'
    },
    assignToStudents: undefined
  });

  // 학년 상태 추가
  const [grade, setGrade] = useState<string>('');


  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [assignmentEnabled, setAssignmentEnabled] = useState(false);
  
  // 기본 태그 목록
  const defaultTags = [
    '연습문제',
    '과제', 
    '일일테스트',
    '주간테스트',
    '월간테스트',
    '내신대비'
  ];
  
  // 직접입력 모드 상태
  const [customTagMode, setCustomTagMode] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');

  // 이전 단계 데이터 로드
  useEffect(() => {
    const step1Saved = sessionStorage.getItem('worksheetCreationStep1');
    const step2Saved = sessionStorage.getItem('worksheetCreationStep2');
    
    if (step1Saved && step2Saved) {
      const step1: WorksheetCreationStep1 = JSON.parse(step1Saved);
      const step2: WorksheetCreationStep2 = JSON.parse(step2Saved);
      
      setStep1Data(step1);
      setStep2Data(step2);
      
      // 기본 제목 설정
      const subjectName = step1.subject === 'math' ? '수학' : 
                         step1.subject === 'english' ? '영어' : '국어';
      const defaultTitle = `${subjectName} 학습지 - ${new Date().toLocaleDateString()}`;
      
      setFormData(prev => ({
        ...prev,
        title: defaultTitle
      }));
      
      // 학생 목록 로드
      if (currentUser?.id) {
        const teacherStudents = getStudentsByTeacherId(currentUser.id);
        setStudents(teacherStudents);
      }
    } else {
      router.push('/teacher/worksheets/create');
    }
  }, [router, currentUser]);

  // 기본 태그 추가/제거
  const toggleDefaultTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== tag)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  // 커스텀 태그 추가
  const addCustomTag = () => {
    if (customTagInput.trim() && !formData.tags.includes(customTagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, customTagInput.trim()]
      }));
      setCustomTagInput('');
      setCustomTagMode(false);
    }
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 학생 선택/해제
  const toggleStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  // 전체 학생 선택/해제
  const toggleAllStudents = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map(s => s.id)));
    }
  };

  // 과제 배정 설정
  const updateAssignmentSettings = () => {
    if (assignmentEnabled && selectedStudents.size > 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 7); // 일주일 후
      
      setFormData(prev => ({
        ...prev,
        assignToStudents: {
          studentIds: Array.from(selectedStudents),
          dueDate: tomorrow.toISOString().split('T')[0]
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        assignToStudents: undefined
      }));
    }
  };

  useEffect(() => {
    updateAssignmentSettings();
  }, [assignmentEnabled, selectedStudents]);


  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '학습지 제목을 입력해주세요.';
    }

    if (assignmentEnabled && selectedStudents.size === 0) {
      newErrors.students = '과제로 배정할 학생을 선택해주세요.';
    }

    if (assignmentEnabled && formData.assignToStudents && !formData.assignToStudents.dueDate) {
      newErrors.dueDate = '과제 마감일을 설정해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 학습지 생성
  const handleSubmit = async (action: 'draft' | 'publish') => {
    if (!validateForm()) return;
    if (!step1Data || !step2Data) return;

    setIsSubmitting(true);

    try {
      // 새로운 학습지 데이터 생성
      const newWorksheet: Worksheet = {
        id: `worksheet-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        subject: step1Data.subject,
        teacherId: currentUser?.id || 'teacher-1',
        status: action === 'publish' ? 'published' : 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: formData.tags,
        folderId: formData.folderId,
        qrCode: formData.qrCodeEnabled ? `QR${Date.now()}` : undefined,
        schoolLevel: '중등',
        grade: grade || '중2',
        semester: '1학기',
        questions: step2Data.selectedQuestions,
        difficultyDistribution: step2Data.summary.difficultyDistribution,
        averageCorrectRate: step2Data.summary.averageCorrectRate,
        totalQuestions: step2Data.summary.totalQuestions,
        // step3에서 설정한 추가 정보들 저장
        worksheetSettings: {
          grade: grade || '중2', // 설정한 학년
          creator: currentUser?.name || '매쓰플랫', // 출제자 (현재 사용자)
          layout: formData.pdfOptions.layout, // 분할선택
          includeAnswers: formData.pdfOptions.includeAnswers, // 정답포함
          includeExplanations: formData.pdfOptions.includeExplanations, // 해설포함
          qrEnabled: formData.qrCodeEnabled // QR생성
        }
      };

      console.log('학습지 생성 데이터:', newWorksheet);

      // AppContext에 새 학습지 추가
      dispatch({ type: 'ADD_WORKSHEET', payload: newWorksheet });

      // 과제 배정이 설정된 경우 과제도 생성
      if (formData.assignToStudents && formData.assignToStudents.studentIds.length > 0) {
        const newAssignment: Assignment = {
          id: `assignment-${Date.now()}`,
          title: `${formData.title} 과제`,
          description: formData.description || '학습지 과제입니다.',
          worksheetId: newWorksheet.id,
          teacherId: currentUser?.id || 'teacher-1',
          studentIds: formData.assignToStudents.studentIds,
          assignedAt: new Date().toISOString(),
          dueDate: new Date(formData.assignToStudents.dueDate).toISOString(),
          status: 'in_progress',
          completionRate: 0,
          averageScore: 0
        };

        dispatch({ type: 'ADD_ASSIGNMENT', payload: newAssignment });
        console.log('과제 생성 완료:', newAssignment);
      }

      // 세션 스토리지 정리
      sessionStorage.removeItem('worksheetCreationStep1');
      sessionStorage.removeItem('worksheetCreationStep2');

      // 성공 메시지와 함께 목록으로 이동
      alert(`학습지가 ${action === 'publish' ? '발행' : '임시저장'}되었습니다.`);
      router.push('/teacher/worksheets');
    } catch (error) {
      console.error('학습지 생성 실패:', error);
      alert('학습지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이전 단계로
  const handlePrevious = () => {
    router.push('/teacher/worksheets/create/step2');
  };

  if (!step1Data || !step2Data) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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
            <p className="text-gray-600 mt-1">STEP 3: 학습지 설정</p>
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
        <div className="w-16 h-0.5 bg-green-600"></div>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="ml-2 text-sm font-medium text-green-600">문제 선택</span>
        </div>
        <div className="w-16 h-0.5 bg-blue-600"></div>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
            3
          </div>
          <span className="ml-2 text-sm font-medium text-blue-600">학습지 설정</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
        {/* 좌측 설정 영역 */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {/* 1. 학습지명 */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">학습지명</h2>
            </div>
            <FormField label="" required error={errors.title}>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="중1-1"
                className="text-lg font-medium"
              />
            </FormField>
          </Card>

          {/* 2. 출제자 */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">출제자</h2>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">{currentUser?.name || '매쓰플랫'}</span>
            </div>
          </Card>

          {/* 3. 학년 */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">학년</h2>
            </div>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="학년을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="초6">초6</SelectItem>
                <SelectItem value="중1">중1</SelectItem>
                <SelectItem value="중2">중2</SelectItem>
                <SelectItem value="중3">중3</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* 4. 학습지 설명 */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">학습지 설명</h2>
            </div>
            <FormField label="" error={errors.description}>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="학습지에 대한 설명을 입력하세요 (선택사항)"
                rows={3}
                className="resize-none"
              />
            </FormField>
          </Card>


          {/* 5. 학습지 태그 */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">학습지 태그</h2>
            </div>
            
            <div className="space-y-4">
              {/* 기본 태그 버튼들 */}
              <div className="flex flex-wrap gap-2">
                {defaultTags.map(tag => (
                  <Button
                    key={tag}
                    type="button"
                    variant={formData.tags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDefaultTag(tag)}
                    className="text-sm"
                  >
                    {tag}
                  </Button>
                ))}
              </div>

              {/* 직접입력 옵션 */}
              <div className="space-y-2">
                {!customTagMode ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomTagMode(true)}
                    className="text-sm text-gray-600"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    직접 입력
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      placeholder="태그를 입력하세요"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                      className="flex-1"
                    />
                    <Button type="button" size="sm" onClick={addCustomTag}>
                      추가
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setCustomTagMode(false);
                        setCustomTagInput('');
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* 선택된 태그 표시 */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {formData.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-red-100 hover:text-red-700" 
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* 6. 학습지 디자인 템플릿 */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">학습지 디자인 템플릿</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center gap-3 p-4 rounded-lg border-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.pdfOptions.includeAnswers}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pdfOptions: { ...prev.pdfOptions, includeAnswers: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <span className="font-medium">정답 포함</span>
                    <p className="text-sm text-gray-600">학습지에 정답을 포함합니다.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-lg border-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.pdfOptions.includeExplanations}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pdfOptions: { ...prev.pdfOptions, includeExplanations: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-medium">해설 포함</span>
                    <p className="text-sm text-gray-600">학습지에 문제 해설을 포함합니다.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-lg border-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.qrCodeEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, qrCodeEnabled: e.target.checked }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <QrCode className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="font-medium">QR 생성</span>
                    <p className="text-sm text-gray-600">모바일 채점용 QR 코드를 생성합니다.</p>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          {/* 7. 분할 선택 */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">7</div>
              <h2 className="text-base lg:text-lg font-semibold text-gray-900">분할 선택</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="layout"
                  value="single"
                  checked={formData.pdfOptions.layout === 'single'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pdfOptions: { ...prev.pdfOptions, layout: e.target.value as any }
                  }))}
                  className="w-4 h-4 text-blue-600"
                />
                <Layout className="w-8 h-8 text-gray-600" />
                <span className="font-medium text-sm">기본</span>
              </label>

              <label className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="layout"
                  value="double"
                  checked={formData.pdfOptions.layout === 'double'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    pdfOptions: { ...prev.pdfOptions, layout: e.target.value as any }
                  }))}
                  className="w-4 h-4 text-blue-600"
                />
                <Layout className="w-8 h-8 text-gray-600" />
                <span className="font-medium text-sm">2분할</span>
              </label>
            </div>
          </Card>
        </div>

        {/* 우측 미리보기 영역 */}
        <div className="lg:col-span-1 xl:col-span-2">
          <div className="sticky top-6">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-blue-600" />
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">학습지 미리보기</h2>
              </div>
              
              <div className="space-y-4">
                {/* 실시간 학습지 미리보기 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                  {/* 학습지 헤더 */}
                  <div className="text-center mb-4 pb-3 border-b">
                    {/* 대교 로고 - 기본값으로 표시 */}
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">대교</span>
                      </div>
                    </div>
                    
                    <h1 className="text-lg font-bold text-gray-900 mb-1">
                      {grade && `${grade} `}{formData.title || '학습지 제목'}
                    </h1>
                    
                    {/* 선택된 태그 표시 */}
                    {formData.tags.length > 0 && (
                      <div className="flex justify-center gap-1 mb-2">
                        {formData.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {formData.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{formData.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>이름: _______________</span>
                      <span>날짜: {new Date().toLocaleDateString()}</span>
                      {formData.qrCodeEnabled && (
                        <div className="w-6 h-6 border border-gray-300 flex items-center justify-center">
                          <QrCode className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {formData.description && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        {formData.description}
                      </p>
                    )}
                  </div>

                  {/* 문제 샘플 */}
                  <div className={`space-y-4 ${formData.pdfOptions.layout === 'double' ? 'grid grid-cols-2 gap-4' : ''}`}>
                    {/* 샘플 문제 1 */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">1</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">다음 중 올바른 계산 결과는?</p>
                          <div className="text-xs text-gray-700 mt-1 space-y-0.5">
                            <div>① 2 + 3 = 5</div>
                            <div>② 4 + 6 = 11</div>
                            <div>③ 7 + 8 = 16</div>
                            <div>④ 9 + 2 = 11</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 정답 표시 (조건부) */}
                      {formData.pdfOptions.includeAnswers && (
                        <div className="ml-7 p-2 bg-green-50 rounded text-xs">
                          <span className="font-semibold text-green-800">정답: ① 2 + 3 = 5</span>
                        </div>
                      )}
                      
                      {/* 해설 표시 (조건부) */}
                      {formData.pdfOptions.includeExplanations && (
                        <div className="ml-7 p-2 bg-blue-50 rounded text-xs">
                          <span className="font-semibold text-blue-800">해설:</span>
                          <span className="text-blue-700"> 덧셈의 기본 원리에 따라 2 + 3 = 5가 정답입니다.</span>
                        </div>
                      )}
                    </div>

                    {/* 샘플 문제 2 (레이아웃에 따라 표시) */}
                    {formData.pdfOptions.layout === 'double' && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">2</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">분수 3/4를 소수로 나타내면?</p>
                            <div className="text-xs text-gray-700 mt-1 space-y-0.5">
                              <div>① 0.25</div>
                              <div>② 0.5</div>
                              <div>③ 0.75</div>
                              <div>④ 1.25</div>
                            </div>
                          </div>
                        </div>
                        
                        {formData.pdfOptions.includeAnswers && (
                          <div className="ml-7 p-2 bg-green-50 rounded text-xs">
                            <span className="font-semibold text-green-800">정답: ③ 0.75</span>
                          </div>
                        )}
                        
                        {formData.pdfOptions.includeExplanations && (
                          <div className="ml-7 p-2 bg-blue-50 rounded text-xs">
                            <span className="font-semibold text-blue-800">해설:</span>
                            <span className="text-blue-700"> 3을 4로 나누면 0.75가 됩니다.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 푸터 */}
                  <div className="mt-4 pt-3 border-t text-center">
                    <p className="text-xs text-gray-500">
                      총 {step2Data?.summary?.totalQuestions || 50}문항 • 
                      {step1Data.subject === 'math' ? ' 수학' : step1Data.subject === 'english' ? ' 영어' : ' 국어'}
                      {grade && ` • ${grade}`} • 
                      {currentUser?.name || '매쓰플랫'}
                    </p>
                  </div>
                </div>

                {/* 선택된 태그 표시 */}
                {formData.tags.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">선택된 태그</div>
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 설정 요약 */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">정답 포함:</span>
                    <span className={formData.pdfOptions.includeAnswers ? "text-green-600" : "text-gray-400"}>
                      {formData.pdfOptions.includeAnswers ? "포함" : "미포함"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">해설 포함:</span>
                    <span className={formData.pdfOptions.includeExplanations ? "text-green-600" : "text-gray-400"}>
                      {formData.pdfOptions.includeExplanations ? "포함" : "미포함"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">QR 코드:</span>
                    <span className={formData.qrCodeEnabled ? "text-green-600" : "text-gray-400"}>
                      {formData.qrCodeEnabled ? "생성" : "미생성"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">분할:</span>
                    <span className="text-gray-900 font-medium">
                      {formData.pdfOptions.layout === 'single' ? '기본' : '2분할'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
        <Button variant="outline" onClick={handlePrevious} size="lg" className="w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          이전
        </Button>
        
        <Button
          onClick={() => handleSubmit('publish')}
          disabled={isSubmitting}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 w-full sm:w-auto"
        >
          {isSubmitting ? '처리 중...' : '학습지 만들기'}
        </Button>
      </div>
    </div>
  );
}
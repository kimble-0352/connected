'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/contexts/AppContext';
import { 
  dummyWorksheets, 
  dummyUsers, 
  getStudentsByTeacherId,
  getWorksheetsByTeacherId 
} from '@/app/lib/data/dummy-data';
import { 
  Worksheet, 
  User,
  Subject 
} from '@/app/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/ui/form-field';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Send, 
  BookOpen, 
  Users,
  Calendar,
  Clock,
  Target,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface AssignmentForm {
  title: string;
  description: string;
  worksheetId: string;
  studentIds: string[];
  dueDate: string;
  dueTime: string;
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const currentUser = state.currentUser;
  
  const [formData, setFormData] = useState<AssignmentForm>({
    title: '',
    description: '',
    worksheetId: '',
    studentIds: [],
    dueDate: '',
    dueTime: '23:59'
  });

  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedWorksheet, setSelectedWorksheet] = useState<Worksheet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<Subject | 'all'>('all');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWorksheetPreview, setShowWorksheetPreview] = useState(false);

  // 데이터 로드
  useEffect(() => {
    if (currentUser?.id) {
      const teacherWorksheets = getWorksheetsByTeacherId(currentUser.id);
      const teacherStudents = getStudentsByTeacherId(currentUser.id);
      
      setWorksheets(teacherWorksheets);
      setStudents(teacherStudents);
    }
  }, [currentUser]);

  // 학습지 선택 시 제목 자동 설정
  useEffect(() => {
    if (selectedWorksheet && !formData.title) {
      setFormData(prev => ({
        ...prev,
        title: `${selectedWorksheet.title} 과제`
      }));
    }
  }, [selectedWorksheet, formData.title]);

  // 학습지 필터링
  const filteredWorksheets = worksheets.filter(worksheet => {
    const matchesSearch = worksheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worksheet.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || worksheet.subject === subjectFilter;
    
    return matchesSearch && matchesSubject && worksheet.status === 'published';
  });

  // 학습지 선택
  const selectWorksheet = (worksheet: Worksheet) => {
    setSelectedWorksheet(worksheet);
    setFormData(prev => ({
      ...prev,
      worksheetId: worksheet.id,
      title: prev.title || `${worksheet.title} 과제`
    }));
    setShowWorksheetPreview(false);
  };

  // 학생 선택/해제
  const toggleStudent = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId]
    }));
  };

  // 전체 학생 선택/해제
  const toggleAllStudents = () => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.length === students.length 
        ? [] 
        : students.map(s => s.id)
    }));
  };

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '과제 제목을 입력해주세요.';
    }

    if (!formData.worksheetId) {
      newErrors.worksheet = '학습지를 선택해주세요.';
    }

    if (formData.studentIds.length === 0) {
      newErrors.students = '최소 1명 이상의 학생을 선택해주세요.';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = '마감일을 설정해주세요.';
    } else {
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
      const now = new Date();
      if (dueDateTime <= now) {
        newErrors.dueDate = '마감일은 현재 시간 이후로 설정해주세요.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 과제 생성
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const assignmentData = {
        id: `assignment-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        worksheetId: formData.worksheetId,
        teacherId: currentUser?.id || '',
        studentIds: formData.studentIds,
        assignedAt: new Date().toISOString(),
        dueDate: new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString(),
        status: 'in_progress' as const,
        completionRate: 0,
        averageScore: 0
      };

      console.log('과제 배정 데이터:', assignmentData);

      // AppContext에 과제 추가
      dispatch({ type: 'ADD_ASSIGNMENT', payload: assignmentData });

      alert(`${formData.studentIds.length}명의 학생에게 과제가 배정되었습니다.`);
      router.push('/teacher/assignments');
    } catch (error) {
      console.error('과제 배정 실패:', error);
      alert('과제 배정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubjectLabel = (subject: Subject) => {
    switch (subject) {
      case 'math': return '수학';
      case 'english': return '영어';
      case 'korean': return '국어';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return '하';
      case 'medium': return '중';
      case 'high': return '상';
      case 'highest': return '최상';
      default: return difficulty;
    }
  };

  // 내일 날짜를 기본값으로 설정
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDueDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/teacher/assignments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              과제 목록
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">과제 배정하기</h1>
            <p className="text-gray-600 mt-1">학습지를 선택하고 학생들에게 과제를 배정하세요</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 폼 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">기본 정보</h2>
            </div>
            
            <div className="space-y-4">
              <FormField label="과제 제목" required error={errors.title}>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="과제 제목을 입력하세요"
                />
              </FormField>

              <FormField label="과제 설명">
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="과제에 대한 설명을 입력하세요 (선택사항)"
                  rows={3}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="마감일" required error={errors.dueDate}>
                  <Input
                    type="date"
                    value={formData.dueDate || defaultDueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormField>

                <FormField label="마감 시간">
                  <Input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                  />
                </FormField>
              </div>
            </div>
          </Card>

          {/* 학습지 선택 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">학습지 선택</h2>
              </div>
              {selectedWorksheet && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWorksheetPreview(true)}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  미리보기
                </Button>
              )}
            </div>

            {selectedWorksheet ? (
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-blue-900">{selectedWorksheet.title}</h3>
                      <Badge variant="outline">{getSubjectLabel(selectedWorksheet.subject)}</Badge>
                    </div>
                    {selectedWorksheet.description && (
                      <p className="text-blue-800 text-sm mb-2">{selectedWorksheet.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-blue-700">
                      <span>총 {selectedWorksheet.totalQuestions}문항</span>
                      <span>평균 정답률 {selectedWorksheet.averageCorrectRate}%</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedWorksheet(null);
                      setFormData(prev => ({ ...prev, worksheetId: '', title: '' }));
                    }}
                  >
                    변경
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 검색 및 필터 */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="학습지 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={subjectFilter}
                    onValueChange={(value) => setSubjectFilter(value as Subject | 'all')}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="과목 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 과목</SelectItem>
                      <SelectItem value="math">수학</SelectItem>
                      <SelectItem value="english">영어</SelectItem>
                      <SelectItem value="korean">국어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 학습지 목록 */}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredWorksheets.length > 0 ? (
                    filteredWorksheets.map(worksheet => (
                      <div
                        key={worksheet.id}
                        onClick={() => selectWorksheet(worksheet)}
                        className="p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{worksheet.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {getSubjectLabel(worksheet.subject)}
                              </Badge>
                            </div>
                            {worksheet.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                                {worksheet.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{worksheet.totalQuestions}문항</span>
                              <span>정답률 {worksheet.averageCorrectRate}%</span>
                              <span>{new Date(worksheet.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>조건에 맞는 학습지가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {errors.worksheet && (
              <p className="text-red-600 text-sm mt-2">{errors.worksheet}</p>
            )}
          </Card>

          {/* 학생 선택 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  학생 선택 ({formData.studentIds.length}/{students.length})
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAllStudents}
              >
                {formData.studentIds.length === students.length ? '전체 해제' : '전체 선택'}
              </Button>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {students.map(student => (
                <label
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.studentIds.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-gray-600">{student.memberNumber}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.students && (
              <p className="text-red-600 text-sm mt-2">{errors.students}</p>
            )}
          </Card>
        </div>

        {/* 사이드바 - 요약 정보 */}
        <div className="space-y-4">
          <Card className="p-4 sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">배정 요약</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">과제 제목:</span>
                <div className="mt-1 font-medium">
                  {formData.title || '제목을 입력하세요'}
                </div>
              </div>

              <div>
                <span className="text-gray-600">선택된 학습지:</span>
                <div className="mt-1 font-medium">
                  {selectedWorksheet ? selectedWorksheet.title : '학습지를 선택하세요'}
                </div>
              </div>

              <div>
                <span className="text-gray-600">배정 대상:</span>
                <div className="mt-1 font-medium">
                  {formData.studentIds.length}명 선택됨
                </div>
              </div>

              <div>
                <span className="text-gray-600">마감일:</span>
                <div className="mt-1 font-medium">
                  {formData.dueDate 
                    ? `${new Date(formData.dueDate).toLocaleDateString()} ${formData.dueTime}`
                    : '마감일을 설정하세요'
                  }
                </div>
              </div>

              {selectedWorksheet && (
                <div className="pt-3 border-t">
                  <span className="text-gray-600">학습지 정보:</span>
                  <div className="mt-2 space-y-1 text-xs">
                    <div>총 {selectedWorksheet.totalQuestions}문항</div>
                    <div>평균 정답률 {selectedWorksheet.averageCorrectRate}%</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(selectedWorksheet.difficultyDistribution).map(([diff, count]) => (
                        count > 0 && (
                          <Badge key={diff} variant="outline" className="text-xs">
                            {getDifficultyLabel(diff)} {count}문항
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.worksheetId || formData.studentIds.length === 0}
                className="w-full gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? '배정 중...' : '과제 배정하기'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 학습지 미리보기 모달 */}
      {showWorksheetPreview && selectedWorksheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">학습지 미리보기</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWorksheetPreview(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold">{selectedWorksheet.title}</h2>
                  <Badge>{getSubjectLabel(selectedWorksheet.subject)}</Badge>
                </div>
                
                {selectedWorksheet.description && (
                  <p className="text-gray-700 mb-4">{selectedWorksheet.description}</p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">{selectedWorksheet.totalQuestions}</div>
                    <div className="text-sm text-gray-600">총 문항</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">{selectedWorksheet.averageCorrectRate}%</div>
                    <div className="text-sm text-gray-600">평균 정답률</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">
                      {Object.values(selectedWorksheet.difficultyDistribution).reduce((a, b) => a + b, 0)}
                    </div>
                    <div className="text-sm text-gray-600">전체 문항</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">
                      {new Date(selectedWorksheet.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">생성일</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">난이도 분포</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(selectedWorksheet.difficultyDistribution).map(([diff, count]) => (
                      <div key={diff} className="text-center p-2 border rounded">
                        <div className="font-semibold">{count}</div>
                        <div className="text-xs text-gray-600">{getDifficultyLabel(diff)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">문제 미리보기</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedWorksheet.questions.slice(0, 3).map((question, index) => (
                      <div key={question.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">문제 {index + 1}</span>
                          <Badge variant="outline" className="text-xs">
                            {getDifficultyLabel(question.difficulty)}
                          </Badge>
                        </div>
                        <p className="text-gray-900">{question.content}</p>
                      </div>
                    ))}
                    {selectedWorksheet.questions.length > 3 && (
                      <div className="text-center text-gray-500 text-sm">
                        ... 외 {selectedWorksheet.questions.length - 3}개 문제
                      </div>
                    )}
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
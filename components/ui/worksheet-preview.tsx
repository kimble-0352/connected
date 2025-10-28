'use client';

import { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { 
  Eye, 
  Download, 
  Palette, 
  Layout,
  FileText,
  CheckCircle,
  HelpCircle,
  BookOpen,
  GraduationCap,
  Tag,
  QrCode,
  Image
} from 'lucide-react';

export interface WorksheetPreviewProps {
  step1Data: any;
  step2Data: any;
  designOptions: {
    viewMode: 'questions' | 'questions-answers' | 'questions-answers-explanations';
    colorTheme: string;
    layout: 'single' | 'double';
    grade: string;
    worksheetTags: string[];
    includeAnswers: boolean;
    includeExplanations: boolean;
    generateQR: boolean;
    showLogo: boolean;
  };
  onDesignChange: (options: any) => void;
}

const colorThemes = [
  { id: 'blue', name: '파란색', color: '#3B82F6', bgColor: '#EFF6FF' },
  { id: 'orange', name: '주황색', color: '#F97316', bgColor: '#FFF7ED' },
  { id: 'red', name: '빨간색', color: '#EF4444', bgColor: '#FEF2F2' },
  { id: 'purple', name: '보라색', color: '#8B5CF6', bgColor: '#F5F3FF' },
  { id: 'green', name: '초록색', color: '#10B981', bgColor: '#ECFDF5' },
  { id: 'teal', name: '청록색', color: '#14B8A6', bgColor: '#F0FDFA' },
  { id: 'gray', name: '회색', color: '#6B7280', bgColor: '#F9FAFB' }
];

const gradeOptions = [
  { id: '1', name: '중1' },
  { id: '2', name: '중2' },
  { id: '3', name: '중3' },
  { id: '4', name: '고1' },
  { id: '5', name: '고2' },
  { id: '6', name: '고3' }
];

const viewModeOptions = [
  { 
    id: 'questions', 
    name: '문제만', 
    description: '문제만 학습지에 노출',
    icon: FileText 
  },
  { 
    id: 'questions-answers', 
    name: '문제+정답', 
    description: '문제+정답 학습지에 노출',
    icon: CheckCircle 
  },
  { 
    id: 'questions-answers-explanations', 
    name: '문제+정답+해설', 
    description: '문제+정답+해설 학습지에 노출',
    icon: HelpCircle 
  }
];

const defaultWorksheetTags = [
  '기본문제', '심화문제', '응용문제', '실전문제', '개념정리', 
  '단원평가', '중간고사', '기말고사', '모의고사', '수능대비'
];

export function WorksheetPreview({ 
  step1Data, 
  step2Data, 
  designOptions, 
  onDesignChange 
}: WorksheetPreviewProps) {
  const [activeTab, setActiveTab] = useState<'design' | 'preview'>('design');
  
  const currentTheme = colorThemes.find(theme => theme.id === designOptions.colorTheme) || colorThemes[0];
  const currentViewMode = viewModeOptions.find(mode => mode.id === designOptions.viewMode) || viewModeOptions[0];

  // 샘플 문제 데이터 (실제로는 step2Data에서 가져옴)
  const sampleQuestions = [
    {
      id: '1',
      content: '다음 중 올바른 계산 결과는?',
      options: ['① 2 + 3 = 5', '② 4 + 6 = 11', '③ 7 + 8 = 16', '④ 9 + 2 = 11'],
      answer: '① 2 + 3 = 5',
      explanation: '덧셈의 기본 원리에 따라 2 + 3 = 5가 정답입니다.'
    },
    {
      id: '2', 
      content: '분수 3/4를 소수로 나타내면?',
      options: ['① 0.25', '② 0.5', '③ 0.75', '④ 1.25'],
      answer: '③ 0.75',
      explanation: '3을 4로 나누면 0.75가 됩니다.'
    }
  ];

  const handleViewModeChange = (viewMode: string) => {
    onDesignChange({
      ...designOptions,
      viewMode
    });
  };

  const handleColorThemeChange = (colorTheme: string) => {
    onDesignChange({
      ...designOptions,
      colorTheme
    });
  };

  const handleLayoutChange = (layout: string) => {
    onDesignChange({
      ...designOptions,
      layout
    });
  };

  const handleGradeChange = (grade: string) => {
    onDesignChange({
      ...designOptions,
      grade
    });
  };

  const handleWorksheetTagsChange = (tags: string[]) => {
    onDesignChange({
      ...designOptions,
      worksheetTags: tags
    });
  };

  const handleToggleOption = (option: string, value: boolean) => {
    onDesignChange({
      ...designOptions,
      [option]: value
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">학습지 디자인 설정</h2>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'design' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('design')}
          >
            <Palette className="w-4 h-4 mr-2" />
            디자인 설정
          </Button>
          <Button
            variant={activeTab === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('preview')}
          >
            <Eye className="w-4 h-4 mr-2" />
            미리보기
          </Button>
        </div>
      </div>

      {activeTab === 'design' && (
        <div className="space-y-6">
          {/* 학년 선택 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              학년 선택
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {gradeOptions.map((grade) => (
                <label
                  key={grade.id}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    designOptions.grade === grade.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="grade"
                    value={grade.id}
                    checked={designOptions.grade === grade.id}
                    onChange={(e) => handleGradeChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium text-gray-900">{grade.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 학습지 태그 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              학습지 태그
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {defaultWorksheetTags.map((tag) => (
                <label
                  key={tag}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                    designOptions.worksheetTags.includes(tag)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={designOptions.worksheetTags.includes(tag)}
                    onChange={(e) => {
                      const newTags = e.target.checked
                        ? [...designOptions.worksheetTags, tag]
                        : designOptions.worksheetTags.filter(t => t !== tag);
                      handleWorksheetTagsChange(newTags);
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 정답 포함, 해설 포함, QR 생성 옵션 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">추가 옵션</h3>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={designOptions.includeAnswers}
                  onChange={(e) => handleToggleOption('includeAnswers', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <CheckCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">정답 포함</div>
                  <div className="text-sm text-gray-600">정답을 학습지에 포함</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={designOptions.includeExplanations}
                  onChange={(e) => handleToggleOption('includeExplanations', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">해설 포함</div>
                  <div className="text-sm text-gray-600">해설을 학습지에 포함</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={designOptions.generateQR}
                  onChange={(e) => handleToggleOption('generateQR', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <QrCode className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">QR 생성</div>
                  <div className="text-sm text-gray-600">QR 코드 생성</div>
                </div>
              </label>
            </div>
          </div>

          {/* 분할 선택 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">분할 선택</h3>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  designOptions.layout === 'single'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="layout"
                  value="single"
                  checked={designOptions.layout === 'single'}
                  onChange={(e) => handleLayoutChange(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <Layout className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">기본</div>
                  <div className="text-sm text-gray-600">1문항/페이지</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  designOptions.layout === 'double'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="layout"
                  value="double"
                  checked={designOptions.layout === 'double'}
                  onChange={(e) => handleLayoutChange(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <Layout className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">2분할</div>
                  <div className="text-sm text-gray-600">2문항/페이지</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="space-y-4">
          {/* 미리보기 헤더 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">학습지 미리보기</h3>
              <p className="text-sm text-gray-600">
                {gradeOptions.find(g => g.id === designOptions.grade)?.name || '학년 미선택'} • {currentViewMode.name} • {currentTheme.name} • {designOptions.layout === 'single' ? '기본' : '2분할'}
              </p>
              <div className="flex gap-2 mt-2">
                {designOptions.worksheetTags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {designOptions.worksheetTags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{designOptions.worksheetTags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => alert('PDF 새창으로 열기 기능은 실제 학습지에서 사용 가능합니다.')}>
              <Download className="w-4 h-4 mr-2" />
              PDF 새창으로 보기
            </Button>
          </div>

          {/* 미리보기 콘텐츠 */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[400px]"
            style={{ backgroundColor: currentTheme.bgColor }}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
              {/* 학습지 헤더 */}
              <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: currentTheme.color }}>
                {/* 대교 로고 - 기본값으로 표시 */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">대교</span>
                  </div>
                </div>
                
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  {gradeOptions.find(g => g.id === designOptions.grade)?.name || ''} {step1Data?.subject === 'math' ? '수학' : 
                   step1Data?.subject === 'english' ? '영어' : '국어'} 학습지
                </h1>
                
                {/* 학습지 태그 */}
                {designOptions.worksheetTags.length > 0 && (
                  <div className="flex justify-center gap-1 mb-3">
                    {designOptions.worksheetTags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>이름: _______________</span>
                  <span>날짜: {new Date().toLocaleDateString()}</span>
                  {designOptions.generateQR && (
                    <div className="w-8 h-8 border border-gray-300 flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* 문제 목록 */}
              <div className={`space-y-6 ${designOptions.layout === 'double' ? 'grid grid-cols-2 gap-6' : ''}`}>
                {sampleQuestions.slice(0, designOptions.layout === 'double' ? 2 : 1).map((question, index) => (
                  <div key={question.id} className="space-y-3">
                    {/* 문제 */}
                    <div className="flex gap-3">
                      <span 
                        className="flex-shrink-0 w-6 h-6 rounded-full text-white text-sm font-semibold flex items-center justify-center"
                        style={{ backgroundColor: currentTheme.color }}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">{question.content}</p>
                        <div className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="text-sm text-gray-700">
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 정답 (조건부 표시) */}
                    {(designOptions.includeAnswers || 
                      designOptions.viewMode === 'questions-answers' || 
                      designOptions.viewMode === 'questions-answers-explanations') && (
                      <div className="ml-9 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">정답</span>
                        </div>
                        <p className="text-sm text-green-700">{question.answer}</p>
                      </div>
                    )}

                    {/* 해설 (조건부 표시) */}
                    {(designOptions.includeExplanations || 
                      designOptions.viewMode === 'questions-answers-explanations') && (
                      <div className="ml-9 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-800">해설</span>
                        </div>
                        <p className="text-sm text-blue-700">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 푸터 */}
              <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  총 {step2Data?.summary?.totalQuestions || 0}문항 • 평균 정답률 {step2Data?.summary?.averageCorrectRate || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* 미리보기 설정 요약 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-3">
              <div className="text-center">
                <div className="text-sm text-gray-600">학년</div>
                <div className="font-semibold text-gray-900">
                  {gradeOptions.find(g => g.id === designOptions.grade)?.name || '미선택'}
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-sm text-gray-600">보기 옵션</div>
                <div className="font-semibold text-gray-900">{currentViewMode.name}</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-sm text-gray-600">색상 테마</div>
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: currentTheme.color }}
                  />
                  <span className="font-semibold text-gray-900">{currentTheme.name}</span>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-sm text-gray-600">레이아웃</div>
                <div className="font-semibold text-gray-900">
                  {designOptions.layout === 'single' ? '기본' : '2분할'}
                </div>
              </div>
            </Card>
          </div>

          {/* 추가 옵션 요약 */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-3">
              <div className="text-center">
                <div className="text-sm text-gray-600">정답 포함</div>
                <div className="font-semibold text-gray-900">
                  {designOptions.includeAnswers ? '✓' : '✗'}
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-sm text-gray-600">해설 포함</div>
                <div className="font-semibold text-gray-900">
                  {designOptions.includeExplanations ? '✓' : '✗'}
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-sm text-gray-600">QR 생성</div>
                <div className="font-semibold text-gray-900">
                  {designOptions.generateQR ? '✓' : '✗'}
                </div>
              </div>
            </Card>
          </div>

          {/* 선택된 태그 */}
          {designOptions.worksheetTags.length > 0 && (
            <Card className="p-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">선택된 태그</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {designOptions.worksheetTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </Card>
  );
}




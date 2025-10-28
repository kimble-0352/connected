'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, Clock, FileText, User, Hash, Edit3 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Worksheet, OMRCard, OMRAnswer, Question } from '@/app/types';
import { dummyWorksheets } from '@/app/lib/data/dummy-data';

export default function OMRCardPage() {
  const params = useParams();
  const router = useRouter();
  const worksheetId = params.worksheetId as string;

  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [answers, setAnswers] = useState<OMRAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // 실제 더미 데이터에서 학습지 정보 로딩
  useEffect(() => {
    const loadWorksheet = async () => {
      setIsLoading(true);
      
      // 실제 더미 데이터에서 학습지 찾기
      setTimeout(() => {
        const foundWorksheet = dummyWorksheets.find(w => w.id === worksheetId);
        
        if (foundWorksheet) {
          setWorksheet(foundWorksheet);
          
          // 답안 배열 초기화 (모든 문제)
          const initialAnswers = foundWorksheet.questions.map((question, i) => ({
            questionNumber: i + 1,
            questionId: question.id,
            questionType: question.type,
            selectedChoice: question.type === 'multiple_choice' ? '' : undefined,
            textAnswer: question.type !== 'multiple_choice' ? '' : undefined
          }));
          setAnswers(initialAnswers);
        }
        setIsLoading(false);
      }, 1000);
    };

    if (worksheetId) {
      loadWorksheet();
    }
  }, [worksheetId]);

  const handleAnswerSelect = (questionIndex: number, choice: string) => {
    setAnswers(prev => 
      prev.map((answer, index) => 
        index === questionIndex 
          ? { ...answer, selectedChoice: choice }
          : answer
      )
    );
  };

  const handleTextAnswerChange = (questionIndex: number, text: string) => {
    setAnswers(prev => 
      prev.map((answer, index) => 
        index === questionIndex 
          ? { ...answer, textAnswer: text }
          : answer
      )
    );
  };

  const handleSubmit = async () => {
    if (!studentName.trim() || !studentNumber.trim()) {
      alert('학생 정보를 모두 입력해주세요.');
      return;
    }

    const unansweredQuestions = getTotalQuestions() - getAnsweredCount();
    if (unansweredQuestions > 0) {
      const confirm = window.confirm(
        `${unansweredQuestions}개의 문제가 미완료입니다. 제출하시겠습니까?`
      );
      if (!confirm) return;
    }

    setIsSubmitting(true);
    
    try {
      const omrCard: OMRCard = {
        id: `omr_${Date.now()}`,
        worksheetId,
        studentName,
        studentNumber,
        answers,
        submittedAt: new Date().toISOString(),
        qrCodeData: worksheetId
      };

      // 실제로는 API로 전송
      console.log('OMR 카드 제출:', omrCard);
      
      // 성공 시 결과 페이지로 이동
      setTimeout(() => {
        alert('제출이 완료되었습니다!');
        router.push(`/omr/${worksheetId}/result`);
      }, 2000);
      
    } catch (error) {
      console.error('제출 실패:', error);
      alert('제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAnsweredCount = () => {
    return answers.filter(answer => {
      if (answer.questionType === 'multiple_choice') {
        return answer.selectedChoice && answer.selectedChoice.trim() !== '';
      } else {
        return answer.textAnswer && answer.textAnswer.trim() !== '';
      }
    }).length;
  };

  const getTotalQuestions = () => {
    return worksheet?.questions.length || 0;
  };

  const getMultipleChoiceQuestions = () => {
    return worksheet?.questions.filter(q => q.type === 'multiple_choice') || [];
  };

  const getMultipleChoiceCount = () => {
    return getMultipleChoiceQuestions().length;
  };

  const getChoiceLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D, E
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">학습지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!worksheet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">학습지를 찾을 수 없습니다.</p>
            <Button onClick={() => router.back()}>돌아가기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">OMR 카드</h1>
                <p className="text-sm text-gray-500">{worksheet.title}</p>
              </div>
            </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">진행률</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {getAnsweredCount()}/{getTotalQuestions()}
                  </p>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 학습지 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>학습지 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label className="text-sm text-gray-500">과목</Label>
                <p className="font-medium">
                  {worksheet.subject === 'math' ? '수학' : 
                   worksheet.subject === 'english' ? '영어' : '국어'}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">전체 문제 수</Label>
                <p className="font-medium">{worksheet.questions.length}문제</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">객관식</Label>
                <p className="font-medium text-blue-600">{getMultipleChoiceCount()}문제</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">주관식</Label>
                <p className="font-medium text-green-600">
                  {worksheet.questions.filter(q => q.type === 'short_answer').length}문제
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">서술형</Label>
                <p className="font-medium text-purple-600">
                  {worksheet.questions.filter(q => q.type === 'essay').length}문제
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">평균 정답률</Label>
                <p className="font-medium">{worksheet.averageCorrectRate}%</p>
              </div>
            </div>
            {worksheet.description && (
              <div>
                <Label className="text-sm text-gray-500">설명</Label>
                <p className="text-gray-700">{worksheet.description}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {worksheet.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 학생 정보 입력 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>학생 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentName">이름</Label>
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="학생 이름을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="studentNumber">학번</Label>
                <Input
                  id="studentNumber"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  placeholder="학번을 입력하세요"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 답안 입력 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Hash className="h-5 w-5" />
              <span>답안 입력</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {worksheet.questions.map((question, questionIndex) => {
                const currentAnswer = answers[questionIndex];
                const hasAnswer = question.type === 'multiple_choice' 
                  ? currentAnswer?.selectedChoice && currentAnswer.selectedChoice.trim() !== ''
                  : currentAnswer?.textAnswer && currentAnswer.textAnswer.trim() !== '';
                
                return (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-lg">
                          {questionIndex + 1}번
                        </span>
                        <Badge 
                          variant={question.type === 'multiple_choice' ? 'default' : 
                                  question.type === 'short_answer' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {question.type === 'multiple_choice' ? '객관식' : 
                           question.type === 'short_answer' ? '주관식' : '서술형'}
                        </Badge>
                      </div>
                      {hasAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    
                    {/* 문제 내용 */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {question.content}
                      </p>
                    </div>
                    
                    {/* 답안 입력 영역 */}
                    <div className="space-y-2">
                      {question.type === 'multiple_choice' && question.choices ? (
                        // 객관식 선택지
                        question.choices.map((choice, choiceIndex) => {
                          const choiceLabel = getChoiceLabel(choiceIndex);
                          const isSelected = currentAnswer?.selectedChoice === choiceLabel;
                          
                          return (
                            <button
                              key={choiceIndex}
                              onClick={() => handleAnswerSelect(questionIndex, choiceLabel)}
                              className={`w-full p-3 text-left rounded border transition-colors ${
                                isSelected 
                                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                {isSelected ? (
                                  <CheckCircle className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <Circle className="h-4 w-4 text-gray-400" />
                                )}
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-sm bg-gray-100 px-2 py-1 rounded">
                                    {choiceLabel}
                                  </span>
                                  <span className="text-sm">{choice}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        // 주관식/서술형 텍스트 입력
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Edit3 className="h-4 w-4" />
                            <span>
                              {question.type === 'short_answer' ? '답안을 입력하세요' : '답안을 서술하세요'}
                            </span>
                          </div>
                          {question.type === 'short_answer' ? (
                            <Input
                              value={currentAnswer?.textAnswer || ''}
                              onChange={(e) => handleTextAnswerChange(questionIndex, e.target.value)}
                              placeholder="답안 입력..."
                              className="w-full"
                            />
                          ) : (
                            <Textarea
                              value={currentAnswer?.textAnswer || ''}
                              onChange={(e) => handleTextAnswerChange(questionIndex, e.target.value)}
                              placeholder="답안을 자세히 서술하세요..."
                              rows={4}
                              className="w-full resize-none"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>완료된 문제: {getAnsweredCount()}/{getTotalQuestions()}</span>
                <span>미완료: {getTotalQuestions() - getAnsweredCount()}문제</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getTotalQuestions() > 0 ? (getAnsweredCount() / getTotalQuestions()) * 100 : 0}%` }}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !studentName.trim() || !studentNumber.trim()}
                className="w-full py-3 text-lg"
                size="lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>제출 중...</span>
                  </div>
                ) : (
                  '제출하기'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

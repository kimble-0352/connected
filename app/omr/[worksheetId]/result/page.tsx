'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, User, ArrowLeft, Download } from 'lucide-react';

export default function OMRResultPage() {
  const params = useParams();
  const router = useRouter();
  const worksheetId = params.worksheetId as string;

  const [submissionData, setSubmissionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제로는 제출된 OMR 데이터를 API에서 가져옴
    setTimeout(() => {
      const mockSubmission = {
        id: 'omr_123456789',
        worksheetTitle: '중간고사 대비 수학 문제집',
        studentName: '김학생',
        studentNumber: '20240001',
        submittedAt: new Date().toISOString(),
        totalQuestions: 20,
        answeredQuestions: 18,
        completionRate: 90
      };
      setSubmissionData(mockSubmission);
      setIsLoading(false);
    }, 1000);
  }, [worksheetId]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">제출 결과를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              돌아가기
            </Button>
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">제출 완료</h1>
              <p className="text-sm text-gray-500">OMR 카드가 성공적으로 제출되었습니다</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 제출 성공 메시지 */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">제출 완료!</h2>
              <p className="text-green-700">
                OMR 카드가 성공적으로 제출되었습니다. 선생님이 채점 후 결과를 확인하실 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 제출 정보 요약 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>제출 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">학습지</label>
                  <p className="font-medium text-gray-900">{submissionData.worksheetTitle}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">제출 ID</label>
                  <p className="font-mono text-sm text-gray-700">{submissionData.id}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">학생 정보</label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{submissionData.studentName}</span>
                    <span className="text-gray-500">({submissionData.studentNumber})</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">제출 시간</label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{formatDateTime(submissionData.submittedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 답안 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>답안 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {submissionData.totalQuestions}
                </div>
                <div className="text-sm text-blue-700">전체 문제</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {submissionData.answeredQuestions}
                </div>
                <div className="text-sm text-green-700">답안 작성</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {submissionData.completionRate}%
                </div>
                <div className="text-sm text-purple-700">완료율</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>진행률</span>
                <span>{submissionData.answeredQuestions}/{submissionData.totalQuestions}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${submissionData.completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 다음 단계 안내 */}
        <Card>
          <CardHeader>
            <CardTitle>다음 단계</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium text-blue-900">채점 대기</p>
                  <p className="text-sm text-blue-700">선생님이 제출된 답안을 검토하고 채점합니다.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium text-green-900">결과 확인</p>
                  <p className="text-sm text-green-700">채점 완료 후 학습 결과와 피드백을 확인할 수 있습니다.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium text-purple-900">오답 노트</p>
                  <p className="text-sm text-purple-700">틀린 문제들로 구성된 오답 노트를 통해 복습할 수 있습니다.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => router.push('/student/home')}
            className="flex-1"
            size="lg"
          >
            학습 홈으로 이동
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push('/student/assignments')}
            className="flex-1"
            size="lg"
          >
            과제 목록 보기
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.print()}
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            제출 확인서 출력
          </Button>
        </div>
      </div>
    </div>
  );
}

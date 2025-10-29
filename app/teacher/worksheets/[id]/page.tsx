'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/ui/stats-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Users, 
  TrendingUp,
  Download,
  Printer,
  Edit,
  Share2,
  Copy,
  Eye,
  Calendar,
  Clock,
  Target,
  FileText,
  QrCode,
  Folder,
  ExternalLink
} from 'lucide-react';
import { 
  useCurrentUser, 
  useWorksheets,
  useAssignments,
  useFolders,
  useAppContext
} from '@/app/lib/contexts/AppContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Link from 'next/link';
import { WorksheetPDFViewer, usePDFActions } from '@/components/ui/worksheet-pdf-viewer';
import { WorksheetFolderChanger } from '@/components/ui/worksheet-folder-changer';
import { QRCodeGenerator } from '@/components/ui/qr-code-generator';

const WorksheetDetailPage = () => {
  const params = useParams();
  const worksheetId = params.id as string;
  const currentUser = useCurrentUser();
  const { state } = useAppContext();
  const worksheets = useWorksheets(currentUser?.id);
  const assignments = useAssignments(currentUser?.id);
  const folders = useFolders(currentUser?.id);
  
  const worksheet = worksheets.find(w => w.id === worksheetId);
  const worksheetAssignments = assignments.filter(a => a.worksheetId === worksheetId);
  
  // PDF 관련 액션들
  const pdfActions = worksheet ? usePDFActions(worksheet) : null;

  // 앱이 초기화되지 않았으면 로딩 표시
  if (!state.isInitialized) {
    return <LoadingSpinner />;
  }

  // 로그인되지 않았으면 로그인 필요 메시지 표시
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

  if (!worksheet) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">학습지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">요청하신 학습지가 존재하지 않거나 삭제되었습니다.</p>
            <Link href="/teacher/worksheets">
              <Button>학습지 목록으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'published': { label: '게시됨', variant: 'default' as const },
      'draft': { label: '임시저장', variant: 'secondary' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <Badge variant={statusInfo?.variant || 'default'}>
        {statusInfo?.label || status}
      </Badge>
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    const colorMap = {
      'low': 'bg-green-500',
      'medium': 'bg-blue-500', 
      'high': 'bg-orange-500',
      'highest': 'bg-red-500'
    };
    return colorMap[difficulty as keyof typeof colorMap] || 'bg-gray-500';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labelMap = {
      'low': '하',
      'medium': '중',
      'high': '상', 
      'highest': '최상'
    };
    return labelMap[difficulty as keyof typeof labelMap] || difficulty;
  };

  const getFolderName = (folderId?: string) => {
    if (!folderId) return '미분류';
    const folder = folders.find(f => f.id === folderId);
    return folder?.name || '미분류';
  };

  const totalAssignedStudents = worksheetAssignments.reduce((sum, assignment) => sum + assignment.studentIds.length, 0);
  const averageCompletionRate = worksheetAssignments.length > 0 
    ? worksheetAssignments.reduce((sum, assignment) => sum + assignment.completionRate, 0) / worksheetAssignments.length
    : 0;

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/teacher/worksheets">
                <Button variant="ghost" size="sm" className="gap-2">
                  ← 목록으로
                </Button>
              </Link>
              {getStatusBadge(worksheet.status)}
              <Badge variant="outline">
                {worksheet.subject === 'math' ? '수학' : 
                 worksheet.subject === 'english' ? '영어' : '국어'}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{worksheet.title}</h1>
            {worksheet.description && (
              <p className="text-muted-foreground text-lg">{worksheet.description}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={pdfActions?.handleOpenPDFInNewWindow}
              disabled={pdfActions?.isOpeningPDF}
            >
              <ExternalLink className="h-4 w-4" />
              {pdfActions?.isOpeningPDF ? '생성 중...' : '미리보기'}
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={pdfActions?.handleDownloadPDF}
              disabled={pdfActions?.isDownloading}
            >
              <Download className="h-4 w-4" />
              {pdfActions?.isDownloading ? '생성 중...' : '다운로드'}
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={pdfActions?.handlePrint}
              disabled={pdfActions?.isPrinting}
            >
              <Printer className="h-4 w-4" />
              {pdfActions?.isPrinting ? '준비 중...' : '인쇄'}
            </Button>
            <Link href={`/teacher/worksheets/${worksheet.id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                편집
              </Button>
            </Link>
            <Link href={`/teacher/assignments/create?worksheetId=${worksheet.id}`}>
              <Button className="gap-2">
                <Users className="h-4 w-4" />
                학생에게 배정
              </Button>
            </Link>
          </div>
        </div>

        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="총 문항 수"
            value={worksheet.totalQuestions}
            icon={FileText}
            variant="gradient"
          />
          <StatsCard
            title="평균 정답률"
            value={`${worksheet.averageCorrectRate}%`}
            icon={Target}
            variant="info"
          />
          <StatsCard
            title="배정된 과제"
            value={worksheetAssignments.length}
            icon={BookOpen}
            variant="success"
          />
          <StatsCard
            title="배정 학생 수"
            value={totalAssignedStudents}
            icon={Users}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 학습지 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>학습지 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">과목</p>
                    <p className="font-medium">
                      {worksheet.subject === 'math' ? '수학' : 
                       worksheet.subject === 'english' ? '영어' : '국어'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">상태</p>
                    <div className="mt-1">
                      {getStatusBadge(worksheet.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">폴더</p>
                    <div className="mt-1">
                      <WorksheetFolderChanger worksheet={worksheet} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">QR 코드</p>
                    <div className="flex items-center gap-2 mt-1">
                      {worksheet.qrCode ? (
                        <>
                          <QrCode className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">활성화됨</span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">비활성화</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">생성일</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(worksheet.createdAt)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">수정일</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(worksheet.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {worksheet.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">태그</p>
                    <div className="flex flex-wrap gap-2">
                      {worksheet.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 난이도 분포 */}
            <Card>
              <CardHeader>
                <CardTitle>난이도 분포</CardTitle>
                <CardDescription>문제별 난이도 구성 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(worksheet.difficultyDistribution).map(([difficulty, count]) => {
                    if (count === 0) return null;
                    const percentage = (count / worksheet.totalQuestions) * 100;
                    
                    return (
                      <div key={difficulty} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getDifficultyColor(difficulty)}`} />
                            <span className="font-medium">{getDifficultyLabel(difficulty)}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {count}문제 ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getDifficultyColor(difficulty)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 문제 목록 */}
            <Card>
              <CardHeader>
                <CardTitle>문제 목록</CardTitle>
                <CardDescription>학습지에 포함된 문제들</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {worksheet.questions.map((question, index) => (
                    <div key={question.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 mb-2">
                          {question.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="text-xs">
                            {getDifficultyLabel(question.difficulty)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {question.type === 'multiple_choice' ? '객관식' : 
                             question.type === 'short_answer' ? '단답형' : '서술형'}
                          </Badge>
                          <span className="text-muted-foreground">
                            정답률 {question.correctRate}%
                          </span>
                          {question.source !== 'internal' && (
                            <Badge variant="outline" className="text-xs">
                              {question.source === 'textbook' ? '교재' : '기출'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 배정된 과제 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">배정된 과제</CardTitle>
                <CardDescription>이 학습지로 만든 과제들</CardDescription>
              </CardHeader>
              <CardContent>
                {worksheetAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {worksheetAssignments.map((assignment) => (
                      <div key={assignment.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {assignment.title}
                          </h4>
                          <Badge variant={assignment.status === 'completed' ? 'secondary' : 'default'} className="text-xs">
                            {assignment.status === 'in_progress' ? '진행중' : 
                             assignment.status === 'completed' ? '완료' : '지연'}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span>배정 학생</span>
                            <span>{assignment.studentIds.length}명</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>완료율</span>
                            <span>{assignment.completionRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>마감일</span>
                            <span>{new Date(assignment.dueDate).toLocaleDateString('ko-KR')}</span>
                          </div>
                        </div>
                        <Link href={`/teacher/assignments/${assignment.id}`} className="block mt-2">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            상세보기
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">배정된 과제가 없습니다</p>
                    <Link href={`/teacher/assignments/create?worksheetId=${worksheet.id}`} className="block mt-3">
                      <Button size="sm" className="text-xs">
                        과제 배정하기
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR 코드 생성 */}
            {worksheet.qrCode && (
              <QRCodeGenerator 
                worksheetId={worksheet.id}
                worksheetTitle={worksheet.title}
              />
            )}

            {/* 빠른 작업 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">빠른 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Copy className="h-4 w-4" />
                  학습지 복사
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                  <Share2 className="h-4 w-4" />
                  다른 선생님과 공유
                </Button>
                <Separator />
                <Link href={`/teacher/assignments/create?worksheetId=${worksheet.id}`} className="block">
                  <Button className="w-full justify-start gap-2" size="sm">
                    <Users className="h-4 w-4" />
                    학생에게 배정
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PDF 생성용 숨겨진 콘텐츠 */}
        <WorksheetPDFViewer worksheet={worksheet} />
      </div>
    </MainLayout>
  );
};

export default WorksheetDetailPage;
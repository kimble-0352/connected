'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Eye, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { OCRResult } from '@/app/types';

interface OCRProgressProps {
  ocrResult?: OCRResult;
  fileName: string;
  onRetry?: () => void;
  onViewResult?: () => void;
  className?: string;
}

export const OCRProgress: React.FC<OCRProgressProps> = ({
  ocrResult,
  fileName,
  onRetry,
  onViewResult,
  className
}) => {
  if (!ocrResult) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">OCR 처리 대기중</h3>
            <p className="text-muted-foreground">
              {fileName}의 OCR 처리가 시작되지 않았습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (ocrResult.status) {
      case 'processing':
        return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (ocrResult.status) {
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">처리중</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">완료</Badge>;
      case 'failed':
        return <Badge variant="destructive">실패</Badge>;
      default:
        return <Badge variant="outline">{ocrResult.status}</Badge>;
    }
  };

  const getProgressValue = () => {
    switch (ocrResult.status) {
      case 'processing':
        return 50; // 처리 중일 때는 50%로 표시
      case 'completed':
        return 100;
      case 'failed':
        return 0;
      default:
        return 0;
    }
  };

  const formatProcessingTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}초`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds}초`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          OCR 처리 상태
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">파일명:</span>
          <span className="text-sm text-muted-foreground truncate max-w-xs">{fileName}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">상태:</span>
          {getStatusBadge()}
        </div>

        {ocrResult.status === 'processing' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>진행률:</span>
              <span>{getProgressValue()}%</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              텍스트를 추출하고 문항을 분석하고 있습니다...
            </p>
          </div>
        )}

        {ocrResult.status === 'completed' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">신뢰도:</span>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={ocrResult.confidence} className="h-2 flex-1" />
                  <span className="font-medium">{ocrResult.confidence}%</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">처리 시간:</span>
                <p className="font-medium mt-1">{formatProcessingTime(ocrResult.processingTime)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">감지된 문항:</span>
                <p className="font-medium mt-1">{ocrResult.detectedQuestions.length}개</p>
              </div>
              <div>
                <span className="text-muted-foreground">처리 완료:</span>
                <p className="font-medium mt-1">
                  {new Date(ocrResult.processedAt).toLocaleString('ko-KR')}
                </p>
              </div>
            </div>

            {ocrResult.extractedText && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">추출된 텍스트 미리보기:</span>
                <div className="mt-2 p-3 bg-muted rounded-lg text-xs">
                  <p className="line-clamp-3">
                    {ocrResult.extractedText.substring(0, 200)}
                    {ocrResult.extractedText.length > 200 && '...'}
                  </p>
                </div>
              </div>
            )}

            {onViewResult && (
              <Button onClick={onViewResult} className="w-full" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                상세 결과 보기
              </Button>
            )}
          </div>
        )}

        {ocrResult.status === 'failed' && (
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">처리 실패</span>
              </div>
              <p className="text-sm text-red-600">
                {ocrResult.error || 'OCR 처리 중 오류가 발생했습니다.'}
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>처리 시간: {formatProcessingTime(ocrResult.processingTime)}</p>
              <p>실패 시각: {new Date(ocrResult.processedAt).toLocaleString('ko-KR')}</p>
            </div>

            {onRetry && (
              <Button onClick={onRetry} className="w-full" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                다시 시도
              </Button>
            )}
          </div>
        )}

        {/* 처리 단계 표시 (처리 중일 때) */}
        {ocrResult.status === 'processing' && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">처리 단계</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>파일 업로드 완료</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                <span>텍스트 추출 중...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                <span>문항 분석 대기</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                <span>메타데이터 생성 대기</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

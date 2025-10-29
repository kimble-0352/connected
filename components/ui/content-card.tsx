'use client';

import React from 'react';
import Link from 'next/link';
import { MoreHorizontal, Eye, Share2, Download, FileText, Image, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ContentItem, Subject } from '@/app/types';

interface ContentCardProps {
  content: ContentItem;
  onShare?: (content: ContentItem) => void;
  onDownload?: (content: ContentItem) => void;
  onDelete?: (content: ContentItem) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onShare,
  onDownload,
  onDelete,
  showActions = true,
  compact = false
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 gap-1">
            <CheckCircle className="h-3 w-3" />
            완료
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 gap-1">
            <Clock className="h-3 w-3" />
            처리중
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            실패
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSharingBadge = (sharingType: string, isPublic: boolean) => {
    if (isPublic) {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">전체 공개</Badge>;
    }
    switch (sharingType) {
      case 'selective':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">선택 공유</Badge>;
      case 'private':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">비공개</Badge>;
      default:
        return <Badge variant="outline">{sharingType}</Badge>;
    }
  };

  const getSubjectName = (subject: Subject) => {
    switch (subject) {
      case 'math': return '수학';
      case 'english': return '영어';
      case 'korean': return '국어';
      default: return subject;
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    if (fileType === 'image') {
      return <Image className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {getFileIcon(content.fileType)}
            <div className="flex-1 min-w-0">
              <Link href={`/teacher/content/${content.id}`}>
                <h3 className="font-medium text-sm hover:text-primary cursor-pointer truncate">
                  {content.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(content.status)}
                <Badge variant="outline" className="text-xs">{getSubjectName(content.metadata.subject)}</Badge>
                <span className="text-xs text-muted-foreground">{content.metadata.questionCount}문항</span>
              </div>
            </div>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    상세 보기
                  </DropdownMenuItem>
                  {onShare && (
                    <DropdownMenuItem onClick={() => onShare(content)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      공유 설정
                    </DropdownMenuItem>
                  )}
                  {onDownload && (
                    <DropdownMenuItem onClick={() => onDownload(content)}>
                      <Download className="h-4 w-4 mr-2" />
                      다운로드
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <Link href={`/teacher/content/${content.id}`}>
                  <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                    {content.title}
                  </h3>
                </Link>
                {content.description && (
                  <p className="text-sm text-muted-foreground">{content.description}</p>
                )}
              </div>
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      상세 보기
                    </DropdownMenuItem>
                    {onShare && (
                      <DropdownMenuItem onClick={() => onShare(content)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        공유 설정
                      </DropdownMenuItem>
                    )}
                    {onDownload && (
                      <DropdownMenuItem onClick={() => onDownload(content)}>
                        <Download className="h-4 w-4 mr-2" />
                        다운로드
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge(content.status)}
              {getSharingBadge(content.sharingSettings.type, content.sharingSettings.isPublic)}
              <Badge variant="outline">{getSubjectName(content.metadata.subject)}</Badge>
              <Badge variant="outline">{content.metadata.grade}</Badge>
              {content.metadata.schoolName && (
                <Badge variant="outline">{content.metadata.schoolName}</Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {getFileIcon(content.fileType)}
                <span>{content.fileName}</span>
              </div>
              <span>크기: {formatFileSize(content.fileSize)}</span>
              <span>문항: {content.metadata.questionCount}개</span>
              <span>업로드: {formatDate(content.createdAt)}</span>
              <span>작성자: {content.teacherName}</span>
            </div>

            {content.status === 'processing' && content.ocrResult && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>OCR 처리 중...</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            )}

            {content.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {content.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 썸네일 (있는 경우) */}
          {content.thumbnailPath && (
            <div className="w-full lg:w-32 h-24 lg:h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={content.thumbnailPath} 
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

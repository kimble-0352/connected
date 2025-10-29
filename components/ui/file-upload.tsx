'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploadProps {
  files: UploadFile[];
  onFilesChange: (files: UploadFile[]) => void;
  onFileRemove: (id: string) => void;
  acceptedFileTypes?: Record<string, string[]>;
  maxFileSize?: number; // bytes
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  onFileRemove,
  acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg']
  },
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  disabled = false,
  className
}) => {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // 거부된 파일들에 대한 에러 처리
    if (rejectedFiles.length > 0) {
      console.warn('Rejected files:', rejectedFiles);
    }

    // 새로운 파일들을 UploadFile 형태로 변환
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending'
    }));

    // 기존 파일들과 합쳐서 최대 개수 제한 적용
    const allFiles = [...files, ...newFiles];
    const limitedFiles = allFiles.slice(0, maxFiles);

    onFilesChange(limitedFiles);
  }, [files, onFilesChange, maxFiles]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxFileSize,
    multiple: true,
    disabled
  });

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: UploadFile['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-xs">대기중</Badge>;
      case 'uploading':
        return <Badge variant="secondary" className="text-xs">업로드중</Badge>;
      case 'completed':
        return <Badge variant="default" className="text-xs bg-green-100 text-green-800">완료</Badge>;
      case 'error':
        return <Badge variant="destructive" className="text-xs">오류</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 드롭존 */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          {
            'border-primary bg-primary/5': isDragActive && !isDragReject,
            'border-destructive bg-destructive/5': isDragReject,
            'border-muted-foreground/25 hover:border-primary/50': !isDragActive && !disabled,
            'border-muted-foreground/10 cursor-not-allowed opacity-50': disabled
          }
        )}
      >
        <input {...getInputProps()} />
        <Upload className={cn(
          'h-12 w-12 mx-auto mb-4',
          isDragActive ? 'text-primary' : 'text-muted-foreground'
        )} />
        
        {isDragReject ? (
          <div>
            <p className="text-lg text-destructive">지원하지 않는 파일 형식입니다</p>
            <p className="text-sm text-muted-foreground">
              PDF, JPG, PNG 파일만 업로드 가능합니다
            </p>
          </div>
        ) : isDragActive ? (
          <p className="text-lg text-primary">파일을 여기에 놓아주세요...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">파일을 드래그하거나 클릭하여 업로드</p>
            <p className="text-sm text-muted-foreground">
              PDF, JPG, PNG 파일 지원 (최대 {formatFileSize(maxFileSize)}, {maxFiles}개까지)
            </p>
          </div>
        )}
      </div>

      {/* 업로드된 파일 목록 */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">업로드된 파일 ({files.length}개)</h4>
            {files.length >= maxFiles && (
              <Badge variant="outline" className="text-xs">
                최대 개수 도달
              </Badge>
            )}
          </div>
          
          {files.map((uploadFile) => (
            <div key={uploadFile.id} className="flex items-center gap-3 p-3 border rounded-lg">
              {getFileIcon(uploadFile.file)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(uploadFile.status)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onFileRemove(uploadFile.id)}
                      disabled={uploadFile.status === 'uploading'}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{formatFileSize(uploadFile.file.size)}</span>
                  <span>{uploadFile.file.type}</span>
                </div>
                
                {uploadFile.status === 'uploading' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>업로드 중...</span>
                      <span>{uploadFile.progress}%</span>
                    </div>
                    <Progress value={uploadFile.progress} className="h-1" />
                  </div>
                )}
                
                {uploadFile.status === 'error' && uploadFile.error && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    <span>{uploadFile.error}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

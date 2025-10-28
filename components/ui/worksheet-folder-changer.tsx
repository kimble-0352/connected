'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  Edit3, 
  Check,
  FolderOpen,
  Loader2
} from 'lucide-react';
import { useFolders, useCurrentUser, useWorksheetActions } from '@/app/lib/contexts/AppContext';
import { Worksheet } from '@/app/types';

interface WorksheetFolderChangerProps {
  worksheet: Worksheet;
  onFolderChange?: (folderId: string | undefined) => void;
}

export const WorksheetFolderChanger: React.FC<WorksheetFolderChangerProps> = ({
  worksheet,
  onFolderChange
}) => {
  const currentUser = useCurrentUser();
  const folders = useFolders(currentUser?.id);
  const { updateWorksheet } = useWorksheetActions();
  const [isChanging, setIsChanging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getCurrentFolderName = () => {
    if (!worksheet.folderId) return '미분류';
    const folder = folders.find(f => f.id === worksheet.folderId);
    return folder?.name || '미분류';
  };

  const handleFolderChange = async (newFolderId: string | undefined) => {
    if (newFolderId === worksheet.folderId) return;
    
    setIsChanging(true);
    
    try {
      // AppContext를 통해 학습지 업데이트
      const updatedWorksheet = updateWorksheet(worksheet.id, { folderId: newFolderId });
      
      if (updatedWorksheet && onFolderChange) {
        onFolderChange(newFolderId);
      }
      
      // 성공 피드백 표시
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
    } catch (error) {
      console.error('폴더 변경 실패:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Folder className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{getCurrentFolderName()}</span>
        {showSuccess && (
          <Check className="h-3 w-3 text-green-600 animate-pulse" />
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 hover:bg-muted"
            disabled={isChanging}
          >
            {isChanging ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Edit3 className="h-3 w-3" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel className="text-xs">폴더 변경</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* 미분류 옵션 */}
          <DropdownMenuItem 
            onClick={() => handleFolderChange(undefined)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <span>미분류</span>
            </div>
            {!worksheet.folderId && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
          
          {folders.length > 0 && <DropdownMenuSeparator />}
          
          {/* 기존 폴더들 */}
          {folders.map((folder) => (
            <DropdownMenuItem 
              key={folder.id}
              onClick={() => handleFolderChange(folder.id)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{folder.name}</span>
              </div>
              {worksheet.folderId === folder.id && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
          
          {folders.length === 0 && (
            <DropdownMenuItem disabled className="text-muted-foreground text-sm">
              생성된 폴더가 없습니다
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

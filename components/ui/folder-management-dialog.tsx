'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  AlertTriangle
} from 'lucide-react';
import { useFolders, useCurrentUser, useFolderActions, useWorksheets } from '@/app/lib/contexts/AppContext';

interface FolderManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EditingFolder {
  id: string;
  name: string;
  isNew?: boolean;
}

export const FolderManagementDialog: React.FC<FolderManagementDialogProps> = ({
  open,
  onOpenChange
}) => {
  const currentUser = useCurrentUser();
  const folders = useFolders(currentUser?.id);
  const worksheets = useWorksheets(currentUser?.id);
  const { createFolder, updateFolder, deleteFolder } = useFolderActions();
  
  const [editingFolder, setEditingFolder] = useState<EditingFolder | null>(null);
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // 새 폴더 생성 시작
  const handleStartCreating = () => {
    setIsCreating(true);
    setNewFolderName('');
  };

  // 새 폴더 생성 취소
  const handleCancelCreating = () => {
    setIsCreating(false);
    setNewFolderName('');
  };

  // 새 폴더 저장
  const handleSaveNewFolder = () => {
    if (!newFolderName.trim() || !currentUser) return;
    
    createFolder(newFolderName.trim(), currentUser.id);
    
    setIsCreating(false);
    setNewFolderName('');
  };

  // 폴더 편집 시작
  const handleStartEditing = (folder: any) => {
    setEditingFolder({
      id: folder.id,
      name: folder.name
    });
  };

  // 폴더 편집 취소
  const handleCancelEditing = () => {
    setEditingFolder(null);
  };

  // 폴더 편집 저장
  const handleSaveEditing = () => {
    if (!editingFolder || !editingFolder.name.trim()) return;
    
    updateFolder(editingFolder.id, { name: editingFolder.name.trim() });
    
    setEditingFolder(null);
  };

  // 폴더 삭제 확인
  const handleConfirmDelete = (folderId: string) => {
    setDeletingFolderId(folderId);
  };

  // 폴더 삭제 실행
  const handleDeleteFolder = () => {
    if (!deletingFolderId) return;
    
    deleteFolder(deletingFolderId);
    
    setDeletingFolderId(null);
  };

  // 폴더 삭제 취소
  const handleCancelDelete = () => {
    setDeletingFolderId(null);
  };

  // 폴더에 속한 학습지 개수 계산
  const getWorksheetCount = (folderId: string) => {
    return worksheets.filter(worksheet => worksheet.folderId === folderId).length;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            폴더 관리
          </DialogTitle>
          <DialogDescription>
            학습지를 체계적으로 관리하기 위한 폴더를 생성하고 편집할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* 새 폴더 생성 */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">새 폴더 만들기</h3>
              {!isCreating && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartCreating}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  폴더 추가
                </Button>
              )}
            </div>

            {isCreating && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="new-folder-name">폴더 이름</Label>
                  <Input
                    id="new-folder-name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="폴더 이름을 입력하세요"
                    className="mt-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveNewFolder();
                      } else if (e.key === 'Escape') {
                        handleCancelCreating();
                      }
                    }}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveNewFolder}
                    disabled={!newFolderName.trim()}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    저장
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelCreating}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    취소
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 기존 폴더 목록 */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">기존 폴더 ({folders.length}개)</h3>
            
            {folders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>생성된 폴더가 없습니다.</p>
                <p className="text-sm">새 폴더를 만들어 학습지를 체계적으로 관리해보세요.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Folder className="h-5 w-5 text-muted-foreground" />
                      
                      {editingFolder?.id === folder.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={editingFolder.name}
                            onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveEditing();
                              } else if (e.key === 'Escape') {
                                handleCancelEditing();
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={handleSaveEditing}
                            disabled={!editingFolder.name.trim()}
                            className="gap-1"
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEditing}
                            className="gap-1"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{folder.name}</p>
                            <p className="text-sm text-muted-foreground">
                              학습지 {getWorksheetCount(folder.id)}개
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              폴더
                            </Badge>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStartEditing(folder)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleConfirmDelete(folder.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 삭제 확인 다이얼로그 */}
          {deletingFolderId && (
            <div className="border border-destructive rounded-lg p-4 bg-destructive/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-destructive mb-1">폴더 삭제 확인</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    이 폴더를 삭제하시겠습니까? 폴더 내의 학습지는 미분류로 이동됩니다.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteFolder}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelDelete}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

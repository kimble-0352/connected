'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Globe, 
  Lock, 
  Users, 
  Eye, 
  Edit, 
  Download, 
  Share2, 
  Plus, 
  X, 
  Search,
  Check
} from 'lucide-react';
import { SharingSettings, SharingType } from '@/app/types';

interface SharingSettingsProps {
  initialSettings: SharingSettings;
  onSettingsChange: (settings: SharingSettings) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

interface Teacher {
  id: string;
  name: string;
  centerName: string;
  subject: string;
}

// 더미 선생님 데이터
const dummyTeachers: Teacher[] = [
  { id: 'teacher-1', name: '김선생', centerName: '서울학원', subject: '수학' },
  { id: 'teacher-2', name: '이선생', centerName: '부산학원', subject: '영어' },
  { id: 'teacher-3', name: '박선생', centerName: '대구학원', subject: '국어' },
  { id: 'teacher-4', name: '최선생', centerName: '서울학원', subject: '수학' },
  { id: 'teacher-5', name: '정선생', centerName: '인천학원', subject: '영어' },
];

export const SharingSettingsComponent: React.FC<SharingSettingsProps> = ({
  initialSettings,
  onSettingsChange,
  onSave,
  isSaving = false
}) => {
  const [settings, setSettings] = useState<SharingSettings>(initialSettings);
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>(
    initialSettings.allowedTeachers || []
  );

  useEffect(() => {
    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  const handleSharingTypeChange = (type: SharingType) => {
    setSettings(prev => ({
      ...prev,
      type,
      isPublic: type === 'public',
      allowedTeachers: type === 'selective' ? prev.allowedTeachers : []
    }));
  };

  const handlePermissionChange = (permission: keyof SharingSettings['permissions'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }));
  };

  const addSelectedTeachers = () => {
    setSettings(prev => ({
      ...prev,
      allowedTeachers: [...new Set([...prev.allowedTeachers, ...selectedTeachers])]
    }));
    setSelectedTeachers([]);
    setIsTeacherDialogOpen(false);
    setTeacherSearch('');
  };

  const removeTeacher = (teacherId: string) => {
    setSettings(prev => ({
      ...prev,
      allowedTeachers: prev.allowedTeachers.filter(id => id !== teacherId)
    }));
  };

  const filteredTeachers = dummyTeachers.filter(teacher => 
    !settings.allowedTeachers.includes(teacher.id) &&
    (teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
     teacher.centerName.toLowerCase().includes(teacherSearch.toLowerCase()) ||
     teacher.subject.toLowerCase().includes(teacherSearch.toLowerCase()))
  );

  const getTeacherById = (id: string) => {
    return dummyTeachers.find(teacher => teacher.id === id);
  };

  const getSharingTypeIcon = (type: SharingType) => {
    switch (type) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'selective':
        return <Users className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
      default:
        return <Lock className="h-4 w-4" />;
    }
  };

  const getSharingTypeDescription = (type: SharingType) => {
    switch (type) {
      case 'public':
        return '모든 선생님이 이 콘텐츠를 볼 수 있습니다.';
      case 'selective':
        return '선택한 선생님들만 이 콘텐츠를 볼 수 있습니다.';
      case 'private':
        return '나만 이 콘텐츠를 볼 수 있습니다.';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 공유 유형 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            공유 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* 비공개 */}
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                settings.type === 'private' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => handleSharingTypeChange('private')}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  settings.type === 'private' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Lock className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">비공개</h4>
                    {settings.type === 'private' && (
                      <Badge variant="default" className="text-xs">선택됨</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">나만 볼 수 있습니다</p>
                </div>
              </div>
            </div>

            {/* 선택 공유 */}
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                settings.type === 'selective' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => handleSharingTypeChange('selective')}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  settings.type === 'selective' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">선택 공유</h4>
                    {settings.type === 'selective' && (
                      <Badge variant="default" className="text-xs">선택됨</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">선택한 선생님들과 공유합니다</p>
                </div>
              </div>
            </div>

            {/* 전체 공개 */}
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                settings.type === 'public' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => handleSharingTypeChange('public')}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  settings.type === 'public' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Globe className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">전체 공개</h4>
                    {settings.type === 'public' && (
                      <Badge variant="default" className="text-xs">선택됨</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">모든 선생님이 볼 수 있습니다</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {getSharingTypeDescription(settings.type)}
          </div>
        </CardContent>
      </Card>

      {/* 선택 공유 대상 */}
      {settings.type === 'selective' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>공유 대상 선생님</CardTitle>
              <Dialog open={isTeacherDialogOpen} onOpenChange={setIsTeacherDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    선생님 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>선생님 선택</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="선생님 이름, 학원명, 과목으로 검색..."
                        value={teacherSearch}
                        onChange={(e) => setTeacherSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {filteredTeachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-lg">
                          <Checkbox
                            id={teacher.id}
                            checked={selectedTeachers.includes(teacher.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTeachers(prev => [...prev, teacher.id]);
                              } else {
                                setSelectedTeachers(prev => prev.filter(id => id !== teacher.id));
                              }
                            }}
                          />
                          <Label htmlFor={teacher.id} className="flex-1 cursor-pointer">
                            <div>
                              <p className="font-medium text-sm">{teacher.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {teacher.centerName} · {teacher.subject}
                              </p>
                            </div>
                          </Label>
                        </div>
                      ))}
                      {filteredTeachers.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          검색 결과가 없습니다.
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsTeacherDialogOpen(false)}>
                        취소
                      </Button>
                      <Button 
                        onClick={addSelectedTeachers}
                        disabled={selectedTeachers.length === 0}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        추가 ({selectedTeachers.length})
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {settings.allowedTeachers.length > 0 ? (
              <div className="space-y-2">
                {settings.allowedTeachers.map((teacherId) => {
                  const teacher = getTeacherById(teacherId);
                  return teacher ? (
                    <div key={teacherId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {teacher.centerName} · {teacher.subject}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTeacher(teacherId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>공유할 선생님을 추가해주세요.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 권한 설정 */}
      {settings.type !== 'private' && (
        <Card>
          <CardHeader>
            <CardTitle>권한 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="canView" className="font-medium">보기 권한</Label>
                    <p className="text-sm text-muted-foreground">콘텐츠를 볼 수 있습니다</p>
                  </div>
                </div>
                <Switch
                  id="canView"
                  checked={settings.permissions.canView}
                  onCheckedChange={(checked) => handlePermissionChange('canView', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="canEdit" className="font-medium">편집 권한</Label>
                    <p className="text-sm text-muted-foreground">콘텐츠를 수정할 수 있습니다</p>
                  </div>
                </div>
                <Switch
                  id="canEdit"
                  checked={settings.permissions.canEdit}
                  onCheckedChange={(checked) => handlePermissionChange('canEdit', checked)}
                  disabled={!settings.permissions.canView}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="canDownload" className="font-medium">다운로드 권한</Label>
                    <p className="text-sm text-muted-foreground">콘텐츠를 다운로드할 수 있습니다</p>
                  </div>
                </div>
                <Switch
                  id="canDownload"
                  checked={settings.permissions.canDownload}
                  onCheckedChange={(checked) => handlePermissionChange('canDownload', checked)}
                  disabled={!settings.permissions.canView}
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              * 보기 권한이 비활성화되면 다른 권한도 자동으로 비활성화됩니다.
            </div>
          </CardContent>
        </Card>
      )}

      {/* 현재 설정 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>설정 요약</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">공유 유형:</span>
            <div className="flex items-center gap-2">
              {getSharingTypeIcon(settings.type)}
              <span className="text-sm">
                {settings.type === 'public' && '전체 공개'}
                {settings.type === 'selective' && '선택 공유'}
                {settings.type === 'private' && '비공개'}
              </span>
            </div>
          </div>

          {settings.type === 'selective' && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">공유 대상:</span>
              <span className="text-sm">{settings.allowedTeachers.length}명</span>
            </div>
          )}

          {settings.type !== 'private' && (
            <>
              <Separator />
              <div className="space-y-2">
                <span className="text-sm font-medium">권한:</span>
                <div className="flex flex-wrap gap-2">
                  {settings.permissions.canView && (
                    <Badge variant="outline" className="text-xs">보기</Badge>
                  )}
                  {settings.permissions.canEdit && (
                    <Badge variant="outline" className="text-xs">편집</Badge>
                  )}
                  {settings.permissions.canDownload && (
                    <Badge variant="outline" className="text-xs">다운로드</Badge>
                  )}
                </div>
              </div>
            </>
          )}

          {settings.sharedAt && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">공유 시작:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(settings.sharedAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 저장 버튼 */}
      {onSave && (
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '설정 저장'}
          </Button>
        </div>
      )}
    </div>
  );
};

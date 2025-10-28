'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  type?: 'folder' | 'file';
  metadata?: Record<string, any>;
}

interface TreeViewProps {
  data: TreeNode[];
  selectedIds: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
  className?: string;
}

interface TreeNodeProps {
  node: TreeNode;
  level: number;
  selectedIds: Set<string>;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onSelectionChange: (id: string, checked: boolean) => void;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  level,
  selectedIds,
  expandedIds,
  onToggleExpand,
  onSelectionChange,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedIds.has(node.id);
  const isFolder = node.type === 'folder' || hasChildren;

  const handleToggleExpand = () => {
    if (hasChildren) {
      onToggleExpand(node.id);
    }
  };

  const handleSelectionChange = (checked: boolean) => {
    onSelectionChange(node.id, checked);
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer',
          isSelected && 'bg-blue-50 border border-blue-200',
          level > 0 && 'ml-4'
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {/* 확장/축소 버튼 */}
        <div className="flex items-center justify-center w-4 h-4">
          {hasChildren && (
            <button
              onClick={handleToggleExpand}
              className="p-0 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-600" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* 체크박스 */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelectionChange}
          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />

        {/* 아이콘 */}
        <div className="flex items-center justify-center w-4 h-4">
          {isFolder ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-600" />
            ) : (
              <Folder className="h-4 w-4 text-blue-600" />
            )
          ) : (
            <File className="h-4 w-4 text-gray-500" />
          )}
        </div>

        {/* 라벨 */}
        <span className={cn(
          'text-sm font-medium flex-1',
          isSelected ? 'text-blue-900' : 'text-gray-700'
        )}>
          {node.label}
        </span>

        {/* 메타데이터 (문제 수 등) */}
        {node.metadata?.count && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {node.metadata.count}개
          </span>
        )}
      </div>

      {/* 자식 노드들 */}
      {hasChildren && isExpanded && (
        <div className="animate-fade-in">
          {node.children?.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              selectedIds={selectedIds}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onSelectionChange={onSelectionChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeView: React.FC<TreeViewProps> = ({
  data,
  selectedIds,
  onSelectionChange,
  className,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleSelectionChange = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    onSelectionChange(newSelected);
  };

  return (
    <div className={cn('space-y-1', className)}>
      {data.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          level={0}
          selectedIds={selectedIds}
          expandedIds={expandedIds}
          onToggleExpand={handleToggleExpand}
          onSelectionChange={handleSelectionChange}
        />
      ))}
    </div>
  );
};


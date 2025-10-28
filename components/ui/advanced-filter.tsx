'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';
import { Select } from './select';
import { 
  Filter,
  Star,
  TrendingUp,
  Target,
  BookOpen,
  Award,
  X
} from 'lucide-react';
import { Difficulty, QuestionSource, Subject } from '@/app/types';

interface AdvancedFilterProps {
  onFilterChange: (filters: AdvancedFilters) => void;
  initialFilters?: Partial<AdvancedFilters>;
}

export interface AdvancedFilters {
  difficulty: Difficulty[];
  sources: QuestionSource[];
  correctRateRange: [number, number];
  tags: string[];
  isHighPerformanceMode: boolean;
  similarityThreshold: number;
}

const defaultFilters: AdvancedFilters = {
  difficulty: [],
  sources: [],
  correctRateRange: [0, 100],
  tags: [],
  isHighPerformanceMode: false,
  similarityThreshold: 80
};

export function AdvancedFilter({ onFilterChange, initialFilters = {} }: AdvancedFilterProps) {
  const [filters, setFilters] = useState<AdvancedFilters>({
    ...defaultFilters,
    ...initialFilters
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: Partial<AdvancedFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const toggleDifficulty = (difficulty: Difficulty) => {
    const newDifficulties = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter(d => d !== difficulty)
      : [...filters.difficulty, difficulty];
    updateFilters({ difficulty: newDifficulties });
  };

  const toggleSource = (source: QuestionSource) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    updateFilters({ sources: newSources });
  };

  const setHighPerformanceMode = (enabled: boolean) => {
    if (enabled) {
      // 상위권 모드: 고난도 문제 위주, 낮은 정답률
      updateFilters({
        isHighPerformanceMode: true,
        difficulty: ['high', 'highest'],
        correctRateRange: [0, 60],
        similarityThreshold: 90
      });
    } else {
      updateFilters({
        isHighPerformanceMode: false,
        difficulty: [],
        correctRateRange: [0, 100],
        similarityThreshold: 80
      });
    }
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = 
    filters.difficulty.length > 0 ||
    filters.sources.length > 0 ||
    filters.correctRateRange[0] > 0 ||
    filters.correctRateRange[1] < 100 ||
    filters.tags.length > 0 ||
    filters.isHighPerformanceMode;

  const getDifficultyLabel = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'low': return '하';
      case 'medium': return '중';
      case 'high': return '상';
      case 'highest': return '최상';
    }
  };

  const getSourceLabel = (source: QuestionSource) => {
    switch (source) {
      case 'internal': return '자체제작';
      case 'textbook': return '교재';
      case 'school_exam': return '학교시험';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="font-medium">고급 필터</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              필터 적용됨
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-3 h-3 mr-1" />
              초기화
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '접기' : '펼치기'}
          </Button>
        </div>
      </div>

      {/* 상위권 특화 모드 */}
      <div className="mb-4">
        <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isHighPerformanceMode}
            onChange={(e) => setHighPerformanceMode(e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-600" />
            <span className="font-medium">상위권 특화 모드</span>
          </div>
          <Badge variant="outline" className="ml-auto">
            고난도 문제 우선
          </Badge>
        </label>
        {filters.isHighPerformanceMode && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">상위권 학습 최적화</span>
            </div>
            <p className="text-yellow-700">
              고난도 문제 위주로 선별하고, 정답률이 낮은 도전적인 문제들을 우선 제공합니다.
            </p>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* 난이도 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              난이도 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {(['low', 'medium', 'high', 'highest'] as Difficulty[]).map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => toggleDifficulty(difficulty)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.difficulty.includes(difficulty)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getDifficultyLabel(difficulty)}
                </button>
              ))}
            </div>
          </div>

          {/* 출처 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              문제 출처
            </label>
            <div className="flex flex-wrap gap-2">
              {(['internal', 'textbook', 'school_exam'] as QuestionSource[]).map(source => (
                <button
                  key={source}
                  onClick={() => toggleSource(source)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.sources.includes(source)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getSourceLabel(source)}
                </button>
              ))}
            </div>
          </div>

          {/* 정답률 범위 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              정답률 범위: {filters.correctRateRange[0]}% - {filters.correctRateRange[1]}%
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.correctRateRange[0]}
                onChange={(e) => updateFilters({
                  correctRateRange: [parseInt(e.target.value), filters.correctRateRange[1]]
                })}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={filters.correctRateRange[1]}
                onChange={(e) => updateFilters({
                  correctRateRange: [filters.correctRateRange[0], parseInt(e.target.value)]
                })}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>어려운 문제</span>
              <span>쉬운 문제</span>
            </div>
          </div>

          {/* 유사도 임계값 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              문제 유사도 임계값: {filters.similarityThreshold}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={filters.similarityThreshold}
              onChange={(e) => updateFilters({ similarityThreshold: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>다양한 문제</span>
              <span>유사한 문제</span>
            </div>
          </div>
        </div>
      )}

      {/* 활성 필터 표시 */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600 mb-2">적용된 필터:</div>
          <div className="flex flex-wrap gap-2">
            {filters.isHighPerformanceMode && (
              <Badge variant="default" className="gap-1">
                <Award className="w-3 h-3" />
                상위권 모드
              </Badge>
            )}
            {filters.difficulty.map(difficulty => (
              <Badge key={difficulty} variant="outline">
                난이도: {getDifficultyLabel(difficulty)}
              </Badge>
            ))}
            {filters.sources.map(source => (
              <Badge key={source} variant="outline">
                출처: {getSourceLabel(source)}
              </Badge>
            ))}
            {(filters.correctRateRange[0] > 0 || filters.correctRateRange[1] < 100) && (
              <Badge variant="outline">
                정답률: {filters.correctRateRange[0]}-{filters.correctRateRange[1]}%
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

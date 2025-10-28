'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown,
  TrendingUp,
  Zap,
  Target,
  Brain,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { analyzeStudentLearningPattern, getAdvancedQuestions } from '@/app/lib/data/dummy-data';

interface AdvancedStudentDashboardProps {
  studentId: string;
  studentStats: {
    averageScore: number;
    isTopTier: boolean;
    recommendedDifficulty: string;
    completionRate: number;
    totalStudyTime: number;
  };
}

export const AdvancedStudentDashboard: React.FC<AdvancedStudentDashboardProps> = ({
  studentId,
  studentStats
}) => {
  const learningPattern = analyzeStudentLearningPattern(studentId);
  const advancedQuestions = getAdvancedQuestions('math', 3);

  if (!studentStats.isTopTier) {
    return null; // 상위권 학생이 아닌 경우 표시하지 않음
  }

  const getPatternInfo = (pattern: string) => {
    switch (pattern) {
      case 'gifted':
        return {
          title: '수학 영재',
          description: '뛰어난 수학적 사고력과 빠른 문제 해결 능력',
          color: 'from-purple-500 to-pink-500',
          icon: Brain,
          badge: '영재'
        };
      case 'high_achiever':
        return {
          title: '고성취자',
          description: '높은 수준의 문제 해결 능력과 안정적인 성과',
          color: 'from-blue-500 to-cyan-500',
          icon: Trophy,
          badge: '우수'
        };
      default:
        return {
          title: '상위권 학습자',
          description: '꾸준한 성장과 발전 가능성이 높은 학습자',
          color: 'from-green-500 to-emerald-500',
          icon: TrendingUp,
          badge: '상위권'
        };
    }
  };

  const patternInfo = getPatternInfo(learningPattern.pattern);
  const PatternIcon = patternInfo.icon;

  return (
    <div className="space-y-6">
      {/* 도전 과제 - 특별한 디자인 */}
      <div className="relative overflow-hidden">
        {/* 배경 그라데이션과 애니메이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/20 via-transparent to-orange-100/20 rounded-xl"></div>
        
        {/* 장식용 요소들 */}
        <div className="absolute top-4 right-4 opacity-10">
          <Crown className="h-16 w-16 text-yellow-600" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-5">
          <Trophy className="h-12 w-12 text-orange-600" />
        </div>
        
        <Card className="relative border-2 border-yellow-200/50 shadow-lg bg-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-pulse opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-full">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent">
                    🎯 도전 과제
                  </CardTitle>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {advancedQuestions.length > 0 ? (
              <div className="space-y-3">
                {advancedQuestions.map((question, index) => (
                  <div key={question.id} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-yellow-50/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative p-4 border-2 border-yellow-200/30 rounded-lg hover:border-yellow-300/50 transition-all duration-300 bg-white/70 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                            최고난도
                          </Badge>
                          {question.tags.includes('상위권') && (
                            <Badge className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">
                              상위권 전용
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2 mb-3 font-medium">
                        {question.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                        </div>
                        <Button 
                          size="sm" 
                          className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <Target className="h-4 w-4" />
                          도전하기
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-100 rounded-full opacity-20 animate-pulse"></div>
                  <Target className="relative h-12 w-12 mx-auto mb-3 text-yellow-600" />
                </div>
                <p className="text-amber-700 font-medium">새로운 도전 과제를 준비 중입니다</p>
                <p className="text-xs text-amber-600 mt-1">곧 특별한 문제들이 도착할 예정입니다! 🚀</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

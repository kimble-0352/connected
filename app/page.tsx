'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/app/lib/contexts/AppContext';
import { dummyUsers } from '@/app/lib/data/dummy-data';
import { BookOpen, Users, QrCode } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    // 앱이 초기화되고 현재 사용자가 설정되어 있으면 해당 역할의 대시보드로 리다이렉트
    if (state.isInitialized && state.currentUser) {
      if (state.currentUser.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/student/home');
      }
    }
  }, [state.isInitialized, state.currentUser, router]);

  const handleLogin = (userId: string) => {
    const user = dummyUsers.find(u => u.id === userId);
    if (user) {
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
    }
  };

  // 앱이 초기화되지 않았거나 로그인된 사용자가 있으면서 리다이렉트 중일 때 로딩 화면 표시
  if (!state.isInitialized || (state.isInitialized && state.currentUser)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{!state.isInitialized ? '앱 초기화 중...' : '로그인 중...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 animate-scale-in">
            <Image 
              src="/logo.png" 
              alt="Connected Logo" 
              width={150} 
              height={150} 
              className="rounded-2xl"
            />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Connected
          </h1>
          <p className="text-xl text-gray-600 mb-3">문제은행 플랫폼</p>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            AI 기반 맞춤형 학습지 제작과 실시간 학습 분석으로 효율적인 내신 대비를 지원합니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 선생님 로그인 */}
          <Card className="group card-hover border-0 bg-white/80 backdrop-blur-sm animate-slide-in-up">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-brand-blue">선생님 로그인</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">데모 계정</p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">김선생</p>
                      <p className="text-sm text-gray-600">하이캠퍼스 강남센터</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full h-12 text-base font-semibold button-hover bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" 
                onClick={() => handleLogin('teacher-1')}
              >
                선생님으로 로그인
              </Button>
            </CardContent>
          </Card>

          {/* 학생 로그인 */}
          <Card className="group card-hover border-0 bg-white/80 backdrop-blur-sm animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-brand-green">학생 로그인</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">데모 계정 선택</p>
                <div className="space-y-3">
                  {dummyUsers.filter(user => user.role === 'student').map((student, index) => (
                    <Button
                      key={student.id}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 border-2 hover:border-green-200 hover:bg-green-50 transition-all duration-200"
                      onClick={() => handleLogin(student.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.memberNumber}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR 코드 스캔 바로가기 */}
        <div className="mt-8 text-center">
          <Card className="inline-block bg-white/60 backdrop-blur-sm border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <QrCode className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-800">OMR 카드 입력</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                학습지 QR 코드를 스캔하여 바로 답안을 입력하세요
              </p>
              <Button 
                variant="outline" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                onClick={() => router.push('/scan')}
              >
                QR 코드 스캔하기
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>실제 서비스에서는 대교 하이캠퍼스 계정으로 로그인합니다.</p>
        </div>
      </div>
    </div>
  );
}

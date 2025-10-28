'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Header, Navigation } from './Navigation';
import { MobileNavigation } from './MobileNavigation';
import { useCurrentUser } from '@/app/lib/contexts/AppContext';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  const currentUser = useCurrentUser();

  // MainLayout은 인증된 사용자만 사용하므로 currentUser가 있다고 가정
  // 각 페이지에서 인증 체크를 먼저 수행함

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {/* 사이드바 - 데스크톱에서만 표시 */}
        <aside className="hidden w-64 min-h-[calc(100vh-4rem)] border-r bg-muted/10 lg:flex">
          <div className="flex flex-col w-full p-4">
            <Navigation />
          </div>
        </aside>
        
        {/* 메인 콘텐츠 */}
        <main className={cn('flex-1 min-h-[calc(100vh-4rem)] pb-16 lg:pb-0', className)}>
          {children}
        </main>
      </div>
      
      {/* 모바일 하단 네비게이션 */}
      <MobileNavigation />
    </div>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Home,
  FileText,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { useCurrentUser, useAppContext } from '@/app/lib/contexts/AppContext';

interface NavigationProps {
  className?: string;
}

const teacherNavItems = [
  {
    title: '대시보드',
    href: '/teacher/dashboard',
    icon: BarChart3
  },
  {
    title: '학습지 관리',
    href: '/teacher/worksheets',
    icon: BookOpen
  },
  {
    title: '과제 관리',
    href: '/teacher/assignments',
    icon: ClipboardList
  },
  {
    title: '학생 관리',
    href: '/teacher/students',
    icon: Users
  }
];

const studentNavItems = [
  {
    title: '홈',
    href: '/student/home',
    icon: Home
  },
  {
    title: '나의 학습지',
    href: '/student/assignments',
    icon: FileText
  },
  {
    title: '리포트',
    href: '/student/reports',
    icon: TrendingUp
  }
];

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const pathname = usePathname();
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const navItems = currentUser.role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <nav className={cn('flex flex-col space-y-2', className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 h-11',
                isActive && 'bg-primary text-primary-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const currentUser = useCurrentUser();
  const { dispatch } = useAppContext();
  const router = useRouter();

  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    router.push('/');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <header className={cn('border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={currentUser.role === 'teacher' ? '/teacher/dashboard' : '/student/home'}>
            <h1 className="text-xl font-bold text-primary">Connected</h1>
          </Link>
          <Badge variant="secondary" className="text-xs">
            {currentUser.role === 'teacher' ? '선생님' : '학생'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <div className="font-medium">{currentUser.name}</div>
            <div className="text-muted-foreground text-xs">{currentUser.centerName}</div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  );
};

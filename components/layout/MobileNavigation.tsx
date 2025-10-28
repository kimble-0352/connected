'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  BookOpen,
  FileText,
  BarChart3,
  Users,
  Settings,
  PlusCircle
} from 'lucide-react';
import { useAppContext } from '@/app/lib/contexts/AppContext';

export const MobileNavigation: React.FC = () => {
  const pathname = usePathname();
  const { state } = useAppContext();
  const currentUser = state.currentUser;

  if (!currentUser) return null;

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const getNavItems = () => {
    if (currentUser.role === 'teacher') {
      return [
        {
          href: '/teacher/dashboard',
          icon: Home,
          label: '대시보드',
          badge: null
        },
        {
          href: '/teacher/worksheets',
          icon: BookOpen,
          label: '학습지',
          badge: null
        },
        {
          href: '/teacher/assignments',
          icon: FileText,
          label: '과제',
          badge: null
        },
        {
          href: '/teacher/students',
          icon: Users,
          label: '학생',
          badge: null
        },
        {
          href: '/teacher/worksheets/create',
          icon: PlusCircle,
          label: '생성',
          badge: null
        }
      ];
    } else {
      // 학생용 네비게이션
      const assignments = state.assignments?.filter(a => a.studentIds.includes(currentUser.id)) || [];
      const inProgressCount = assignments.filter(a => {
        const result = state.learningResults?.find(r => r.assignmentId === a.id && r.studentId === currentUser.id);
        return !result;
      }).length;

      return [
        {
          href: '/student/home',
          icon: Home,
          label: '홈',
          badge: null
        },
        {
          href: '/student/assignments',
          icon: FileText,
          label: '학습지',
          badge: inProgressCount > 0 ? inProgressCount : null
        },
        {
          href: '/student/reports',
          icon: BarChart3,
          label: '리포트',
          badge: null
        }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-inset-bottom md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg transition-colors touch-target
                ${active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

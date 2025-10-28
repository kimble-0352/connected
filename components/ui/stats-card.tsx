import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'info';
  iconColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = 'default',
  iconColor
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'shadow-lg';
      case 'success':
        return 'border-success/20';
      case 'warning':
        return 'border-warning/20';
      case 'info':
        return 'border-info/20';
      default:
        return '';
    }
  };

  const getIconStyles = () => {
    if (iconColor) return iconColor;
    
    switch (variant) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'info':
        return 'text-info bg-info/10';
      default:
        return 'text-brand-blue bg-brand-blue/10';
    }
  };

  return (
    <Card className={cn(
      'relative overflow-hidden animate-fade-in card-hover',
      getVariantStyles(),
      className
    )}>
      {/* 배경 패턴 */}
      <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-5">
        {Icon && <Icon className="w-full h-full" />}
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn(
            'p-2.5 rounded-xl transition-all duration-200',
            getIconStyles()
          )}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {trend && (
          <div className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
            trend.isPositive 
              ? 'bg-success-light text-success' 
              : 'bg-destructive/10 text-destructive'
          )}>
            <span className="text-sm">
              {trend.isPositive ? '↗' : '↘'}
            </span>
            <span>{Math.abs(trend.value)}%</span>
            <span className="opacity-75">전월 대비</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

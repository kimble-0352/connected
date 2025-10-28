/**
 * 디자인 토큰 시스템
 * 일관성 있는 디자인을 위한 재사용 가능한 스타일 가이드
 */

// 색상 팔레트
export const colors = {
  brand: {
    blue: 'var(--brand-blue)',
    blueLight: 'var(--brand-blue-light)',
    blueDark: 'var(--brand-blue-dark)',
    green: 'var(--brand-green)',
    greenLight: 'var(--brand-green-light)',
    greenDark: 'var(--brand-green-dark)',
    orange: 'var(--brand-orange)',
    orangeLight: 'var(--brand-orange-light)',
    orangeDark: 'var(--brand-orange-dark)',
    purple: 'var(--brand-purple)',
    purpleLight: 'var(--brand-purple-light)',
    purpleDark: 'var(--brand-purple-dark)',
  },
  status: {
    success: 'var(--success)',
    successLight: 'var(--success-light)',
    warning: 'var(--warning)',
    warningLight: 'var(--warning-light)',
    info: 'var(--info)',
    infoLight: 'var(--info-light)',
  },
  gradients: {
    primary: 'var(--gradient-primary)',
    success: 'var(--gradient-success)',
    warning: 'var(--gradient-warning)',
    card: 'var(--gradient-card)',
  }
} as const;

// 간격 시스템
export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

// 타이포그래피
export const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  }
} as const;

// 그림자 시스템
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

// 둥근 모서리
export const borderRadius = {
  sm: '0.375rem',   // 6px
  base: '0.5rem',   // 8px
  md: '0.625rem',   // 10px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// 애니메이션 지속시간
export const duration = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

// 이징 함수
export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// 컴포넌트별 스타일 프리셋
export const componentStyles = {
  card: {
    default: 'bg-card border border-border rounded-xl shadow-sm',
    hover: 'card-hover',
    gradient: 'bg-gradient-card border-0 shadow-lg',
  },
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    gradient: 'bg-gradient-primary text-white hover:opacity-90',
    hover: 'button-hover',
  },
  input: {
    default: 'border border-input bg-background px-3 py-2 rounded-md',
    focus: 'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
  },
  badge: {
    default: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    info: 'bg-info-light text-info',
  }
} as const;

// 레이아웃 유틸리티
export const layout = {
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  },
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
  }
} as const;

// 반응형 브레이크포인트
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// 아이콘 크기
export const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  base: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
} as const;

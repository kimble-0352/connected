# 🎨 Connected 디자인 시스템 가이드

## 개요
Connected 프로젝트의 일관성 있는 디자인을 위한 디자인 시스템 가이드입니다.

## 🎯 디자인 원칙

### 1. 일관성 (Consistency)
- 모든 컴포넌트에서 동일한 디자인 토큰 사용
- 통일된 색상, 타이포그래피, 간격 시스템 적용

### 2. 접근성 (Accessibility)
- 충분한 색상 대비 확보
- 키보드 네비게이션 지원
- 스크린 리더 호환성

### 3. 반응형 (Responsive)
- 모바일 우선 디자인
- 다양한 화면 크기 대응

## 🎨 색상 시스템

### 브랜드 색상
```css
--brand-blue: oklch(0.6 0.2 240)      /* 메인 브랜드 색상 */
--brand-green: oklch(0.65 0.15 140)   /* 성공, 완료 상태 */
--brand-orange: oklch(0.75 0.2 60)    /* 경고, 주의 상태 */
--brand-purple: oklch(0.65 0.2 280)   /* 보조 브랜드 색상 */
```

### 상태별 색상
```css
--success: oklch(0.65 0.15 140)       /* 성공 */
--warning: oklch(0.75 0.2 80)         /* 경고 */
--info: oklch(0.65 0.2 220)           /* 정보 */
```

### 사용 예시
```tsx
// CSS 클래스로 사용
<div className="text-brand-blue bg-brand-blue-light">

// StatsCard variant로 사용
<StatsCard variant="success" />
<StatsCard variant="warning" />
<StatsCard variant="info" />
```

## 📏 간격 시스템

```css
xs: 0.5rem    /* 8px  - 작은 여백 */
sm: 0.75rem   /* 12px - 기본 여백 */
md: 1rem      /* 16px - 중간 여백 */
lg: 1.5rem    /* 24px - 큰 여백 */
xl: 2rem      /* 32px - 매우 큰 여백 */
2xl: 3rem     /* 48px - 섹션 간 여백 */
3xl: 4rem     /* 64px - 페이지 간 여백 */
```

## 🔤 타이포그래피

### 폰트 크기
```css
xs: 0.75rem    /* 12px - 캡션, 라벨 */
sm: 0.875rem   /* 14px - 본문 보조 */
base: 1rem     /* 16px - 기본 본문 */
lg: 1.125rem   /* 18px - 부제목 */
xl: 1.25rem    /* 20px - 소제목 */
2xl: 1.5rem    /* 24px - 제목 */
3xl: 1.875rem  /* 30px - 큰 제목 */
4xl: 2.25rem   /* 36px - 페이지 제목 */
5xl: 3rem      /* 48px - 메인 제목 */
```

### 폰트 굵기
```css
normal: 400    /* 일반 텍스트 */
medium: 500    /* 강조 텍스트 */
semibold: 600  /* 부제목 */
bold: 700      /* 제목 */
```

## 🧩 컴포넌트 사용 가이드

### StatsCard
통계 정보를 표시하는 카드 컴포넌트

```tsx
<StatsCard
  title="총 학습지 수"
  value={42}
  description="생성된 학습지"
  icon={BookOpen}
  variant="gradient"  // default | gradient | success | warning | info
  trend={{
    value: 5.2,
    isPositive: true
  }}
/>
```

**Variant 가이드:**
- `default`: 기본 스타일
- `gradient`: 그라데이션 배경 (중요한 지표)
- `success`: 긍정적인 지표 (완료율, 성과 등)
- `warning`: 주의가 필요한 지표 (지연, 미완료 등)
- `info`: 정보성 지표 (총계, 현황 등)

### Button
다양한 스타일의 버튼 컴포넌트

```tsx
<Button variant="default" size="lg">기본 버튼</Button>
<Button variant="gradient">그라데이션 버튼</Button>
<Button variant="success">성공 버튼</Button>
<Button variant="outline" size="sm">아웃라인 버튼</Button>
```

**새로운 Variant:**
- `gradient`: 그라데이션 배경
- `success`: 성공 액션
- `warning`: 경고 액션
- `info`: 정보 액션

**새로운 Size:**
- `xl`: 큰 버튼 (h-12, 주요 액션용)

### Card
컨텐츠를 담는 카드 컴포넌트

```tsx
<Card className="card-hover">  {/* 호버 효과 */}
<Card className="bg-gradient-card">  {/* 그라데이션 배경 */}
```

## 🎭 애니메이션

### 기본 애니메이션
```css
.animate-fade-in      /* 페이드 인 */
.animate-slide-in-up  /* 아래에서 위로 슬라이드 */
.animate-scale-in     /* 스케일 인 */
```

### 호버 효과
```css
.card-hover    /* 카드 호버 효과 */
.button-hover  /* 버튼 호버 효과 */
```

### 사용 예시
```tsx
<div className="animate-fade-in">
  <Card className="card-hover">
    <Button className="button-hover">
```

## 🎨 그라데이션

### 사용 가능한 그라데이션
```css
.bg-gradient-primary   /* 메인 브랜드 그라데이션 */
.bg-gradient-success   /* 성공 그라데이션 */
.bg-gradient-warning   /* 경고 그라데이션 */
.bg-gradient-card      /* 카드 배경 그라데이션 */
```

## 📱 반응형 디자인

### 그리드 시스템
```tsx
{/* 반응형 그리드 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

{/* 간격도 반응형으로 */}
<div className="gap-4 md:gap-6">
```

### 브레이크포인트
```css
sm: 640px   /* 모바일 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 큰 데스크톱 */
```

## 🛠️ 개발 가이드

### 1. 디자인 토큰 사용
```tsx
import { colors, spacing, typography } from '@/lib/design-tokens';

// CSS 변수 직접 사용보다는 토큰 사용 권장
const styles = {
  color: colors.brand.blue,
  padding: spacing.lg,
  fontSize: typography.fontSize.lg,
};
```

### 2. 컴포넌트 확장
새로운 컴포넌트 생성 시 기존 디자인 시스템을 확장:

```tsx
interface MyComponentProps {
  variant?: 'default' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const MyComponent = ({ variant = 'default', size = 'md' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success': return 'bg-success-light text-success';
      case 'warning': return 'bg-warning-light text-warning';
      // ...
    }
  };
  
  return (
    <div className={cn(
      'base-styles',
      getVariantStyles(),
      className
    )}>
      {children}
    </div>
  );
};
```

### 3. 일관성 체크리스트
새로운 컴포넌트나 페이지 개발 시:

- [ ] 브랜드 색상 사용
- [ ] 정의된 간격 시스템 사용
- [ ] 타이포그래피 스케일 준수
- [ ] 호버/포커스 상태 정의
- [ ] 반응형 디자인 적용
- [ ] 애니메이션 일관성 확인
- [ ] 접근성 고려

## 🎯 앞으로의 확장

### 계획된 개선사항
1. **다크 모드 완성**: 모든 컴포넌트의 다크 모드 지원
2. **테마 시스템**: 사용자 정의 테마 지원
3. **고급 애니메이션**: 페이지 전환, 로딩 애니메이션
4. **컴포넌트 라이브러리**: Storybook 도입
5. **접근성 강화**: ARIA 라벨, 키보드 네비게이션

### 새로운 기능 개발 시 고려사항
- 기존 디자인 시스템과의 일관성
- 재사용 가능성
- 성능 최적화
- 접근성 준수

---

이 가이드는 프로젝트가 성장함에 따라 지속적으로 업데이트됩니다.

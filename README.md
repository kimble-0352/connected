# Connected - 문제은행 플랫폼

AI 기반 맞춤형 학습지 제작과 실시간 학습 분석으로 효율적인 내신 대비를 지원하는 교육 플랫폼입니다.

## 주요 기능

### 🎯 선생님 기능
- **학습지 관리**: AI 기반 문제 추천 및 맞춤형 학습지 생성
- **과제 관리**: 학생별 과제 배정 및 진도 관리
- **학생 관리**: 개별 학습 분석 및 성취도 추적
- **QR 코드 생성**: 학습지별 QR 코드 자동 생성

### 📱 학생 기능
- **과제 수행**: 배정받은 학습지 온라인 풀이
- **학습 리포트**: 개인별 학습 분석 및 취약점 파악
- **QR 코드 스캔**: 모바일로 QR 코드 스캔하여 OMR 카드 입력
- **오답 노트**: 틀린 문제 기반 맞춤형 복습

### 🔍 QR 코드 OMR 카드 시스템
- **QR 코드 생성**: 학습지별 고유 QR 코드 자동 생성
- **모바일 스캔**: 카메라를 통한 QR 코드 인식
- **OMR 카드 입력**: 모바일 친화적 답안 마킹 인터페이스
- **실시간 제출**: 답안 입력 후 즉시 제출 및 확인

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **UI Components**: Radix UI, Shadcn/ui
- **QR Code**: react-qr-code, qr-scanner
- **Icons**: Lucide React
- **State Management**: React Context API

## 시작하기

### 필수 요구사항
- Node.js 18.0 이상
- npm, yarn, pnpm 또는 bun

### 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## QR 코드 OMR 카드 사용법

### 선생님
1. 학습지 생성 시 "QR 코드 생성" 옵션 활성화
2. 학습지 상세 페이지에서 QR 코드 확인 및 다운로드
3. 학생들에게 QR 코드 제공 (인쇄물 또는 디지털)

### 학생
1. 모바일 기기로 QR 코드 스캔 (카메라 권한 필요)
2. 자동으로 열리는 OMR 카드 페이지에서 학생 정보 입력
3. 객관식 문제 답안 마킹
4. 제출 버튼으로 답안 전송
5. 제출 완료 확인 및 결과 대기

### 주요 URL
- `/scan`: QR 코드 스캔 페이지
- `/omr/[worksheetId]`: OMR 카드 입력 페이지
- `/omr/[worksheetId]/result`: 제출 완료 페이지

## 프로젝트 구조

```
app/
├── (auth)/                 # 인증 관련 페이지
├── lib/                    # 공통 라이브러리
│   ├── contexts/          # React Context
│   └── data/              # 더미 데이터
├── omr/                   # OMR 카드 관련 페이지
│   └── [worksheetId]/     # 학습지별 OMR 입력
├── scan/                  # QR 코드 스캔 페이지
├── student/               # 학생 전용 페이지
├── teacher/               # 선생님 전용 페이지
└── types/                 # TypeScript 타입 정의

components/
├── features/              # 기능별 컴포넌트
├── layout/                # 레이아웃 컴포넌트
└── ui/                    # 재사용 가능한 UI 컴포넌트
    ├── qr-code-generator.tsx  # QR 코드 생성
    └── qr-code-scanner.tsx    # QR 코드 스캔
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

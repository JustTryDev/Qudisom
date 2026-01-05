# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**Qudisom**은 인형 제작 대행(OEM) 스타트업 플랫폼입니다. 견적 요청부터 제작, 품질 관리, 배송, 배송 추적까지 전체 인형 생산 워크플로우를 관리하는 React + TypeScript 웹 애플리케이션입니다.

## 기술 스택

- **프레임워크**: React 18 + TypeScript
- **라우팅**: React Router DOM
- **스타일링**: Tailwind CSS v4.0 (커스텀 디자인 토큰 포함)
- **UI 컴포넌트**: shadcn/ui 컴포넌트 라이브러리
- **아이콘**: Lucide React
- **애니메이션**: Motion (Framer Motion)
- **폰트**: Noto Sans KR (Google Fonts)
- **백엔드**: Supabase (인증 및 데이터)
- **상태 관리**: React hooks (useState, useEffect, useCallback)
- **드래그 앤 드롭**: react-dnd with HTML5 backend

## 브랜드 가이드라인

- **메인 컬러**: `#fab803` (노란색) - 강조 및 포인트 용도로만 사용, 텍스트에 사용 금지
- **서브 컬러**: `#1a2867` (네이비) - 중요한 UI 요소에 사용
- **타이포그래피**: 가독성을 위해 메인 텍스트는 블랙, 그레이, 화이트 사용
- **디자인 철학**: 토스에서 영감받은 미니멀하고 현대적인 스타트업 감성 - 깔끔하고, 트렌디하며, 친근한 느낌
- **아이콘**: 색상 없는 모노크롬, 미니멀 아이콘 선호

## 아키텍처

### 파일 구조

```
/
├── App.tsx                    # 메인 라우터와 네비게이션
├── [Page].tsx                 # 최상위 페이지 컴포넌트들
├── /components                # 재사용 가능한 UI 컴포넌트
│   ├── /ui                   # shadcn/ui 기본 컴포넌트
│   ├── /figma                # Figma 관련 유틸리티
│   └── [Feature]Component.tsx
├── /data                      # 목 데이터 및 상수
├── /lib                       # 유틸리티 함수
├── /styles                    # 글로벌 CSS 및 Tailwind 설정
│   └── globals.css           # CSS 커스텀 속성
├── /utils                     # 헬퍼 유틸리티
│   ├── /supabase             # Supabase 클라이언트 설정
│   └── three.ts              # Three.js 유틸리티
└── /guidelines                # 개발 가이드라인

```

### 라우팅 패턴

모든 라우트는 `App.tsx`에서 React Router로 정의됩니다. 계층 구조는 다음과 같습니다:

- **Home**: `/` → `MainHeroSection.tsx`
- **Working(Hyunseo)**: 업무 워크플로우 페이지 (19개 라우트)
  - 대시보드, 견적, 주문, 제작, 배송, 재고 등
- **Finished**: 완료된 기능 (5개 라우트)
  - 견적서 표시, 결제, 계약, 배송 정보
- **Final Finished**: 인증 (2개 라우트)
  - 로그인, 회원가입

전체 URL 매핑은 `PROJECT_STRUCTURE.md`를 참조하세요.

### 컴포넌트 패턴

- **페이지 컴포넌트**: 전체 페이지를 나타내는 최상위 `.tsx` 파일
- **기능 컴포넌트**: `/components` 디렉토리에 위치, 기능명으로 시작
- **UI 기본 요소**: `/components/ui` - shadcn/ui에서 가져온 것이므로 직접 수정 금지
- **상태 관리**: 훅을 사용한 로컬 컴포넌트 상태, 전역 상태 라이브러리 없음

### 주요 기능

1. **견적 관리 시스템**:
   - 자동 견적 산출기 (`AutoQuoteCalculator.tsx`)
   - 수동 견적 요청 폼 (`QuoteRequest.tsx`, `new-file.tsx`)
   - AI 기반 추천이 포함된 다단계 견적 폼

2. **대시보드**:
   - 다중 뷰 모드 (그리드, 칸반, 캘린더, 갤러리)
   - 드래그 앤 드롭 정리 기능
   - 샘플 및 본 제작 주문 추적 (13단계 워크플로우)

3. **제작 워크플로우**:
   - 13단계 샘플 제작 파이프라인
   - 10단계 본 제작 파이프라인
   - 진행률 표시줄을 통한 실시간 상태 추적

4. **자재 선택**:
   - 시각적 미리보기가 있는 원단 옵션 (크리스탈 벨벳이 기본/BEST)
   - 라벨 소재 (나일론 페이퍼가 기본)
   - 충전재 옵션 (PP 솜이 기본)
   - KC 인증 처리

5. **파일 관리**:
   - 미리보기 기능이 있는 다중 파일 업로드
   - AI 이미지 생성 통합
   - 캔버스 드로잉이 있는 라벨 위치 편집기

6. **전자 계약**: 디지털 서명 시스템

## 개발 명령어

현재 디렉토리에 `package.json`이 없으므로:

1. **상위 디렉토리**에서 빌드 설정 확인 필요
2. 일반적인 React + Vite 명령어:
   ```bash
   npm run dev          # 개발 서버 시작
   npm run build        # 프로덕션 빌드
   npm run preview      # 프로덕션 빌드 미리보기
   npm run lint         # ESLint 실행
   ```

## 코드 스타일 가이드라인 (guidelines/Guidelines.md 참조)

1. **이중 언어 주석**: 해외 개발자를 위해 한국어와 영어 주석 모두 추가
   ```tsx
   // 견적 요청 폼 (Quote Request Form)
   ```

2. **브랜드 컬러 사용**:
   - 메인 노란색 (`#ffd93d` 또는 `#fab803`)은 강조 용도로만 사용
   - 네이비 (`#1a2867`)는 중요한 UI 요소에 사용
   - 텍스트는 기본적으로 중립색 (블랙, 그레이, 화이트) 사용

3. **UX 우선 접근**: 고객 관점에서 디자인, 사용 편의성 우선

4. **미니멀 아이콘**: Lucide React의 단순하고 단색 아이콘 사용

## 중요한 패턴

### 폼 처리
다단계 폼은 초기 기본값과 함께 상태 관리를 사용합니다:
```tsx
const INITIAL_PRODUCT = {
  fabric: '크리스탈 벨벳',  // BEST 기본값
  filling: 'PP 솜',
  originLabelMaterial: '나일론 페이퍼',
  kcCertification: '불필요(14세 이상)',
  // ...
};
```

### 상태 관리
주문은 제작 단계를 거쳐 상세한 상태를 추적합니다:
- 샘플: 결제부터 배송까지 13단계
- 본 제작: 계약금부터 배송까지 10단계

### 파일 업로드
컴포넌트는 미리보기와 함께 여러 파일 유형을 처리합니다:
- 이미지 (디자인 파일, 참고 자료)
- 문서 (계약서, 사양서)
- AI 생성 변형

## Supabase 통합

- 프로젝트 ID와 익명 키는 `utils/supabase/info.tsx`에 저장
- 인증(로그인/회원가입)에 사용
- 주문 관리를 위한 데이터베이스 쿼리

## 주의사항

1. **색상 변수**: 하드코딩된 값이 아닌 `globals.css`의 CSS 커스텀 속성 사용
2. **반응형 디자인**: 모바일 메뉴는 별도 상태 사용 (`isMobileMenuOpen`)
3. **목 데이터**: 현재 컴포넌트와 `/data` 디렉토리에서 정적 목 데이터 사용 중
4. **인쇄 스타일**: `globals.css`에 특별한 인쇄 미디어 쿼리 정의됨

## 파일 네이밍 규칙

- 페이지: PascalCase (예: `AboutUs.tsx`)
- 컴포넌트: PascalCase (예: `LoginForm.tsx`)
- 유틸리티: camelCase (예: `utils.ts`)
- 스타일: kebab-case (예: `globals.css`)

## 참고사항

- "Working"과 "Finished"로 카테고리화된 진행 중인 작업
- 아직 git 저장소 초기화 안 됨
- 일부 임시 파일 존재 (`temp-*.txt`, `*_backup.tsx`) - 무시 가능
- 메인 네비게이션은 호버 상태가 있는 드롭다운 메뉴 사용

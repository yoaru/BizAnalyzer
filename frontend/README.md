# BizAnalyzer Frontend

AI 기반 사업 아이디어 타당성 분석 서비스 프론트엔드

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **API 통신**: Axios + React Query (@tanstack/react-query)
- **Form Handling**: React Hook Form + Zod

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router 페이지
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   ├── register/
│   ├── ideas/
│   └── reports/
├── components/       # 재사용 가능한 UI 컴포넌트
├── hooks/           # React Query 커스텀 훅
├── services/        # API 통신 서비스
├── store/           # Zustand 상태 관리
├── types/           # TypeScript 타입 정의
├── constants/       # 상수 (API 엔드포인트 등)
└── utils/           # 유틸리티 함수 (Axios 설정 등)
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가:

```
API_BASE_URL=http://localhost:8000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 주요 기능

### 인증
- JWT 기반 인증
- Axios Interceptor를 통한 자동 토큰 첨부
- Refresh Token을 이용한 자동 토큰 갱신
- 로그인/회원가입

### 아이디어 관리
- 아이디어 등록/조회/수정/삭제
- 아이디어 목록 보기

### 분석 프로세스
- 데이터 수집 시작
- AI 분석 실행
- 실시간 진행 상황 폴링

### 보고서
- 종합 타당성 분석 보고서 조회
- SWOT 분석, 시장 분석, 경쟁 분석, 재무 분석, 리스크 평가

## API 통신

### Axios 설정
- `src/utils/axios.ts`: Axios 클라이언트 설정
- 요청 인터셉터: JWT 토큰 자동 첨부
- 응답 인터셉터: 401 에러 시 토큰 갱신 자동 처리

### 서비스 레이어
- `src/services/auth.service.ts`: 인증 관련 API
- `src/services/idea.service.ts`: 아이디어 관련 API
- `src/services/report.service.ts`: 보고서 관련 API
- `src/services/search.service.ts`: 검색 관련 API

### React Query Hooks
- `src/hooks/useAuth.ts`: 인증 관련 훅
- `src/hooks/useIdeas.ts`: 아이디어 관련 훅
- `src/hooks/useReport.ts`: 보고서 관련 훅

## 가이드 문서 준수 사항

본 프로젝트는 다음 가이드 문서를 철저히 준수합니다:

### Frontend 가이드 (frontend.md)
✅ Next.js + TypeScript + TailwindCSS 사용
✅ 함수형 컴포넌트 사용
✅ Props 명확한 타입 정의
✅ API 호출은 services/에서만 수행
✅ hooks에서 useQuery/useMutation으로 래핑
✅ 상태관리는 store/에서 통합 관리
✅ 모든 API 요청은 try-catch로 에러 처리
✅ JWT 토큰은 Axios 인터셉터로 자동 첨부
✅ 토큰 만료 시 자동 갱신 및 로그인 페이지 리다이렉트

### API 설계 가이드 (API 설계.md)
✅ 모든 API는 JWT 기반 인증
✅ Authorization 헤더에 Bearer 토큰 포함
✅ 인증 실패 시 401 Unauthorized 처리
✅ 비동기 처리 (데이터 수집, 분석)
✅ 모듈화된 API 구조
✅ 에러 처리 공통 포맷

### Backend 가이드 (backend.md)
✅ FastAPI 백엔드와 연동
✅ RESTful API 원칙 준수
✅ JWT + Refresh Token 인증
✅ 계층 구조: Router → Service → Repository

## 빌드

```bash
npm run build
```

## 프로덕션 실행

```bash
npm start
```

## 주의사항

- 백엔드 서버가 http://localhost:8000 에서 실행 중이어야 합니다.
- 환경 변수 설정을 확인하세요.
- CORS 설정이 백엔드에 올바르게 되어 있어야 합니다.

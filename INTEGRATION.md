# BizAnalyzer - Frontend & Backend 통합 가이드

## 개요

AI 기반 사업 아이디어 타당성 분석 서비스의 프론트엔드와 백엔드가 완전히 연동되었습니다.

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  Next.js 14 + TypeScript + TailwindCSS + React Query       │
│                    http://localhost:3000                    │
└──────────────────┬──────────────────────────────────────────┘
                   │ REST API (JSON)
                   │ JWT Authentication
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                         Backend                             │
│            FastAPI + Python + PostgreSQL + MongoDB          │
│                    http://localhost:8000                    │
└─────────────────────────────────────────────────────────────┘
```

## 가이드 문서 준수 사항

### ✅ API 설계 가이드 (API 설계.md)

1. **인증/권한 관리**
   - 모든 API는 JWT 기반 인증 (회원가입/로그인 제외)
   - `Authorization: Bearer {JWT_TOKEN}` 헤더 자동 첨부
   - 인증 실패 시 401 Unauthorized 반환
   - Axios Interceptor를 통한 자동 토큰 갱신

2. **API 엔드포인트 구조**
   - ✅ POST /api/v1/ideas - 아이디어 생성
   - ✅ GET /api/v1/ideas/{id} - 아이디어 조회
   - ✅ PATCH /api/v1/ideas/{id} - 아이디어 수정
   - ✅ POST /api/v1/ideas/{id}/collect - 데이터 수집
   - ✅ GET /api/v1/ideas/{id}/collect/status - 수집 상태 조회
   - ✅ POST /api/v1/ideas/{id}/analyze - 분석 실행
   - ✅ GET /api/v1/ideas/{id}/analysis - 분석 결과 조회
   - ✅ POST /api/v1/ideas/{id}/report - 보고서 생성
   - ✅ GET /api/v1/reports/{id} - 보고서 조회

3. **비동기 처리**
   - 데이터 수집: 비동기 작업, 폴링으로 상태 확인
   - 분석 실행: 비동기 작업, 폴링으로 진행 상황 확인

4. **에러 처리**
   - 공통 에러 포맷 사용
   - try-catch로 모든 API 요청 에러 처리
   - 사용자 친화적 에러 메시지 표시

### ✅ Frontend 가이드 (frontend.md)

1. **기술 스택**
   - Framework: Next.js 14 (App Router) ✅
   - Language: TypeScript ✅
   - Styling: TailwindCSS ✅
   - State Management: Zustand ✅
   - API 통신: Axios + React Query ✅

2. **폴더 구조**
   ```
   src/
   ├── app/              # Next.js 페이지
   ├── components/       # 재사용 UI 컴포넌트
   ├── hooks/           # 커스텀 훅
   ├── services/        # API 통신 모듈
   ├── store/           # Zustand 상태관리
   ├── types/           # 타입 정의
   ├── constants/       # 상수
   └── utils/           # 유틸 함수
   ```

3. **개발 규칙 준수**
   - ✅ 모든 컴포넌트는 함수형 컴포넌트
   - ✅ Props는 명확한 타입 정의 (TypeScript interface)
   - ✅ API 호출은 services/에서만 수행
   - ✅ hooks에서 useQuery/useMutation으로 래핑
   - ✅ 상태관리는 store/에서 통합 관리
   - ✅ JWT 토큰은 Axios 인터셉터로 자동 첨부
   - ✅ 토큰 만료 시 로그인 페이지로 리다이렉트

### ✅ Backend 가이드 (backend.md)

1. **아키텍처 구조**
   ```
   src/
   ├── api/v1/
   │   ├── routers/      # FastAPI 라우터
   │   ├── schemas/      # Pydantic 스키마
   │   └── dependencies/ # 의존성 (인증 등)
   ├── core/            # 설정, 보안, JWT
   ├── services/        # 비즈니스 로직
   ├── models/          # ORM 모델
   └── db/              # 데이터베이스 세션
   ```

2. **보안 규칙**
   - ✅ 비밀번호는 bcrypt 해시
   - ✅ 민감 정보는 환경 변수로 관리
   - ✅ CORS 정책 명확히 설정 (localhost:3000 허용)

3. **API 규칙**
   - ✅ RESTful API 원칙 준수
   - ✅ 모든 응답은 JSON
   - ✅ 에러는 공통 포맷 사용

## 실행 방법

### 1. Backend 실행

```bash
cd backend

# 가상환경 활성화
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정 (.env 파일)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bizanalyzer
MONGODB_URL=mongodb://localhost:27017
JWT_SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-api-key

# 서버 실행
python -m src.main
# 또는
uvicorn src.main:app --reload
```

Backend API: http://localhost:8000
API 문서: http://localhost:8000/docs

### 2. Frontend 실행

```bash
cd frontend

# 의존성 설치
npm install

# 환경 변수 설정 (.env.local)
API_BASE_URL=http://localhost:8000

# 개발 서버 실행
npm run dev
```

Frontend: http://localhost:3000

## 주요 기능 흐름

### 1. 사용자 인증

```
[사용자] → [Frontend /login]
         ↓ POST /api/v1/auth/login
         → [Backend Auth Router]
         → [Auth Service]
         → [JWT 토큰 발급]
         ← [access_token, refresh_token]
         ↓ localStorage에 토큰 저장
         ← [Frontend /ideas로 리다이렉트]
```

### 2. 아이디어 등록 및 분석

```
[사용자] → [Frontend /ideas/new]
         ↓ POST /api/v1/ideas
         → [Backend Ideas Router]
         → [Idea Service]
         → [PostgreSQL에 저장]
         ← [idea_id]

         ↓ POST /api/v1/ideas/{id}/collect
         → [데이터 수집 시작 (비동기)]

         ↓ 폴링: GET /api/v1/ideas/{id}/collect/status
         ← [수집 진행 상황]

         ↓ POST /api/v1/ideas/{id}/analyze
         → [AI 분석 시작 (비동기)]

         ↓ 폴링: GET /api/v1/ideas/{id}/analysis
         ← [분석 결과]

         ↓ POST /api/v1/ideas/{id}/report
         → [보고서 생성]

         ← [Frontend /reports/{id}로 이동]
```

### 3. 토큰 자동 갱신

```
[API 요청] → [Axios Interceptor]
           → [Authorization 헤더에 토큰 추가]
           → [Backend API]
           ← [401 Unauthorized]

           ↓ POST /api/v1/auth/refresh
           → [Refresh Token으로 갱신]
           ← [새로운 access_token]

           ↓ localStorage 업데이트
           ↓ 원래 요청 재시도
           → [Backend API]
           ← [성공 응답]
```

## API 테스트

### Swagger UI 접속
http://localhost:8000/docs

### 예시 API 호출

#### 1. 회원가입
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "테스트"
  }'
```

#### 2. 로그인
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 3. 아이디어 생성
```bash
curl -X POST http://localhost:8000/api/v1/ideas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "AI 기반 서비스",
    "problem": "문제 정의",
    "target_customer": "예비 창업자",
    "value_proposition": "자동 분석",
    "revenue_model": "구독",
    "differentiation": "AI 기반"
  }'
```

## 트러블슈팅

### CORS 에러
Backend의 `src/core/config.py`에서 CORS_ORIGINS 확인:
```python
CORS_ORIGINS: list = ["http://localhost:3000"]
```

### 인증 실패
1. 토큰이 올바르게 저장되었는지 확인 (브라우저 개발자 도구 → Application → Local Storage)
2. Backend JWT_SECRET_KEY가 설정되어 있는지 확인

### 데이터베이스 연결 실패
1. PostgreSQL이 실행 중인지 확인
2. MongoDB가 실행 중인지 확인
3. DATABASE_URL과 MONGODB_URL 확인

## 다음 단계

1. **데이터 수집 로직 구현** - 실제 외부 API 연동
2. **AI 분석 엔진 구현** - OpenAI API 활용
3. **보고서 생성 로직 구현** - 템플릿 기반 보고서 생성
4. **검색 기능 구현** - ElasticSearch 연동
5. **UI/UX 개선** - 디자인 시스템 적용
6. **테스트 작성** - 유닛 테스트, 통합 테스트
7. **배포 준비** - Docker, CI/CD 설정

## 참고 문서

- [API 설계 가이드](./가이드%20문서/API%20설계.md)
- [Frontend 가이드](./가이드%20문서/frontend.md)
- [Backend 가이드](./가이드%20문서/backend.md)
- [Database 가이드](./가이드%20문서/database.md)

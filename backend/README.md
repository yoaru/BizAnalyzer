# BizAnalyzer API

AI 기반 사업 아이디어 타당성 분석 서비스 백엔드

## 기술 스택

- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL (메인), MongoDB (비정형 데이터)
- **Cache**: Redis
- **Auth**: JWT (Access + Refresh Token)

## 프로젝트 구조

```
src/
├── api/
│   └── v1/
│       ├── routers/          # API 엔드포인트
│       ├── schemas/          # Pydantic 스키마
│       └── dependencies/     # FastAPI 의존성
├── core/
│   ├── config.py            # 환경 설정
│   ├── security.py          # 보안 유틸리티
│   ├── jwt.py               # JWT 관리
│   └── exceptions.py        # 커스텀 예외
├── services/                 # 비즈니스 로직
├── models/                   # ORM 모델
├── db/
│   └── session.py           # DB 세션 관리
└── main.py                  # 앱 진입점
```

## 설치 및 실행

### 1. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 열어 필요한 값 수정
```

### 2. Docker로 실행 (권장)

```bash
docker-compose up -d
```

### 3. 로컬 실행

```bash
# 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
uvicorn src.main:app --reload

# 서버 실행 중인지 확인 
curl http://localhost:8000/health
```




## API 문서

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 엔드포인트

### 인증 (Auth)
- `POST /api/v1/auth/register` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/refresh` - 토큰 갱신
- `GET /api/v1/auth/me` - 내 정보 조회

### 아이디어 (Ideas)
- `POST /api/v1/ideas` - 아이디어 생성
- `GET /api/v1/ideas` - 아이디어 목록
- `GET /api/v1/ideas/{id}` - 아이디어 상세
- `PATCH /api/v1/ideas/{id}` - 아이디어 수정
- `DELETE /api/v1/ideas/{id}` - 아이디어 삭제

### 데이터 수집 (Collection)
- `POST /api/v1/ideas/{id}/collect` - 수집 시작
- `GET /api/v1/ideas/{id}/collect/status` - 수집 상태

### 분석 (Analysis)
- `POST /api/v1/ideas/{id}/analyze` - 분석 시작
- `GET /api/v1/ideas/{id}/analysis` - 분석 결과

### 보고서 (Reports)
- `POST /api/v1/ideas/{id}/report` - 보고서 생성
- `GET /api/v1/reports/{id}` - 보고서 조회

### 검색 (Search)
- `GET /api/v1/search/competitors` - 경쟁사 검색
- `GET /api/v1/search/market` - 시장 데이터 검색
- `GET /api/v1/search/reviews` - 리뷰 검색
- `GET /api/v1/search/regulations` - 규제 검색
- `GET /api/v1/search/technology` - 기술 트렌드 검색
- `GET /api/v1/search/profitability` - 수익성 검색

## API 흐름

```
1. POST /api/v1/ideas (아이디어 등록)
      ↓
2. POST /api/v1/ideas/{id}/collect (데이터 수집)
      ↓
3. GET /api/v1/ideas/{id}/collect/status (수집 상태 확인)
      ↓
4. POST /api/v1/ideas/{id}/analyze (AI 분석)
      ↓
5. GET /api/v1/ideas/{id}/analysis (분석 결과 조회)
      ↓
6. POST /api/v1/ideas/{id}/report (보고서 생성)
      ↓
7. GET /api/v1/reports/{id} (보고서 조회)
```

## 인증

모든 API (회원가입/로그인 제외)는 JWT 인증이 필요합니다.

```
Authorization: Bearer {ACCESS_TOKEN}
```

## 에러 응답 형식

```json
{
  "success": false,
  "error_code": "ERROR_CODE",
  "message": "에러 메시지",
  "details": {}
}
```

## 라이선스

MIT License

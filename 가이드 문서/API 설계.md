
**클라이언트 → 서버 → 데이터 파이프라인 → 분석 엔진 → 보고서 생성** 


## 🎯 **API 설계 핵심**

- **비동기 처리**  
    데이터 수집과 분석은 시간이 걸리므로 비동기 작업으로 설계.
- **모듈화**  
    아이디어, 수집, 분석, 보고서를 분리해 유지보수성 확보.
- **확장성**  
    새로운 분석 모듈 추가가 쉬움.
- **데이터 파이프라인과 자연스럽게 연결**  
    API 호출이 곧 파이프라인 트리거가 됨.



## 🧱 **API 전체 구조 개요**

API는 크게 5개의 도메인으로 나뉘어.

1. **아이디어 관리 API**
2. **외부 데이터 수집 API**
3. **분석 실행 API**
4. **보고서 API**
5. **검색/조회 API**

이 구조는 확장성, 유지보수성, 모듈화를 모두 고려한 형태야.
## FastAPI 라우팅 구조
app/
 ├── api/
 │    ├── v1/
 │    │    ├── ideas.py
 │    │    ├── users.py
 │    │    └── comments.py
 │    └── v2/
 ├── core/
 ├── models/
 ├── schemas/
 └── services/

 ## 라우터 등록 방식
app.include_router(ideas.router, prefix="/api/v1/ideas", tags=["ideas"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

## 인증/권한 관리
- 모든 API는 JWT 기반 인증이 필요함 (회원가입/로그인 제외)
- 요청 시 HTTP 헤더에 아래와 같이 토큰을 포함해야 함
  - `Authorization: Bearer {JWT_TOKEN}`
- 인증 실패 시 401 Unauthorized 반환

**예시:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

**인증 실패 응답 예시:**
```
HTTP/1.1 401 Unauthorized
{
  "error_code": "UNAUTHORIZED",
  "message": "유효하지 않은 인증 토큰입니다."
}
```

## 서비스 계층 분리  
### ✔ 계층 구조
- Router: HTTP 요청/응답 처리
- Service: 비즈니스 로직
- Repository: DB 접근
- Model: ORM 모델
- Schema: 데이터 검증


## 1️⃣ **아이디어 관리 API (User Input Layer)**

### ✔ POST /api/v1/ideas

사용자가 새로운 사업 아이디어를 제출할 때 사용.

**인증 필요:**
  - Authorization 헤더 필수

Request
{
  "title": "AI 기반 사업 타당성 분석 서비스",
  "problem": "사업 아이디어 검증이 어렵다",
  "target_customer": "예비 창업자",
  "value_proposition": "자동 분석",
  "revenue_model": "구독",
  "differentiation": "AI 기반 자동화",
  "constraints": "초기 자본 적음"
}

**Response**

{ "idea_id": "12345", "status": "created" }

### ✔ GET /api/v1/ideas/{idea_id}

아이디어 상세 조회.

**인증 필요:**
  - Authorization 헤더 필수

### ✔ PATCH /ideas/{idea_id}

아이디어 수정.

**인증 필요:**
  - Authorization 헤더 필수


## 2️⃣ **외부 데이터 수집 API (Data Acquisition Layer)**

### ✔ POST /api/v1/ideas/{idea_id}/collect

해당 아이디어에 필요한 외부 데이터를 자동 수집.

**인증 필요:**
  - Authorization 헤더 필수

Response 
{
  "idea_id": "12345",
  "status": "collecting",
  "tasks": [
    "market_data",
    "competitor_data",
    "customer_insights",
    "regulation_data"
    "technology_trend",
    "profitability_benchmark"
  ]
}

### ✔ GET /api/v1/ideas/{idea_id}/collect/status

수집 진행 상황 조회.

**인증 필요:**
  - Authorization 헤더 필수


## 3️⃣ **분석 실행 API (Analysis Layer)**

### ✔ POST /api/v1/ideas/{idea_id}/analyze

수집된 데이터 기반으로 AI 분석 실행.

**인증 필요:**
  - Authorization 헤더 필수

Response
{
  "idea_id": "12345",
  "status": "analysis_started"
}


### ✔ GET /api/v1/ideas/{idea_id}/analysis

분석 결과 조회.

**인증 필요:**
  - Authorization 헤더 필수

**Response**
{
  "market_score": 82,
  "competition_score": 60,
  "customer_demand_score": 75,
  "financial_score": 68,
  "execution_score": 55,
  "overall_score": 68
}

## 4️⃣ **보고서 API (Output Layer)**

### ✔ POST /api/v1/ideas/{idea_id}/report

최종 보고서 생성 요청.

**인증 필요:**
  - Authorization 헤더 필수

**Response**
{
  "report_id": "r-98765",
  "status": "generating"
}


### ✔ GET /api/v1/reports/{report_id}

보고서 조회.

**인증 필요:**
  - Authorization 헤더 필수

**Response**

{ 
    "report_id": "r-98765", 
    "executive_summary": "...", 
    "swot": { ... }, 
    "market_analysis": { ... }, 
    "competition_analysis": { ... }, 
    "financial_analysis": { ... }, 
    "risk_assessment": { ... }, 
    "recommendation": "Go" 
}


{
  "report_id": "r-98765",
  "executive_summary": "...",
  "swot": { ... },
  "market_analysis": { ... },
  "competition_analysis": { ... },
  "financial_analysis": { ... },
  "risk_assessment": { ... },
  "recommendation": "Go"
}


## 5️⃣ **검색/조회 API (Search Layer)**

### ✔ GET /api/v1/search/competitors?q=키워드

경쟁사 검색.

**인증 필요:**
  - Authorization 헤더 필수

### ✔ GET /api/v1/search/market?q=산업명

시장 데이터 검색.

**인증 필요:**
  - Authorization 헤더 필수

### ✔ GET /api/v1/search/reviews?q=키워드

고객 리뷰 검색.

**인증 필요:**
  - Authorization 헤더 필수

### GET /api/v1/search/regulations?q=산업명
규제 검색 

### GET /api/v1/search/technology?q=키워드
기술 트렌드 검색

### GET /api/v1/search/profitability?q=업종명
수익성 검색

## 🧬 **API 흐름 전체**

1. POST /api/v1/ideas
      ↓
2. POST /api/v1/ideas/{id}/collect
      ↓
3. GET /api/v1/ideas/{id}/collect/status
      ↓
4. POST /api/v1/ideas/{id}/analyze
      ↓
5. GET /api/v1/ideas/{id}/analysis
      ↓
6. POST /api/v1/ideas/{id}/report
      ↓
7. GET /api/v1/reports/{report_id}



## 에러 처리 
// 성공
HTTP/1.1 200 OK
{ ... }

// 실패
HTTP/1.1 400 Bad Request
{
  "error_code": "INVALID_INPUT",
  "message": "입력값이 올바르지 않습니다."
}

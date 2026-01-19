# Backend Development Guide

## 1. 기술 스택
- Runtime: python 
- Framework: FastAPI
- Language: python
- DB ORM: Prisma / TypeORM
- Auth: JWT + Refresh Token

## 2. 아키텍처 구조 예시
src/
├─ api/
│  ├─ v1/
│  │  ├─ routers/
│  │  │  ├─ auth_router.py
│  │  │  ├─ user_router.py
│  │  │  └─ ...
│  │  ├─ controllers/
│  │  │  ├─ auth_controller.py
│  │  │  ├─ user_controller.py
│  │  │  └─ ...
│  │  ├─ schemas/
│  │  │  ├─ auth_schema.py
│  │  │  ├─ user_schema.py
│  │  │  └─ ...
│  │  └─ dependencies/
│  │     ├─ auth_dependency.py
│  │     └─ ...
│  └─ v2/ (필요 시)
│
├─ core/
│  ├─ config.py
│  ├─ security.py
│  ├─ jwt.py
│  ├─ exceptions.py
│  └─ logging.py
│
├─ services/
│  ├─ auth_service.py
│  ├─ user_service.py
│  └─ ...
│
├─ repositories/
│  ├─ user_repository.py
│  ├─ auth_repository.py
│  └─ ...
│
├─ models/
│  ├─ user_model.py
│  ├─ token_model.py
│  └─ ...
│
├─ db/
│  ├─ session.py
│  ├─ base.py
│  └─ migrations/
│
├─ middlewares/
│  ├─ logging_middleware.py
│  └─ error_handler.py
│
├─ utils/
│  ├─ password.py
│  ├─ response.py
│  └─ ...
│
└─ main.py

## 3. API 규칙
- RESTful API 원칙 준수
- 모든 응답은 JSON
- 에러는 공통 포맷 사용

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}

- Swagger / ReDoc 자동 문서화 제공

## 4. 보안 규칙

- 비밀번호는 bcrypt 해시
- 민감 정보는 환경 변수로 관리
- CORS 정책 명확히 설정
  
5. 예시 컨트롤러
from fastapi import APIRouter
from pydantic import BaseModel
from services.auth_service import auth_service

router = APIRouter()

@router.post("/login")
async def login(dto: LoginDto):
    return auth_service.login(dto)




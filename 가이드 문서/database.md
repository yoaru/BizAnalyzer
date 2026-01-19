# Database Guide

## 1. 선택된 DB
- PostgreSQL
- MongoDB
- Search Engine(elastic search)

## 2. 설계 원칙
- 정규화 우선
- ID는 UUID 사용
- Soft Delete 적용 (deleted_at)

## 3. 테이블 네이밍 규칙
- snake_case
- 복수형 사용 (users, orders)

## 4. 예시 ERD
- User (1) — (N) Orders
- Order (1) — (N) OrderItems

## 5. 예시 스키마
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 및 성능 예시
CREATE INDEX idx_users_created_at ON users(created_at);

-- 외래키/제약조건 예시
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 감사/로그 컬럼 예시 (공통)
-- created_at, updated_at, deleted_at 모두 테이블에 포함

-- 데이터 보안 예시
-- 비밀번호는 반드시 해시(SHA-256, bcrypt 등)로 저장
-- 개인정보(예: 주민번호)는 암호화 또는 마스킹 적용

-- 마이그레이션 도구 예시
# Alembic (Python)
# prisma migrate (TypeScript)
# liquibase (Java)

-- 백업/복구 정책 예시
# 매일 자동 백업, 장애 발생 시 1시간 내 복구 목표

-- NoSQL/검색엔진 활용 예시
# MongoDB: AI 분석 결과, 로그, 비정형 데이터 저장
# ElasticSearch: 사업 아이디어/경쟁사/시장 데이터 등 텍스트 검색 고속화

-- ElasticSearch 매핑 예시 (JSON)
{
  "mappings": {
    "properties": {
      "idea_id": {"type": "keyword"},
      "title": {"type": "text"},
      "summary": {"type": "text"},
      "created_at": {"type": "date"}
    }
  }
}


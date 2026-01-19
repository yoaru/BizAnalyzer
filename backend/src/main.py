"""
BizAnalyzer API - Main Application
AI 기반 사업 아이디어 타당성 분석 서비스 백엔드
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from datetime import datetime

from src.core.config import settings
from src.core.exceptions import BaseAPIException
from src.db.session import init_db, MongoDB
from src.api.v1.routers import auth_router, ideas_router, reports_router, search_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 생명주기 관리"""
    # Startup
    print(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    
    # 데이터베이스 초기화
    init_db()
    print("✅ PostgreSQL connected")
    
    # MongoDB 연결
    await MongoDB.connect()
    print("✅ MongoDB connected")
    
    yield
    
    # Shutdown
    await MongoDB.disconnect()
    print("👋 Application shutdown complete")


# FastAPI 앱 생성
app = FastAPI(
    title=settings.APP_NAME,
    description="""
    ## AI 기반 사업 아이디어 타당성 분석 서비스
    
    사업 아이디어를 입력하면 AI가 시장성, 경쟁 환경, 수익성, 리스크를 종합적으로 분석합니다.
    
    ### 주요 기능
    - 📝 **아이디어 관리**: 사업 아이디어 등록 및 관리
    - 📊 **데이터 수집**: 시장, 경쟁사, 고객 데이터 자동 수집
    - 🤖 **AI 분석**: GPT 기반 심층 분석
    - 📑 **보고서 생성**: 종합 타당성 분석 보고서 자동 생성
    """,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 전역 예외 핸들러
@app.exception_handler(BaseAPIException)
async def api_exception_handler(request: Request, exc: BaseAPIException):
    """API 예외 핸들러"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": exc.error_code,
            "message": exc.message,
            "details": exc.details
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """전역 예외 핸들러"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error_code": "INTERNAL_ERROR",
            "message": "서버 내부 오류가 발생했습니다.",
            "details": {"error": str(exc)} if settings.DEBUG else {}
        }
    )


# 라우터 등록
app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["인증"]
)

app.include_router(
    ideas_router,
    prefix="/api/v1/ideas",
    tags=["아이디어"]
)

app.include_router(
    reports_router,
    prefix="/api/v1/reports",
    tags=["보고서"]
)

app.include_router(
    search_router,
    prefix="/api/v1/search",
    tags=["검색"]
)


# 헬스체크 엔드포인트
@app.get("/health", tags=["시스템"])
async def health_check():
    """서버 상태 확인"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/", tags=["시스템"])
async def root():
    """루트 엔드포인트"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )

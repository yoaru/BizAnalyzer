"""
Database Session Management
PostgreSQL 및 MongoDB 연결 관리
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Generator, Optional
from contextlib import contextmanager

from src.core.config import settings


# ============== PostgreSQL ==============
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=settings.DEBUG
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """PostgreSQL 세션 의존성"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_context() -> Generator[Session, None, None]:
    """컨텍스트 매니저로 세션 사용"""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


# ============== MongoDB ==============
class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    
    @classmethod
    async def connect(cls):
        """MongoDB 연결"""
        cls.client = AsyncIOMotorClient(settings.MONGODB_URL)
    
    @classmethod
    async def disconnect(cls):
        """MongoDB 연결 해제"""
        if cls.client:
            cls.client.close()
    
    @classmethod
    def get_database(cls):
        """데이터베이스 인스턴스 반환"""
        if cls.client is None:
            cls.client = AsyncIOMotorClient(settings.MONGODB_URL)
        return cls.client[settings.MONGODB_DB_NAME]
    
    @classmethod
    def get_collection(cls, name: str):
        """컬렉션 인스턴스 반환"""
        return cls.get_database()[name]


async def get_mongodb():
    """MongoDB 의존성"""
    return MongoDB.get_database()


# ============== 초기화 함수 ==============
def init_db():
    """데이터베이스 테이블 생성"""
    Base.metadata.create_all(bind=engine)

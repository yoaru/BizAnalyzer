"""
Idea Model
사업 아이디어 ORM 모델
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import enum

from src.db.session import Base


class IdeaStatus(str, enum.Enum):
    """아이디어 상태"""
    CREATED = "created"
    COLLECTING = "collecting"
    COLLECTED = "collected"
    ANALYZING = "analyzing"
    ANALYZED = "analyzed"
    REPORT_GENERATING = "report_generating"
    COMPLETED = "completed"
    FAILED = "failed"


class IndustryType(str, enum.Enum):
    """산업 분야"""
    TECH = "tech"
    HEALTHCARE = "healthcare"
    FINTECH = "fintech"
    ECOMMERCE = "ecommerce"
    EDUCATION = "education"
    FOOD = "food"
    ENTERTAINMENT = "entertainment"
    REAL_ESTATE = "real_estate"
    MANUFACTURING = "manufacturing"
    OTHER = "other"


class RevenueModel(str, enum.Enum):
    """수익 모델"""
    SUBSCRIPTION = "subscription"
    TRANSACTION = "transaction"
    ADVERTISING = "advertising"
    FREEMIUM = "freemium"
    LICENSING = "licensing"
    SAAS = "saas"
    MARKETPLACE = "marketplace"
    OTHER = "other"


class Idea(Base):
    __tablename__ = "ideas"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Basic Info
    title = Column(String(500), nullable=False)  # 아이디어 제목    
    description = Column(Text, nullable=False) # 아이디어 개요
    problem = Column(Text, nullable=False) # 문제점
    target_customer = Column(Text, nullable=False) # 타겟 고객
    value_proposition = Column(Text, nullable=True) # 가치 제안
    revenue_model = Column(Text, nullable=True) # 수익 모델
    differentiation = Column(Text, nullable=True) # 차별화 요소
    constraints = Column(Text, nullable=True) # 제약 사항
    

    # Classification
    industry = Column(String(50), nullable=True)
    # revenue_model은 위에서 Text로 이미 정의됨
    
    # Status
    status = Column(SQLEnum(IdeaStatus), default=IdeaStatus.CREATED)
    
    # Collected Data (stored as JSON)
    collected_data = Column(JSONB, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="ideas")
    analysis = relationship("Analysis", back_populates="idea", uselist=False)
    reports = relationship("Report", back_populates="idea", lazy="dynamic")
    
    def __repr__(self):
        return f"<Idea {self.title[:30]}...>"
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "title": self.title,
            "description": self.description,
            "problem": self.problem,
            "target_customer": self.target_customer,
            "value_proposition": self.value_proposition,
            "differentiation": self.differentiation,
            "constraints": self.constraints,
            "industry": self.industry,
            "revenue_model": self.revenue_model,
            "status": self.status.value,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

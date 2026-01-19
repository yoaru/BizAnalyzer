"""
Analysis Model
분석 결과 ORM 모델
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import enum

from src.db.session import Base


class AnalysisStatus(str, enum.Enum):
    """분석 상태"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    idea_id = Column(UUID(as_uuid=True), ForeignKey("ideas.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Status
    status = Column(SQLEnum(AnalysisStatus), default=AnalysisStatus.PENDING)
    
    # Scores (0-100)
    market_score = Column(Integer, nullable=True)
    competition_score = Column(Integer, nullable=True)
    customer_demand_score = Column(Integer, nullable=True)
    financial_score = Column(Integer, nullable=True)
    execution_score = Column(Integer, nullable=True)
    risk_score = Column(Integer, nullable=True)
    overall_score = Column(Integer, nullable=True)
    
    # Detailed Analysis (stored as JSON)
    market_analysis = Column(JSONB, nullable=True)
    competition_analysis = Column(JSONB, nullable=True)
    customer_analysis = Column(JSONB, nullable=True)
    financial_analysis = Column(JSONB, nullable=True)
    risk_analysis = Column(JSONB, nullable=True)
    swot_analysis = Column(JSONB, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    idea = relationship("Idea", back_populates="analysis")
    
    def __repr__(self):
        return f"<Analysis for Idea {self.idea_id}>"
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "idea_id": str(self.idea_id),
            "status": self.status.value,
            "market_score": self.market_score,
            "competition_score": self.competition_score,
            "customer_demand_score": self.customer_demand_score,
            "financial_score": self.financial_score,
            "execution_score": self.execution_score,
            "risk_score": self.risk_score,
            "overall_score": self.overall_score,
            "market_analysis": self.market_analysis,
            "competition_analysis": self.competition_analysis,
            "customer_analysis": self.customer_analysis,
            "financial_analysis": self.financial_analysis,
            "risk_analysis": self.risk_analysis,
            "swot_analysis": self.swot_analysis,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }
    
    def get_scores(self):
        """점수만 반환"""
        return {
            "market_score": self.market_score,
            "competition_score": self.competition_score,
            "customer_demand_score": self.customer_demand_score,
            "financial_score": self.financial_score,
            "execution_score": self.execution_score,
            "risk_score": self.risk_score,
            "overall_score": self.overall_score
        }

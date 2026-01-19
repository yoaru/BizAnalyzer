"""
Report Model
보고서 ORM 모델
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import enum

from src.db.session import Base


class ReportStatus(str, enum.Enum):
    """보고서 상태"""
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"


class ReportType(str, enum.Enum):
    """보고서 유형"""
    BASIC = "basic"
    DETAILED = "detailed"
    EXECUTIVE = "executive"


class Report(Base):
    __tablename__ = "reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    idea_id = Column(UUID(as_uuid=True), ForeignKey("ideas.id", ondelete="CASCADE"), nullable=False)
    
    # Status & Type
    status = Column(SQLEnum(ReportStatus), default=ReportStatus.GENERATING)
    report_type = Column(SQLEnum(ReportType), default=ReportType.BASIC)
    
    # Content
    executive_summary = Column(Text, nullable=True)
    recommendation = Column(String(50), nullable=True)  # Go / No-Go / Conditional
    
    # Detailed Sections (stored as JSON)
    swot = Column(JSONB, nullable=True)
    market_analysis = Column(JSONB, nullable=True)
    competition_analysis = Column(JSONB, nullable=True)
    financial_analysis = Column(JSONB, nullable=True)
    risk_assessment = Column(JSONB, nullable=True)
    action_items = Column(JSONB, nullable=True)
    key_insights = Column(JSONB, nullable=True)
    
    # File
    pdf_url = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    idea = relationship("Idea", back_populates="reports")
    
    def __repr__(self):
        return f"<Report {self.id} for Idea {self.idea_id}>"
    
    def to_dict(self):
        return {
            "report_id": str(self.id),
            "idea_id": str(self.idea_id),
            "status": self.status.value,
            "report_type": self.report_type.value,
            "executive_summary": self.executive_summary,
            "recommendation": self.recommendation,
            "swot": self.swot,
            "market_analysis": self.market_analysis,
            "competition_analysis": self.competition_analysis,
            "financial_analysis": self.financial_analysis,
            "risk_assessment": self.risk_assessment,
            "action_items": self.action_items,
            "key_insights": self.key_insights,
            "pdf_url": self.pdf_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None
        }

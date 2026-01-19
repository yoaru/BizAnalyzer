"""
Report Schemas
보고서 관련 요청/응답 스키마
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum


class ReportType(str, Enum):
    BASIC = "basic"
    DETAILED = "detailed"
    EXECUTIVE = "executive"


class ReportStatus(str, Enum):
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"


class CreateReportRequest(BaseModel):
    """보고서 생성 요청"""
    report_type: Optional[ReportType] = ReportType.BASIC


class ReportGenerateResponse(BaseModel):
    """보고서 생성 시작 응답"""
    report_id: str
    idea_id: str
    status: str


class ActionItem(BaseModel):
    """실행 항목"""
    title: str
    description: str
    timeline: str
    priority: Optional[str] = "medium"


class SWOTSection(BaseModel):
    """SWOT 섹션"""
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]


class MarketAnalysisSection(BaseModel):
    """시장 분석 섹션"""
    tam: str
    sam: str
    som: str
    cagr: str
    market_trends: List[str]
    target_segments: List[str]


class CompetitionAnalysisSection(BaseModel):
    """경쟁 분석 섹션"""
    direct_competitors: List[Dict[str, Any]]
    indirect_competitors: List[Dict[str, Any]]
    competitive_advantages: List[str]
    market_position: str


class FinancialAnalysisSection(BaseModel):
    """재무 분석 섹션"""
    initial_investment: str
    monthly_costs: str
    break_even_period: str
    revenue_projections: List[Dict[str, Any]]
    profitability_index: float


class RiskAssessmentSection(BaseModel):
    """리스크 평가 섹션"""
    high_risks: List[Dict[str, str]]
    medium_risks: List[Dict[str, str]]
    low_risks: List[Dict[str, str]]
    mitigation_strategies: List[str]


class ReportResponse(BaseModel):
    """보고서 응답"""
    report_id: str
    idea_id: str
    status: str
    report_type: str
    executive_summary: Optional[str]
    recommendation: Optional[str]
    swot: Optional[SWOTSection]
    market_analysis: Optional[MarketAnalysisSection]
    competition_analysis: Optional[CompetitionAnalysisSection]
    financial_analysis: Optional[FinancialAnalysisSection]
    risk_assessment: Optional[RiskAssessmentSection]
    action_items: Optional[List[ActionItem]]
    key_insights: Optional[List[str]]
    pdf_url: Optional[str]
    created_at: Optional[str]
    completed_at: Optional[str]
    
    class Config:
        from_attributes = True


class ReportListResponse(BaseModel):
    """보고서 목록 응답"""
    reports: List[ReportResponse]
    total: int

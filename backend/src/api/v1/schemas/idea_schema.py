"""
Idea Schemas
아이디어 관련 요청/응답 스키마
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime


class IndustryType(str, Enum):
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


class RevenueModelType(str, Enum):
    SUBSCRIPTION = "subscription"
    TRANSACTION = "transaction"
    ADVERTISING = "advertising"
    FREEMIUM = "freemium"
    LICENSING = "licensing"
    SAAS = "saas"
    MARKETPLACE = "marketplace"
    OTHER = "other"


class IdeaStatus(str, Enum):
    CREATED = "created"
    COLLECTING = "collecting"
    COLLECTED = "collected"
    ANALYZING = "analyzing"
    ANALYZED = "analyzed"
    REPORT_GENERATING = "report_generating"
    COMPLETED = "completed"
    FAILED = "failed"


class CreateIdeaRequest(BaseModel):
    """아이디어 생성 요청"""
    title: str = Field(..., min_length=1, max_length=500)
    description: str = Field(..., min_length=3)
    problem: str = Field(..., min_length=3)
    target_customer: str = Field(..., min_length=1)
    value_proposition: Optional[str] = None
    revenue_model: Optional[str] = None
    differentiation: Optional[str] = None
    constraints: Optional[str] = None
    industry: Optional[IndustryType] = None


class UpdateIdeaRequest(BaseModel):
    """아이디어 수정 요청"""
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = Field(None, min_length=3)
    problem: Optional[str] = Field(None, min_length=3)
    target_customer: Optional[str] = Field(None, min_length=1)
    value_proposition: Optional[str] = None
    revenue_model: Optional[str] = None
    differentiation: Optional[str] = None
    constraints: Optional[str] = None
    industry: Optional[IndustryType] = None


class IdeaResponse(BaseModel):
    """아이디어 응답"""
    id: str
    user_id: str
    title: str
    description: str
    problem: str
    target_customer: str
    value_proposition: Optional[str]
    differentiation: Optional[str]
    constraints: Optional[str]
    industry: Optional[str]
    revenue_model: Optional[str]
    status: str
    created_at: Optional[str]
    updated_at: Optional[str]
    
    class Config:
        from_attributes = True


class IdeaCreateResponse(BaseModel):
    """아이디어 생성 응답"""
    idea_id: str
    status: str


class IdeaListResponse(BaseModel):
    """아이디어 목록 응답"""
    ideas: List[IdeaResponse]
    total: int
    page: int
    page_size: int


# ============== 데이터 수집 관련 ==============

class CollectDataResponse(BaseModel):
    """데이터 수집 시작 응답"""
    idea_id: str
    status: str
    tasks: List[str]


class CollectStatusResponse(BaseModel):
    """데이터 수집 상태 응답"""
    idea_id: str
    status: str
    progress: int  # 0-100
    completed_tasks: List[str]
    pending_tasks: List[str]
    failed_tasks: List[str]


# ============== 분석 관련 ==============

class AnalyzeResponse(BaseModel):
    """분석 시작 응답"""
    idea_id: str
    status: str


class AnalysisScores(BaseModel):
    """분석 점수"""
    market_score: int
    competition_score: int
    customer_demand_score: int
    financial_score: int
    execution_score: int
    risk_score: int
    overall_score: int


class SWOTAnalysis(BaseModel):
    """SWOT 분석"""
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]


class MarketAnalysis(BaseModel):
    """시장 분석"""
    tam: str
    sam: str
    som: str
    cagr: str
    trends: List[str]


class AnalysisResultResponse(BaseModel):
    """분석 결과 응답"""
    idea_id: str
    status: str
    scores: Optional[AnalysisScores]
    swot: Optional[SWOTAnalysis]
    market: Optional[MarketAnalysis]
    key_insights: Optional[List[str]]
    risks: Optional[List[str]]
    recommendation: Optional[str]
    created_at: Optional[str]
    completed_at: Optional[str]

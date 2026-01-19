"""
Search Schemas
검색 관련 요청/응답 스키마
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class SearchQuery(BaseModel):
    """검색 쿼리"""
    q: str = Field(..., min_length=1, max_length=200)
    limit: Optional[int] = Field(10, ge=1, le=100)
    offset: Optional[int] = Field(0, ge=0)


class CompetitorResult(BaseModel):
    """경쟁사 검색 결과"""
    name: str
    description: str
    website: Optional[str]
    market_share: Optional[str]
    strengths: List[str]
    weaknesses: List[str]


class MarketResult(BaseModel):
    """시장 데이터 검색 결과"""
    industry: str
    market_size: str
    growth_rate: str
    key_players: List[str]
    trends: List[str]
    source: str


class ReviewResult(BaseModel):
    """고객 리뷰 검색 결과"""
    source: str
    rating: float
    content: str
    sentiment: str  # positive, negative, neutral
    keywords: List[str]


class RegulationResult(BaseModel):
    """규제 검색 결과"""
    title: str
    description: str
    authority: str
    requirements: List[str]
    penalties: Optional[str]
    effective_date: Optional[str]


class TechnologyResult(BaseModel):
    """기술 트렌드 검색 결과"""
    technology: str
    description: str
    adoption_rate: str
    key_players: List[str]
    future_outlook: str


class ProfitabilityResult(BaseModel):
    """수익성 검색 결과"""
    industry: str
    average_margin: str
    roi_benchmark: str
    cost_structure: Dict[str, str]
    success_factors: List[str]


class SearchResponse(BaseModel):
    """검색 응답 (공통)"""
    query: str
    total: int
    results: List[Dict[str, Any]]


class CompetitorSearchResponse(BaseModel):
    """경쟁사 검색 응답"""
    query: str
    total: int
    results: List[CompetitorResult]


class MarketSearchResponse(BaseModel):
    """시장 데이터 검색 응답"""
    query: str
    total: int
    results: List[MarketResult]


class ReviewSearchResponse(BaseModel):
    """리뷰 검색 응답"""
    query: str
    total: int
    results: List[ReviewResult]


class RegulationSearchResponse(BaseModel):
    """규제 검색 응답"""
    query: str
    total: int
    results: List[RegulationResult]


class TechnologySearchResponse(BaseModel):
    """기술 트렌드 검색 응답"""
    query: str
    total: int
    results: List[TechnologyResult]


class ProfitabilitySearchResponse(BaseModel):
    """수익성 검색 응답"""
    query: str
    total: int
    results: List[ProfitabilityResult]

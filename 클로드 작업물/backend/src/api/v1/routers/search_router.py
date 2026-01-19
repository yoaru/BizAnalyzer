"""
Search Router
검색 관련 API 엔드포인트
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.api.v1.schemas import (
    CompetitorSearchResponse,
    MarketSearchResponse,
    ReviewSearchResponse,
    RegulationSearchResponse,
    TechnologySearchResponse,
    ProfitabilitySearchResponse
)
from src.api.v1.dependencies import get_current_user
from src.models.user_model import User

router = APIRouter()


# TODO: 실제 구현에서는 외부 API나 데이터베이스 검색 로직 추가
# 현재는 시뮬레이션 데이터 반환


@router.get(
    "/competitors",
    response_model=CompetitorSearchResponse,
    summary="경쟁사 검색",
    description="키워드로 경쟁사를 검색합니다."
)
async def search_competitors(
    q: str = Query(..., min_length=1, max_length=200),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """경쟁사 검색"""
    # 시뮬레이션 데이터
    results = [
        {
            "name": f"{q} 관련 경쟁사 A",
            "description": "시장 선두 기업으로 강력한 브랜드 인지도 보유",
            "website": "https://example-a.com",
            "market_share": "35%",
            "strengths": ["브랜드 인지도", "대규모 사용자 기반", "기술력"],
            "weaknesses": ["높은 가격", "느린 혁신 속도"]
        },
        {
            "name": f"{q} 관련 경쟁사 B",
            "description": "빠르게 성장하는 스타트업",
            "website": "https://example-b.com",
            "market_share": "15%",
            "strengths": ["혁신적 기술", "합리적 가격"],
            "weaknesses": ["낮은 브랜드 인지도", "제한된 리소스"]
        }
    ]
    
    return CompetitorSearchResponse(
        query=q,
        total=len(results),
        results=results[:limit]
    )


@router.get(
    "/market",
    response_model=MarketSearchResponse,
    summary="시장 데이터 검색",
    description="산업명으로 시장 데이터를 검색합니다."
)
async def search_market(
    q: str = Query(..., min_length=1, max_length=200),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """시장 데이터 검색"""
    results = [
        {
            "industry": q,
            "market_size": "₩15조",
            "growth_rate": "12.5%",
            "key_players": ["기업 A", "기업 B", "기업 C"],
            "trends": ["디지털 전환", "AI 도입", "구독 모델 확산"],
            "source": "산업연구원"
        }
    ]
    
    return MarketSearchResponse(
        query=q,
        total=len(results),
        results=results[:limit]
    )


@router.get(
    "/reviews",
    response_model=ReviewSearchResponse,
    summary="고객 리뷰 검색",
    description="키워드로 관련 고객 리뷰를 검색합니다."
)
async def search_reviews(
    q: str = Query(..., min_length=1, max_length=200),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """고객 리뷰 검색"""
    results = [
        {
            "source": "앱스토어",
            "rating": 4.5,
            "content": f"{q} 서비스가 정말 유용합니다. 사용하기 편리하고 결과가 정확해요.",
            "sentiment": "positive",
            "keywords": ["유용함", "편리함", "정확함"]
        },
        {
            "source": "구글플레이",
            "rating": 3.0,
            "content": "기능은 좋은데 가격이 좀 비싸요.",
            "sentiment": "neutral",
            "keywords": ["기능", "가격"]
        }
    ]
    
    return ReviewSearchResponse(
        query=q,
        total=len(results),
        results=results[:limit]
    )


@router.get(
    "/regulations",
    response_model=RegulationSearchResponse,
    summary="규제 검색",
    description="산업명으로 관련 규제를 검색합니다."
)
async def search_regulations(
    q: str = Query(..., min_length=1, max_length=200),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """규제 검색"""
    results = [
        {
            "title": f"{q} 산업 관련 규제",
            "description": "해당 산업에서 준수해야 할 주요 규제 사항입니다.",
            "authority": "관계부처",
            "requirements": ["인허가 취득", "정기 보고", "안전 기준 준수"],
            "penalties": "위반 시 과태료 부과",
            "effective_date": "2024-01-01"
        }
    ]
    
    return RegulationSearchResponse(
        query=q,
        total=len(results),
        results=results[:limit]
    )


@router.get(
    "/technology",
    response_model=TechnologySearchResponse,
    summary="기술 트렌드 검색",
    description="키워드로 기술 트렌드를 검색합니다."
)
async def search_technology(
    q: str = Query(..., min_length=1, max_length=200),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """기술 트렌드 검색"""
    results = [
        {
            "technology": q,
            "description": f"{q} 기술은 현재 빠르게 발전하고 있으며, 다양한 산업에 적용되고 있습니다.",
            "adoption_rate": "35%",
            "key_players": ["OpenAI", "Google", "Microsoft"],
            "future_outlook": "향후 5년간 시장 규모 3배 성장 예상"
        }
    ]
    
    return TechnologySearchResponse(
        query=q,
        total=len(results),
        results=results[:limit]
    )


@router.get(
    "/profitability",
    response_model=ProfitabilitySearchResponse,
    summary="수익성 검색",
    description="업종명으로 수익성 벤치마크를 검색합니다."
)
async def search_profitability(
    q: str = Query(..., min_length=1, max_length=200),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """수익성 검색"""
    results = [
        {
            "industry": q,
            "average_margin": "15-25%",
            "roi_benchmark": "18%",
            "cost_structure": {
                "인건비": "40%",
                "마케팅": "20%",
                "인프라": "15%",
                "기타": "25%"
            },
            "success_factors": ["고객 획득 비용 최적화", "리텐션 향상", "운영 효율화"]
        }
    ]
    
    return ProfitabilitySearchResponse(
        query=q,
        total=len(results),
        results=results[:limit]
    )

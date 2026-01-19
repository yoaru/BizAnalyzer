"""
Ideas Router
아이디어 관련 API 엔드포인트
"""
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from uuid import UUID

from src.db.session import get_db
from src.services.idea_service import get_idea_service
from src.services.analysis_service import get_analysis_service
from src.services.report_service import get_report_service
from src.api.v1.schemas import (
    CreateIdeaRequest,
    UpdateIdeaRequest,
    IdeaResponse,
    IdeaCreateResponse,
    IdeaListResponse,
    CollectDataResponse,
    CollectStatusResponse,
    AnalyzeResponse,
    AnalysisResultResponse,
    CreateReportRequest,
    ReportGenerateResponse,
    SuccessResponse
)
from src.api.v1.dependencies import get_current_user
from src.models.user_model import User

router = APIRouter()


# ============== 아이디어 CRUD ==============

@router.post(
    "",
    response_model=IdeaCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="아이디어 생성",
    description="새로운 사업 아이디어를 등록합니다."
)
async def create_idea(
    request: CreateIdeaRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """아이디어 생성"""
    idea_service = get_idea_service(db)
    return idea_service.create_idea(request, current_user)


@router.get(
    "",
    response_model=IdeaListResponse,
    summary="아이디어 목록 조회",
    description="사용자의 아이디어 목록을 조회합니다."
)
async def get_ideas(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """아이디어 목록 조회"""
    idea_service = get_idea_service(db)
    ideas, total = idea_service.get_ideas(current_user, page, page_size)
    return IdeaListResponse(
        ideas=ideas,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get(
    "/{idea_id}",
    response_model=IdeaResponse,
    summary="아이디어 상세 조회",
    description="특정 아이디어의 상세 정보를 조회합니다."
)
async def get_idea(
    idea_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """아이디어 상세 조회"""
    idea_service = get_idea_service(db)
    return idea_service.get_idea(idea_id, current_user)


@router.patch(
    "/{idea_id}",
    response_model=IdeaResponse,
    summary="아이디어 수정",
    description="아이디어 정보를 수정합니다."
)
async def update_idea(
    idea_id: UUID,
    request: UpdateIdeaRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """아이디어 수정"""
    idea_service = get_idea_service(db)
    return idea_service.update_idea(idea_id, request, current_user)


@router.delete(
    "/{idea_id}",
    response_model=SuccessResponse,
    summary="아이디어 삭제",
    description="아이디어를 삭제합니다."
)
async def delete_idea(
    idea_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """아이디어 삭제"""
    idea_service = get_idea_service(db)
    idea_service.delete_idea(idea_id, current_user)
    return SuccessResponse(message="아이디어가 삭제되었습니다.")


# ============== 데이터 수집 ==============

@router.post(
    "/{idea_id}/collect",
    response_model=CollectDataResponse,
    summary="데이터 수집 시작",
    description="아이디어에 필요한 외부 데이터 수집을 시작합니다."
)
async def start_collection(
    idea_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """데이터 수집 시작"""
    idea_service = get_idea_service(db)
    return idea_service.start_collection(idea_id, current_user)


@router.get(
    "/{idea_id}/collect/status",
    response_model=CollectStatusResponse,
    summary="데이터 수집 상태 조회",
    description="데이터 수집 진행 상황을 조회합니다."
)
async def get_collection_status(
    idea_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """데이터 수집 상태 조회"""
    idea_service = get_idea_service(db)
    return idea_service.get_collection_status(idea_id, current_user)


# ============== 분석 ==============

@router.post(
    "/{idea_id}/analyze",
    response_model=AnalyzeResponse,
    summary="분석 시작",
    description="수집된 데이터를 기반으로 AI 분석을 시작합니다."
)
async def start_analysis(
    idea_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """분석 시작"""
    analysis_service = get_analysis_service(db)
    return analysis_service.start_analysis(idea_id, current_user)


@router.get(
    "/{idea_id}/analysis",
    response_model=AnalysisResultResponse,
    summary="분석 결과 조회",
    description="분석 결과를 조회합니다."
)
async def get_analysis(
    idea_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """분석 결과 조회"""
    analysis_service = get_analysis_service(db)
    return analysis_service.get_analysis(idea_id, current_user)


# ============== 보고서 ==============

@router.post(
    "/{idea_id}/report",
    response_model=ReportGenerateResponse,
    summary="보고서 생성",
    description="분석 결과를 바탕으로 보고서를 생성합니다."
)
async def create_report(
    idea_id: UUID,
    request: CreateReportRequest = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """보고서 생성"""
    report_service = get_report_service(db)
    return report_service.create_report(idea_id, current_user, request)

"""
Reports Router
보고서 관련 API 엔드포인트
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from src.db.session import get_db
from src.services.report_service import get_report_service
from src.api.v1.schemas import ReportResponse
from src.api.v1.dependencies import get_current_user
from src.models.user_model import User

router = APIRouter()


@router.get(
    "/{report_id}",
    response_model=ReportResponse,
    summary="보고서 조회",
    description="특정 보고서의 상세 내용을 조회합니다."
)
async def get_report(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """보고서 조회"""
    report_service = get_report_service(db)
    return report_service.get_report(report_id, current_user)

"""
Idea Service
아이디어 관련 비즈니스 로직
"""
from sqlalchemy.orm import Session
from typing import List, Optional, Tuple
from uuid import UUID
from datetime import datetime

from src.models.idea_model import Idea, IdeaStatus as ModelIdeaStatus, IndustryType as ModelIndustryType, RevenueModel as ModelRevenueModel
from src.models.user_model import User
from src.core.exceptions import NotFoundException, ForbiddenException, ValidationException
from src.api.v1.schemas import (
    CreateIdeaRequest,
    UpdateIdeaRequest,
    IdeaResponse,
    IdeaCreateResponse,
    CollectDataResponse,
    CollectStatusResponse
)


class IdeaService:
    """아이디어 서비스"""
    
    # 데이터 수집 태스크 목록
    COLLECT_TASKS = [
        "market_data",
        "competitor_data",
        "customer_insights",
        "regulation_data",
        "technology_trend",
        "profitability_benchmark"
    ]
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_idea(self, request: CreateIdeaRequest, user: User) -> IdeaCreateResponse:
        """아이디어 생성"""
        # Industry와 RevenueModel enum 변환
        industry = None
        if request.industry:
            industry = ModelIndustryType(request.industry.value)
        
        revenue_model = None
        if request.revenue_model:
            revenue_model = ModelRevenueModel(request.revenue_model.value)
        
        idea = Idea(
            user_id=user.id,
            title=request.title,
            description=request.description,
            problem=request.problem,
            target_customer=request.target_customer,
            value_proposition=request.value_proposition,
            differentiation=request.differentiation,
            constraints=request.constraints,
            industry=industry,
            revenue_model=revenue_model,
            status=ModelIdeaStatus.CREATED
        )
        
        self.db.add(idea)
        self.db.commit()
        self.db.refresh(idea)
        
        return IdeaCreateResponse(
            idea_id=str(idea.id),
            status=idea.status.value
        )
    
    def get_idea(self, idea_id: UUID, user: User) -> IdeaResponse:
        """아이디어 조회"""
        idea = self._get_idea_or_404(idea_id)
        self._check_ownership(idea, user)
        
        return self._to_response(idea)
    
    def get_ideas(self, user: User, page: int = 1, page_size: int = 20) -> Tuple[List[IdeaResponse], int]:
        """사용자의 아이디어 목록 조회"""
        query = self.db.query(Idea).filter(
            Idea.user_id == user.id,
            Idea.deleted_at.is_(None)
        ).order_by(Idea.created_at.desc())
        
        total = query.count()
        ideas = query.offset((page - 1) * page_size).limit(page_size).all()
        
        return [self._to_response(idea) for idea in ideas], total
    
    def update_idea(self, idea_id: UUID, request: UpdateIdeaRequest, user: User) -> IdeaResponse:
        """아이디어 수정"""
        idea = self._get_idea_or_404(idea_id)
        self._check_ownership(idea, user)
        
        # 분석이 진행 중이면 수정 불가
        if idea.status not in [ModelIdeaStatus.CREATED, ModelIdeaStatus.FAILED]:
            raise ValidationException("분석이 진행 중인 아이디어는 수정할 수 없습니다.")
        
        # 필드 업데이트
        update_data = request.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            if value is not None:
                if field == "industry" and value:
                    setattr(idea, field, ModelIndustryType(value.value))
                elif field == "revenue_model" and value:
                    setattr(idea, field, ModelRevenueModel(value.value))
                else:
                    setattr(idea, field, value)
        
        idea.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(idea)
        
        return self._to_response(idea)
    
    def delete_idea(self, idea_id: UUID, user: User) -> None:
        """아이디어 삭제 (Soft Delete)"""
        idea = self._get_idea_or_404(idea_id)
        self._check_ownership(idea, user)
        
        idea.deleted_at = datetime.utcnow()
        self.db.commit()
    
    def start_collection(self, idea_id: UUID, user: User) -> CollectDataResponse:
        """데이터 수집 시작"""
        idea = self._get_idea_or_404(idea_id)
        self._check_ownership(idea, user)
        
        # 상태 확인
        if idea.status not in [ModelIdeaStatus.CREATED, ModelIdeaStatus.FAILED]:
            raise ValidationException(f"현재 상태({idea.status.value})에서는 데이터 수집을 시작할 수 없습니다.")
        
        # 상태 업데이트
        idea.status = ModelIdeaStatus.COLLECTING
        idea.updated_at = datetime.utcnow()
        self.db.commit()
        
        # TODO: 실제로는 여기서 비동기 태스크 큐에 작업 추가
        # celery_app.send_task('collect_data', args=[str(idea.id)])
        
        return CollectDataResponse(
            idea_id=str(idea.id),
            status="collecting",
            tasks=self.COLLECT_TASKS
        )
    
    def get_collection_status(self, idea_id: UUID, user: User) -> CollectStatusResponse:
        """데이터 수집 상태 조회"""
        idea = self._get_idea_or_404(idea_id)
        self._check_ownership(idea, user)
        
        # TODO: 실제로는 태스크 큐에서 진행 상황 조회
        # 여기서는 시뮬레이션
        
        if idea.status == ModelIdeaStatus.COLLECTED:
            return CollectStatusResponse(
                idea_id=str(idea.id),
                status="completed",
                progress=100,
                completed_tasks=self.COLLECT_TASKS,
                pending_tasks=[],
                failed_tasks=[]
            )
        elif idea.status == ModelIdeaStatus.COLLECTING:
            # 시뮬레이션: 진행 중
            return CollectStatusResponse(
                idea_id=str(idea.id),
                status="collecting",
                progress=50,
                completed_tasks=self.COLLECT_TASKS[:3],
                pending_tasks=self.COLLECT_TASKS[3:],
                failed_tasks=[]
            )
        else:
            return CollectStatusResponse(
                idea_id=str(idea.id),
                status=idea.status.value,
                progress=0,
                completed_tasks=[],
                pending_tasks=self.COLLECT_TASKS,
                failed_tasks=[]
            )
    
    def _get_idea_or_404(self, idea_id: UUID) -> Idea:
        """아이디어 조회 또는 404"""
        idea = self.db.query(Idea).filter(
            Idea.id == idea_id,
            Idea.deleted_at.is_(None)
        ).first()
        
        if not idea:
            raise NotFoundException("아이디어를 찾을 수 없습니다.", "idea")
        
        return idea
    
    def _check_ownership(self, idea: Idea, user: User) -> None:
        """소유권 확인"""
        if idea.user_id != user.id:
            raise ForbiddenException("해당 아이디어에 대한 접근 권한이 없습니다.")
    
    def _to_response(self, idea: Idea) -> IdeaResponse:
        """Idea 모델을 응답 스키마로 변환"""
        return IdeaResponse(
            id=str(idea.id),
            user_id=str(idea.user_id),
            title=idea.title,
            description=idea.description,
            problem=idea.problem,
            target_customer=idea.target_customer,
            value_proposition=idea.value_proposition,
            differentiation=idea.differentiation,
            constraints=idea.constraints,
            industry=idea.industry.value if idea.industry else None,
            revenue_model=idea.revenue_model.value if idea.revenue_model else None,
            status=idea.status.value,
            created_at=idea.created_at.isoformat() if idea.created_at else None,
            updated_at=idea.updated_at.isoformat() if idea.updated_at else None
        )


def get_idea_service(db: Session) -> IdeaService:
    """IdeaService 인스턴스 생성"""
    return IdeaService(db)

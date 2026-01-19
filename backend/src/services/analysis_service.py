"""
Analysis Service
분석 관련 비즈니스 로직
"""
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from datetime import datetime
import random

from src.models.idea_model import Idea, IdeaStatus as ModelIdeaStatus
from src.models.analysis_model import Analysis, AnalysisStatus
from src.models.user_model import User
from src.core.exceptions import NotFoundException, ForbiddenException, ValidationException
from src.api.v1.schemas import (
    AnalyzeResponse,
    AnalysisResultResponse,
    AnalysisScores,
    SWOTAnalysis,
    MarketAnalysis
)


class AnalysisService:
    """분석 서비스"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def start_analysis(self, idea_id: UUID, user: User) -> AnalyzeResponse:
        """분석 시작"""
        idea = self._get_idea_or_404(idea_id)
        self._check_ownership(idea, user)
        
        # 상태 확인 (데이터 수집이 완료되어야 분석 가능)
        # 개발 편의를 위해 CREATED 상태에서도 분석 가능하도록 함
        valid_statuses = [ModelIdeaStatus.CREATED, ModelIdeaStatus.COLLECTED, ModelIdeaStatus.FAILED]
        if idea.status not in valid_statuses:
            raise ValidationException(f"현재 상태({idea.status.value})에서는 분석을 시작할 수 없습니다.")
        
        # 기존 분석 결과가 있는지 확인
        existing_analysis = self.db.query(Analysis).filter(
            Analysis.idea_id == idea_id
        ).first()
        
        if existing_analysis:
            # 기존 분석 결과 초기화
            existing_analysis.status = AnalysisStatus.IN_PROGRESS
            existing_analysis.updated_at = datetime.utcnow()
            analysis = existing_analysis
        else:
            # 새 분석 생성
            analysis = Analysis(
                idea_id=idea_id,
                status=AnalysisStatus.IN_PROGRESS
            )
            self.db.add(analysis)
        
        # 아이디어 상태 업데이트
        idea.status = ModelIdeaStatus.ANALYZING
        idea.updated_at = datetime.utcnow()
        
        self.db.commit()
        
        # TODO: 실제로는 여기서 비동기 AI 분석 태스크 실행
        # celery_app.send_task('run_analysis', args=[str(idea.id)])
        
        # 개발용: 즉시 분석 완료 시뮬레이션
        self._simulate_analysis(analysis, idea)
        
        return AnalyzeResponse(
            idea_id=str(idea.id),
            status="analysis_started"
        )
    
    def get_analysis(self, idea_id: UUID, user: User) -> AnalysisResultResponse:
        """분석 결과 조회"""
        idea = self._get_idea_or_404(idea_id)
        self._check_ownership(idea, user)
        
        analysis = self.db.query(Analysis).filter(
            Analysis.idea_id == idea_id
        ).first()
        
        if not analysis:
            raise NotFoundException("분석 결과를 찾을 수 없습니다.", "analysis")
        
        return self._to_response(analysis)
    
    def _simulate_analysis(self, analysis: Analysis, idea: Idea) -> None:
        """분석 시뮬레이션 (개발용)"""
        # 점수 생성
        base_score = 60 + random.randint(0, 25)
        
        analysis.market_score = min(100, 65 + random.randint(0, 25))
        analysis.competition_score = min(100, 50 + random.randint(0, 30))
        analysis.customer_demand_score = min(100, 60 + random.randint(0, 25))
        analysis.financial_score = min(100, 55 + random.randint(0, 30))
        analysis.execution_score = min(100, 50 + random.randint(0, 35))
        analysis.risk_score = min(100, 55 + random.randint(0, 30))
        analysis.overall_score = base_score
        
        # SWOT 분석
        analysis.swot_analysis = {
            "strengths": [
                "AI 기술 기반 차별화",
                "명확한 타겟 시장 정의",
                "확장 가능한 비즈니스 모델"
            ],
            "weaknesses": [
                "초기 자본 투자 필요",
                "기술 의존도 높음",
                "고객 신뢰 구축 시간 필요"
            ],
            "opportunities": [
                "성장하는 시장 규모",
                "디지털 전환 트렌드",
                "B2B 확장 가능성"
            ],
            "threats": [
                "대기업 진입 가능성",
                "규제 환경 변화",
                "기술 변화 속도"
            ]
        }
        
        # 시장 분석
        analysis.market_analysis = {
            "tam": "₩15조",
            "sam": "₩2.5조",
            "som": "₩500억",
            "cagr": "12.5%",
            "trends": [
                "AI 기반 서비스 수요 증가",
                "디지털 전환 가속화",
                "스타트업 생태계 활성화"
            ]
        }
        
        # 경쟁 분석
        analysis.competition_analysis = {
            "direct_competitors": 3,
            "indirect_competitors": 10,
            "competitive_position": "도전자",
            "barriers_to_entry": "중간"
        }
        
        # 재무 분석
        analysis.financial_analysis = {
            "initial_investment": "₩5,000만원",
            "monthly_burn_rate": "₩1,500만원",
            "break_even_period": "18개월",
            "expected_roi": "150%"
        }
        
        # 리스크 분석
        analysis.risk_analysis = {
            "key_risks": [
                "기술 발전 속도에 따른 업데이트 비용",
                "대기업의 유사 서비스 출시",
                "개인정보 보호 규제 강화",
                "초기 고객 획득 비용 증가"
            ],
            "mitigation_strategies": [
                "지속적인 R&D 투자",
                "차별화 전략 강화",
                "컴플라이언스 체계 구축"
            ]
        }
        
        # 상태 업데이트
        analysis.status = AnalysisStatus.COMPLETED
        analysis.completed_at = datetime.utcnow()
        
        idea.status = ModelIdeaStatus.ANALYZED
        idea.updated_at = datetime.utcnow()
        
        self.db.commit()
    
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
    
    def _to_response(self, analysis: Analysis) -> AnalysisResultResponse:
        """Analysis 모델을 응답 스키마로 변환"""
        scores = None
        swot = None
        market = None
        key_insights = None
        risks = None
        recommendation = None
        
        if analysis.status == AnalysisStatus.COMPLETED:
            scores = AnalysisScores(
                market_score=analysis.market_score or 0,
                competition_score=analysis.competition_score or 0,
                customer_demand_score=analysis.customer_demand_score or 0,
                financial_score=analysis.financial_score or 0,
                execution_score=analysis.execution_score or 0,
                risk_score=analysis.risk_score or 0,
                overall_score=analysis.overall_score or 0
            )
            
            if analysis.swot_analysis:
                swot = SWOTAnalysis(**analysis.swot_analysis)
            
            if analysis.market_analysis:
                market = MarketAnalysis(
                    tam=analysis.market_analysis.get("tam", ""),
                    sam=analysis.market_analysis.get("sam", ""),
                    som=analysis.market_analysis.get("som", ""),
                    cagr=analysis.market_analysis.get("cagr", ""),
                    trends=analysis.market_analysis.get("trends", [])
                )
            
            # 핵심 인사이트
            key_insights = [
                "타겟 시장의 디지털 전환이 가속화되고 있어 진입 시점이 적절합니다.",
                "AI 기반 서비스에 대한 소비자 수용도가 빠르게 증가하고 있습니다.",
                "구독 모델은 안정적인 수익 창출에 유리한 구조입니다.",
                "초기 고객 확보를 위한 차별화된 마케팅 전략이 필요합니다."
            ]
            
            # 리스크
            if analysis.risk_analysis:
                risks = analysis.risk_analysis.get("key_risks", [])
            
            # 추천
            if analysis.overall_score:
                if analysis.overall_score >= 70:
                    recommendation = "사업 추진 권장"
                elif analysis.overall_score >= 55:
                    recommendation = "조건부 추진 검토"
                else:
                    recommendation = "추가 검토 필요"
        
        return AnalysisResultResponse(
            idea_id=str(analysis.idea_id),
            status=analysis.status.value,
            scores=scores,
            swot=swot,
            market=market,
            key_insights=key_insights,
            risks=risks,
            recommendation=recommendation,
            created_at=analysis.created_at.isoformat() if analysis.created_at else None,
            completed_at=analysis.completed_at.isoformat() if analysis.completed_at else None
        )


def get_analysis_service(db: Session) -> AnalysisService:
    """AnalysisService 인스턴스 생성"""
    return AnalysisService(db)

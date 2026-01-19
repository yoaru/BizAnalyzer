"""
Report Service
보고서 관련 비즈니스 로직
"""
from sqlalchemy.orm import Session
from typing import List, Optional, Tuple
from uuid import UUID
from datetime import datetime

from src.models.idea_model import Idea, IdeaStatus as ModelIdeaStatus
from src.models.analysis_model import Analysis, AnalysisStatus
from src.models.report_model import Report, ReportStatus as ModelReportStatus, ReportType as ModelReportType
from src.models.user_model import User
from src.core.exceptions import NotFoundException, ForbiddenException, ValidationException
from src.api.v1.schemas import (
    CreateReportRequest,
    ReportGenerateResponse,
    ReportResponse,
    ActionItem,
    SWOTSection,
    MarketAnalysisSection,
    CompetitionAnalysisSection,
    FinancialAnalysisSection,
    RiskAssessmentSection,
    ReportType
)


class ReportService:
    """보고서 서비스"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_report(self, idea_id: UUID, user: User, request: CreateReportRequest = None) -> ReportGenerateResponse:
        """보고서 생성"""
        idea = self._get_idea_or_404(idea_id)
        self._check_ownership(idea, user)
        
        # 분석이 완료되어야 보고서 생성 가능
        analysis = self.db.query(Analysis).filter(
            Analysis.idea_id == idea_id,
            Analysis.status == AnalysisStatus.COMPLETED
        ).first()
        
        if not analysis:
            raise ValidationException("분석이 완료되어야 보고서를 생성할 수 있습니다.")
        
        # 보고서 타입 결정
        report_type = ModelReportType.BASIC
        if request and request.report_type:
            report_type = ModelReportType(request.report_type.value)
        
        # 보고서 생성
        report = Report(
            idea_id=idea_id,
            status=ModelReportStatus.GENERATING,
            report_type=report_type
        )
        
        self.db.add(report)
        
        # 아이디어 상태 업데이트
        idea.status = ModelIdeaStatus.REPORT_GENERATING
        idea.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(report)
        
        # 개발용: 즉시 보고서 생성 시뮬레이션
        self._generate_report(report, analysis, idea)
        
        return ReportGenerateResponse(
            report_id=str(report.id),
            idea_id=str(idea_id),
            status="generating"
        )
    
    def get_report(self, report_id: UUID, user: User) -> ReportResponse:
        """보고서 조회"""
        report = self._get_report_or_404(report_id)
        idea = self._get_idea_or_404(report.idea_id)
        self._check_ownership(idea, user)
        
        return self._to_response(report)
    
    def get_reports_by_idea(self, idea_id: UUID, user: User) -> Tuple[List[ReportResponse], int]:
        """아이디어의 보고서 목록 조회"""
        idea = self._get_idea_or_404(idea_id)
        self._check_ownership(idea, user)
        
        reports = self.db.query(Report).filter(
            Report.idea_id == idea_id
        ).order_by(Report.created_at.desc()).all()
        
        return [self._to_response(r) for r in reports], len(reports)
    
    def _generate_report(self, report: Report, analysis: Analysis, idea: Idea) -> None:
        """보고서 생성 시뮬레이션"""
        recommendation = "Go"
        if analysis.overall_score:
            if analysis.overall_score >= 70:
                recommendation = "Go"
            elif analysis.overall_score >= 55:
                recommendation = "Conditional"
            else:
                recommendation = "No-Go"
        
        report.executive_summary = f"""본 사업 아이디어 "{idea.title}"에 대한 타당성 분석 결과를 요약합니다.

종합 평가 점수는 {analysis.overall_score}점으로, {"사업 추진을 권장합니다." if recommendation == "Go" else "신중한 검토가 필요합니다."}

주요 강점으로는 AI 기술 기반의 차별화된 서비스와 명확한 타겟 시장이 있으며, 디지털 전환 트렌드에 따른 시장 성장 기회가 존재합니다.

다만, 초기 투자 비용과 경쟁 심화에 대한 리스크 관리가 필요하며, 고객 획득 전략에 대한 구체적인 실행 계획 수립을 권장합니다."""
        
        report.recommendation = recommendation
        
        report.swot = analysis.swot_analysis or {
            "strengths": ["AI 기술 기반 차별화", "명확한 타겟 시장", "확장 가능한 모델"],
            "weaknesses": ["초기 자본 필요", "기술 의존도", "신뢰 구축 시간"],
            "opportunities": ["시장 성장", "디지털 전환", "B2B 확장"],
            "threats": ["대기업 진입", "규제 변화", "기술 변화"]
        }
        
        report.market_analysis = {
            "tam": analysis.market_analysis.get("tam", "₩15조") if analysis.market_analysis else "₩15조",
            "sam": analysis.market_analysis.get("sam", "₩2.5조") if analysis.market_analysis else "₩2.5조",
            "som": analysis.market_analysis.get("som", "₩500억") if analysis.market_analysis else "₩500억",
            "cagr": analysis.market_analysis.get("cagr", "12.5%") if analysis.market_analysis else "12.5%",
            "market_trends": ["AI 기반 서비스 수요 증가", "디지털 전환 가속화", "스타트업 생태계 활성화"],
            "target_segments": ["예비 창업자", "스타트업 초기 팀", "기업 신사업 담당자"]
        }
        
        report.competition_analysis = {
            "direct_competitors": [
                {"name": "경쟁사 A", "strength": "브랜드 인지도", "weakness": "높은 가격"},
                {"name": "경쟁사 B", "strength": "기술력", "weakness": "낮은 사용성"}
            ],
            "indirect_competitors": [
                {"name": "컨설팅 업체", "description": "전통적 컨설팅 서비스"},
                {"name": "범용 AI", "description": "ChatGPT 등 범용 AI 서비스"}
            ],
            "competitive_advantages": ["사업 분석 특화 AI", "자동화된 보고서 생성", "합리적인 가격"],
            "market_position": "도전자"
        }
        
        report.financial_analysis = {
            "initial_investment": "₩5,000만원",
            "monthly_costs": "₩1,500만원",
            "break_even_period": "18개월",
            "revenue_projections": [
                {"year": 1, "revenue": "₩2억", "profit": "-₩1억"},
                {"year": 2, "revenue": "₩8억", "profit": "₩1억"},
                {"year": 3, "revenue": "₩20억", "profit": "₩5억"}
            ],
            "profitability_index": 1.8
        }
        
        report.risk_assessment = {
            "high_risks": [{"risk": "기술 변화 속도", "impact": "서비스 경쟁력 저하", "mitigation": "지속적 R&D 투자"}],
            "medium_risks": [
                {"risk": "경쟁 심화", "impact": "시장 점유율 하락", "mitigation": "차별화 전략"},
                {"risk": "규제 변화", "impact": "운영 비용 증가", "mitigation": "컴플라이언스 체계"}
            ],
            "low_risks": [{"risk": "인력 이탈", "impact": "개발 지연", "mitigation": "핵심 인력 관리"}],
            "mitigation_strategies": ["지속적인 기술 혁신", "고객 피드백 기반 개선", "전략적 파트너십 구축"]
        }
        
        report.action_items = [
            {"title": "MVP 개발", "description": "핵심 기능 중심의 최소 기능 제품 개발", "timeline": "1-3개월", "priority": "high"},
            {"title": "베타 테스트", "description": "초기 사용자 피드백 수집 및 제품 개선", "timeline": "3-6개월", "priority": "high"},
            {"title": "시장 진입", "description": "마케팅 캠페인 및 본격 서비스 런칭", "timeline": "6-9개월", "priority": "medium"}
        ]
        
        report.key_insights = [
            "타겟 시장의 디지털 전환이 가속화되고 있어 진입 시점이 적절합니다.",
            "AI 기반 서비스에 대한 소비자 수용도가 빠르게 증가하고 있습니다.",
            "구독 모델은 안정적인 수익 창출에 유리한 구조입니다.",
            "초기 고객 확보를 위한 차별화된 마케팅 전략이 필요합니다."
        ]
        
        report.status = ModelReportStatus.COMPLETED
        report.completed_at = datetime.utcnow()
        
        idea.status = ModelIdeaStatus.COMPLETED
        idea.updated_at = datetime.utcnow()
        
        self.db.commit()
    
    def _get_idea_or_404(self, idea_id: UUID) -> Idea:
        idea = self.db.query(Idea).filter(Idea.id == idea_id, Idea.deleted_at.is_(None)).first()
        if not idea:
            raise NotFoundException("아이디어를 찾을 수 없습니다.", "idea")
        return idea
    
    def _get_report_or_404(self, report_id: UUID) -> Report:
        report = self.db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise NotFoundException("보고서를 찾을 수 없습니다.", "report")
        return report
    
    def _check_ownership(self, idea: Idea, user: User) -> None:
        if idea.user_id != user.id:
            raise ForbiddenException("해당 아이디어에 대한 접근 권한이 없습니다.")
    
    def _to_response(self, report: Report) -> ReportResponse:
        swot = SWOTSection(**report.swot) if report.swot and report.status == ModelReportStatus.COMPLETED else None
        market_analysis = MarketAnalysisSection(**report.market_analysis) if report.market_analysis and report.status == ModelReportStatus.COMPLETED else None
        competition_analysis = CompetitionAnalysisSection(**report.competition_analysis) if report.competition_analysis and report.status == ModelReportStatus.COMPLETED else None
        financial_analysis = FinancialAnalysisSection(**report.financial_analysis) if report.financial_analysis and report.status == ModelReportStatus.COMPLETED else None
        risk_assessment = RiskAssessmentSection(**report.risk_assessment) if report.risk_assessment and report.status == ModelReportStatus.COMPLETED else None
        action_items = [ActionItem(**item) for item in report.action_items] if report.action_items and report.status == ModelReportStatus.COMPLETED else None
        
        return ReportResponse(
            report_id=str(report.id),
            idea_id=str(report.idea_id),
            status=report.status.value,
            report_type=report.report_type.value,
            executive_summary=report.executive_summary,
            recommendation=report.recommendation,
            swot=swot,
            market_analysis=market_analysis,
            competition_analysis=competition_analysis,
            financial_analysis=financial_analysis,
            risk_assessment=risk_assessment,
            action_items=action_items,
            key_insights=report.key_insights,
            pdf_url=report.pdf_url,
            created_at=report.created_at.isoformat() if report.created_at else None,
            completed_at=report.completed_at.isoformat() if report.completed_at else None
        )


def get_report_service(db: Session) -> ReportService:
    return ReportService(db)

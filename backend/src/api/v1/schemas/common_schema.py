"""
Common Schemas
공통 요청/응답 스키마
"""
from pydantic import BaseModel
from typing import Optional, Any, Generic, TypeVar, List
from pydantic.generics import GenericModel

T = TypeVar('T')


class SuccessResponse(BaseModel):
    """성공 응답"""
    success: bool = True
    message: str = "요청이 성공적으로 처리되었습니다."
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    """에러 응답"""
    success: bool = False
    error_code: str
    message: str
    details: Optional[dict] = None


class PaginationParams(BaseModel):
    """페이지네이션 파라미터"""
    page: int = 1
    page_size: int = 20
    
    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


class PaginatedResponse(GenericModel, Generic[T]):
    """페이지네이션 응답"""
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    
    @classmethod
    def create(cls, items: List[T], total: int, page: int, page_size: int):
        total_pages = (total + page_size - 1) // page_size
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )


class HealthCheckResponse(BaseModel):
    """헬스체크 응답"""
    status: str = "healthy"
    version: str
    database: str = "connected"
    timestamp: str

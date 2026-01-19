"""
Custom Exceptions
커스텀 예외 클래스 정의
"""
from typing import Optional, Dict, Any


class BaseAPIException(Exception):
    """기본 API 예외"""
    def __init__(
        self, 
        message: str, 
        error_code: str, 
        status_code: int = 400,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class UnauthorizedException(BaseAPIException):
    """인증 실패 예외"""
    def __init__(self, message: str = "유효하지 않은 인증 토큰입니다."):
        super().__init__(
            message=message,
            error_code="UNAUTHORIZED",
            status_code=401
        )


class ForbiddenException(BaseAPIException):
    """권한 없음 예외"""
    def __init__(self, message: str = "접근 권한이 없습니다."):
        super().__init__(
            message=message,
            error_code="FORBIDDEN",
            status_code=403
        )


class NotFoundException(BaseAPIException):
    """리소스 없음 예외"""
    def __init__(self, message: str = "요청한 리소스를 찾을 수 없습니다.", resource: str = ""):
        super().__init__(
            message=message,
            error_code="NOT_FOUND",
            status_code=404,
            details={"resource": resource} if resource else {}
        )


class ValidationException(BaseAPIException):
    """유효성 검사 실패 예외"""
    def __init__(self, message: str = "입력값이 올바르지 않습니다.", details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            error_code="INVALID_INPUT",
            status_code=400,
            details=details
        )


class ConflictException(BaseAPIException):
    """충돌 예외 (이미 존재하는 리소스)"""
    def __init__(self, message: str = "이미 존재하는 리소스입니다."):
        super().__init__(
            message=message,
            error_code="CONFLICT",
            status_code=409
        )


class InternalServerException(BaseAPIException):
    """내부 서버 오류"""
    def __init__(self, message: str = "서버 내부 오류가 발생했습니다."):
        super().__init__(
            message=message,
            error_code="INTERNAL_ERROR",
            status_code=500
        )


class ServiceUnavailableException(BaseAPIException):
    """서비스 불가 예외"""
    def __init__(self, message: str = "서비스를 일시적으로 사용할 수 없습니다."):
        super().__init__(
            message=message,
            error_code="SERVICE_UNAVAILABLE",
            status_code=503
        )

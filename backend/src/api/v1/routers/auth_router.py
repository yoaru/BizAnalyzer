"""
Auth Router
인증 관련 API 엔드포인트
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.services.auth_service import get_auth_service
from src.api.v1.schemas import (
    RegisterRequest,
    LoginRequest,
    RefreshTokenRequest,
    TokenResponse,
    AuthResponse,
    UserResponse
)
from src.api.v1.dependencies import get_current_user
from src.models.user_model import User

router = APIRouter()


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="회원가입",
    description="새로운 사용자를 등록합니다."
)
async def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    """회원가입"""
    auth_service = get_auth_service(db)
    return auth_service.register(request)


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="로그인",
    description="이메일과 비밀번호로 로그인합니다."
)
async def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    """로그인"""
    auth_service = get_auth_service(db)
    return auth_service.login(request)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="토큰 갱신",
    description="리프레시 토큰으로 새로운 액세스 토큰을 발급받습니다."
)
async def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """토큰 갱신"""
    auth_service = get_auth_service(db)
    return auth_service.refresh_token(request.refresh_token)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="내 정보 조회",
    description="현재 로그인한 사용자의 정보를 조회합니다."
)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    """내 정보 조회"""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at.isoformat() if current_user.created_at else None
    )

"""
Auth Service
인증 관련 비즈니스 로직
"""
from sqlalchemy.orm import Session
from typing import Optional, Tuple
from uuid import UUID

from src.models.user_model import User
from src.core.security import hash_password, verify_password
from src.core.jwt import create_access_token, create_refresh_token, verify_refresh_token
from src.core.config import settings
from src.core.exceptions import (
    UnauthorizedException,
    ConflictException,
    NotFoundException,
    ValidationException
)
from src.api.v1.schemas import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
    AuthResponse
)


class AuthService:
    """인증 서비스"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def register(self, request: RegisterRequest) -> AuthResponse:
        """회원가입"""
        # 이메일 중복 확인
        existing_user = self.db.query(User).filter(
            User.email == request.email,
            User.deleted_at.is_(None)
        ).first()
        
        if existing_user:
            raise ConflictException("이미 등록된 이메일입니다.")
        
        # 사용자 생성
        user = User(
            email=request.email,
            password=hash_password(request.password),
            name=request.name
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        # 토큰 생성
        tokens = self._create_tokens(user)
        
        return AuthResponse(
            user=UserResponse(
                id=str(user.id),
                email=user.email,
                name=user.name,
                is_active=user.is_active,
                is_verified=user.is_verified,
                created_at=user.created_at.isoformat() if user.created_at else None
            ),
            tokens=tokens
        )
    
    def login(self, request: LoginRequest) -> AuthResponse:
        """로그인"""
        # 사용자 조회
        user = self.db.query(User).filter(
            User.email == request.email,
            User.deleted_at.is_(None)
        ).first()
        
        if not user:
            raise UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.")
        
        # 비밀번호 검증
        if not verify_password(request.password, user.password):
            raise UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.")
        
        # 계정 활성화 확인
        if not user.is_active:
            raise UnauthorizedException("비활성화된 계정입니다.")
        
        # 토큰 생성
        tokens = self._create_tokens(user)
        
        return AuthResponse(
            user=UserResponse(
                id=str(user.id),
                email=user.email,
                name=user.name,
                is_active=user.is_active,
                is_verified=user.is_verified,
                created_at=user.created_at.isoformat() if user.created_at else None
            ),
            tokens=tokens
        )
    
    def refresh_token(self, refresh_token: str) -> TokenResponse:
        """토큰 갱신"""
        # 리프레시 토큰 검증
        payload = verify_refresh_token(refresh_token)
        if not payload:
            raise UnauthorizedException("유효하지 않은 리프레시 토큰입니다.")
        
        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedException("토큰에 사용자 정보가 없습니다.")
        
        # 사용자 조회
        user = self.db.query(User).filter(
            User.id == UUID(user_id),
            User.deleted_at.is_(None)
        ).first()
        
        if not user:
            raise NotFoundException("사용자를 찾을 수 없습니다.")
        
        if not user.is_active:
            raise UnauthorizedException("비활성화된 계정입니다.")
        
        # 새 토큰 생성
        return self._create_tokens(user)
    
    def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """ID로 사용자 조회"""
        return self.db.query(User).filter(
            User.id == user_id,
            User.deleted_at.is_(None)
        ).first()
    
    def _create_tokens(self, user: User) -> TokenResponse:
        """토큰 생성"""
        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )


def get_auth_service(db: Session) -> AuthService:
    """AuthService 인스턴스 생성"""
    return AuthService(db)

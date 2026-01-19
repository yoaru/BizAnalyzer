"""
Auth Dependencies
인증 관련 의존성 (FastAPI Depends)
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID

from src.db.session import get_db
from src.core.jwt import verify_access_token
from src.core.exceptions import UnauthorizedException
from src.models.user_model import User

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    현재 인증된 사용자 반환
    모든 인증이 필요한 엔드포인트에서 사용
    """
    token = credentials.credentials
    
    # 토큰 검증
    payload = verify_access_token(token)
    if payload is None:
        raise UnauthorizedException("유효하지 않은 인증 토큰입니다.")
    
    # 사용자 ID 추출
    user_id = payload.get("sub")
    if user_id is None:
        raise UnauthorizedException("토큰에 사용자 정보가 없습니다.")
    
    # 사용자 조회
    try:
        user = db.query(User).filter(
            User.id == UUID(user_id),
            User.deleted_at.is_(None)
        ).first()
    except Exception:
        raise UnauthorizedException("사용자를 찾을 수 없습니다.")
    
    if user is None:
        raise UnauthorizedException("사용자를 찾을 수 없습니다.")
    
    if not user.is_active:
        raise UnauthorizedException("비활성화된 계정입니다.")
    
    return user


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    현재 인증된 사용자 반환 (선택적)
    인증이 선택적인 엔드포인트에서 사용
    """
    if credentials is None:
        return None
    
    try:
        return await get_current_user(credentials, db)
    except UnauthorizedException:
        return None


def require_verified_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    이메일 인증된 사용자만 허용
    """
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="이메일 인증이 필요합니다."
        )
    return current_user

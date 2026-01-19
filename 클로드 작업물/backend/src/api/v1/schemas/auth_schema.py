"""
Auth Schemas
인증 관련 요청/응답 스키마
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class RegisterRequest(BaseModel):
    """회원가입 요청"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    name: Optional[str] = Field(None, max_length=100)


class LoginRequest(BaseModel):
    """로그인 요청"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """토큰 응답"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshTokenRequest(BaseModel):
    """토큰 갱신 요청"""
    refresh_token: str


class UserResponse(BaseModel):
    """사용자 정보 응답"""
    id: str
    email: str
    name: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: Optional[str]
    
    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    """인증 응답 (토큰 + 사용자 정보)"""
    user: UserResponse
    tokens: TokenResponse

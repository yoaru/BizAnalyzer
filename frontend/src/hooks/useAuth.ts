import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import type { LoginRequest, RegisterRequest } from '@/types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  /**
   * 로그인 mutation
   */
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      // 토큰 저장
      authService.saveTokens(data.tokens.access_token, data.tokens.refresh_token);
      // 사용자 정보 캐시
      queryClient.setQueryData(['user'], data.user);
    },
  });

  /**
   * 회원가입 mutation
   */
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      // 토큰 저장
      authService.saveTokens(data.tokens.access_token, data.tokens.refresh_token);
      // 사용자 정보 캐시
      queryClient.setQueryData(['user'], data.user);
    },
  });

  /**
   * 현재 사용자 정보 query
   */
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    retry: false,
  });

  /**
   * 로그아웃
   */
  const logout = () => {
    authService.logout();
    queryClient.clear();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegisterLoading: registerMutation.isPending,
    registerError: registerMutation.error,

    user: userQuery.data,
    isUserLoading: userQuery.isLoading,
    userError: userQuery.error,

    logout,
    isAuthenticated: authService.isAuthenticated(),
  };
};

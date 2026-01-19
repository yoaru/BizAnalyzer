
## 1. 기술 스택
- Framework: React / Next.js
- Language: TypeScript
- Styling: TailwindCSS
- State Management: Zustand / Redux Toolkit
- API 통신: Axios + React Query


## 2. 폴더 구조 (Best Practice)
src/
 ├─ components/      # 재사용 UI 컴포넌트
 ├─ pages/           # Next.js 라우트/페이지
 ├─ hooks/           # 커스텀 훅
 ├─ store/           # 상태관리(zustand/redux 등)
 ├─ services/        # API 통신 모듈
 ├─ utils/           # 유틸 함수
 ├─ types/           # 공통 타입 정의
 ├─ constants/       # 상수
 ├─ assets/          # 이미지/아이콘 등 정적 리소스
 ├─ styles/          # 글로벌/공통 스타일
 └─ layouts/         # 레이아웃 컴포넌트




## 3. 개발 규칙
- 모든 컴포넌트는 함수형 컴포넌트 사용
- props는 명확한 타입 정의 필수 (TypeScript interface/type 활용)
- API 호출은 services/ 에서만 수행, hooks에서는 useQuery/useMutation 등으로 래핑
- UI 컴포넌트는 재사용성을 우선
- 상태관리는 store/에서 통합 관리
- 코드 스타일은 Prettier/ESLint로 통일

### API 에러/인증 처리
- 모든 API 요청은 try-catch로 에러 처리, 에러 메시지는 사용자에게 명확히 안내
- JWT 등 인증 토큰은 Axios 인터셉터로 자동 첨부
- 토큰 만료/인증 실패 시 로그인 페이지로 리다이렉트

### UI/UX 가이드 (대략)
- 디자인 시스템(버튼, 폼, 컬러 등) 일관성 유지
- 반응형(모바일/PC) 필수, Tailwind breakpoints 적극 활용
- 접근성(aria-label, 키보드 네비게이션 등) 기본 준수
- 로딩/에러/빈 상태 등 사용자 피드백 명확히 제공

## 4. 커밋 컨벤션
- feat: 새로운 기능
- fix: 버그 수정
- style: UI/스타일 변경
- refactor: 코드 구조 개선

## 5. 코드 예시
```ts
export const getUser = async (id: string) => {
  return api.get(`/users/${id}`);
};


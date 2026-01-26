import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ideaService } from '@/services/idea.service';
import type { CreateIdeaRequest, UpdateIdeaRequest } from '@/types';

export const useIdeas = () => {
  const queryClient = useQueryClient();

  /**
   * 아이디어 목록 조회
   */
  const ideasQuery = useQuery({
    queryKey: ['ideas'],
    queryFn: () => ideaService.getIdeas(),
  });

  /**
   * 아이디어 생성 mutation
   */
  const createIdeaMutation = useMutation({
    mutationFn: (data: CreateIdeaRequest) => ideaService.createIdea(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });

  /**
   * 아이디어 수정 mutation
   */
  const updateIdeaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIdeaRequest }) =>
      ideaService.updateIdea(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      queryClient.invalidateQueries({ queryKey: ['idea', variables.id] });
    },
  });

  /**
   * 아이디어 삭제 mutation
   */
  const deleteIdeaMutation = useMutation({
    mutationFn: (id: string) => ideaService.deleteIdea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });

  return {
    ideas: ideasQuery.data,
    isIdeasLoading: ideasQuery.isLoading,
    ideasError: ideasQuery.error,
    refetchIdeas: ideasQuery.refetch,

    createIdea: createIdeaMutation.mutate,
    createIdeaAsync: createIdeaMutation.mutateAsync,
    isCreating: createIdeaMutation.isPending,
    createError: createIdeaMutation.error,

    updateIdea: updateIdeaMutation.mutate,
    updateIdeaAsync: updateIdeaMutation.mutateAsync,
    isUpdating: updateIdeaMutation.isPending,
    updateError: updateIdeaMutation.error,

    deleteIdea: deleteIdeaMutation.mutate,
    deleteIdeaAsync: deleteIdeaMutation.mutateAsync,
    isDeleting: deleteIdeaMutation.isPending,
    deleteError: deleteIdeaMutation.error,
  };
};

export const useIdea = (id: string) => {
  const queryClient = useQueryClient();

  /**
   * 아이디어 상세 조회
   */
  const ideaQuery = useQuery({
    queryKey: ['idea', id],
    queryFn: () => ideaService.getIdea(id),
    enabled: !!id,
  });

  /**
   * 데이터 수집 시작
   */
  const startCollectionMutation = useMutation({
    mutationFn: () => ideaService.startCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idea', id] });
    },
  });

  /**
   * 데이터 수집 상태 조회
   */
  const collectionStatusQuery = useQuery({
    queryKey: ['collection-status', id],
    queryFn: () => ideaService.getCollectionStatus(id),
    enabled: false, // 수동으로 refetch
  });

  /**
   * 분석 시작
   */
  const startAnalysisMutation = useMutation({
    mutationFn: () => ideaService.startAnalysis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idea', id] });
    },
  });

  /**
   * 분석 결과 조회
   */
  const analysisQuery = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => ideaService.getAnalysis(id),
    enabled: false, // 수동으로 refetch
  });

  /**
   * 보고서 생성
   */
  const generateReportMutation = useMutation({
    mutationFn: () => ideaService.generateReport(id),
  });

  return {
    idea: ideaQuery.data,
    isIdeaLoading: ideaQuery.isLoading,
    ideaError: ideaQuery.error,
    refetchIdea: ideaQuery.refetch,

    startCollection: startCollectionMutation.mutate,
    startCollectionAsync: startCollectionMutation.mutateAsync,
    isStartingCollection: startCollectionMutation.isPending,

    collectionStatus: collectionStatusQuery.data,
    isCollectionStatusLoading: collectionStatusQuery.isLoading,
    refetchCollectionStatus: collectionStatusQuery.refetch,

    startAnalysis: startAnalysisMutation.mutate,
    startAnalysisAsync: startAnalysisMutation.mutateAsync,
    isStartingAnalysis: startAnalysisMutation.isPending,

    analysis: analysisQuery.data,
    isAnalysisLoading: analysisQuery.isLoading,
    refetchAnalysis: analysisQuery.refetch,

    generateReport: generateReportMutation.mutate,
    generateReportAsync: generateReportMutation.mutateAsync,
    isGeneratingReport: generateReportMutation.isPending,
  };
};

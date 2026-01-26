import { apiClient } from '@/utils/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type {
  Idea,
  CreateIdeaRequest,
  UpdateIdeaRequest,
  CollectionStatus,
  AnalysisResult,
  Report,
} from '@/types';

export class IdeaService {
  /**
   * 아이디어 목록 조회
   */
  async getIdeas(): Promise<Idea[]> {
    const response = await apiClient.get<Idea[]>(API_ENDPOINTS.IDEAS.LIST);
    return response.data;
  }

  /**
   * 아이디어 상세 조회
   */
  async getIdea(id: string): Promise<Idea> {
    const response = await apiClient.get<Idea>(API_ENDPOINTS.IDEAS.GET(id));
    return response.data;
  }

  /**
   * 아이디어 생성
   */
  async createIdea(data: CreateIdeaRequest): Promise<{ idea_id: string; status: string }> {
    const response = await apiClient.post<{ idea_id: string; status: string }>(
      API_ENDPOINTS.IDEAS.CREATE,
      data
    );
    return response.data;
  }

  /**
   * 아이디어 수정
   */
  async updateIdea(id: string, data: UpdateIdeaRequest): Promise<Idea> {
    const response = await apiClient.patch<Idea>(
      API_ENDPOINTS.IDEAS.UPDATE(id),
      data
    );
    return response.data;
  }

  /**
   * 아이디어 삭제
   */
  async deleteIdea(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.IDEAS.DELETE(id));
  }

  /**
   * 데이터 수집 시작
   */
  async startCollection(id: string): Promise<CollectionStatus> {
    const response = await apiClient.post<CollectionStatus>(
      API_ENDPOINTS.IDEAS.COLLECT(id)
    );
    return response.data;
  }

  /**
   * 데이터 수집 상태 조회
   */
  async getCollectionStatus(id: string): Promise<CollectionStatus> {
    const response = await apiClient.get<CollectionStatus>(
      API_ENDPOINTS.IDEAS.COLLECT_STATUS(id)
    );
    return response.data;
  }

  /**
   * 분석 시작
   */
  async startAnalysis(id: string): Promise<{ idea_id: string; status: string }> {
    const response = await apiClient.post<{ idea_id: string; status: string }>(
      API_ENDPOINTS.IDEAS.ANALYZE(id)
    );
    return response.data;
  }

  /**
   * 분석 결과 조회
   */
  async getAnalysis(id: string): Promise<AnalysisResult> {
    const response = await apiClient.get<AnalysisResult>(
      API_ENDPOINTS.IDEAS.ANALYSIS(id)
    );
    return response.data;
  }

  /**
   * 보고서 생성 요청
   */
  async generateReport(id: string): Promise<{ report_id: string; status: string }> {
    const response = await apiClient.post<{ report_id: string; status: string }>(
      API_ENDPOINTS.IDEAS.REPORT(id)
    );
    return response.data;
  }
}

export const ideaService = new IdeaService();

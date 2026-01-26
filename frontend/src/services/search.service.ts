import { apiClient } from '@/utils/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { SearchResult } from '@/types';

export class SearchService {
  /**
   * 경쟁사 검색
   */
  async searchCompetitors(query: string): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>(
      API_ENDPOINTS.SEARCH.COMPETITORS,
      {
        params: { q: query },
      }
    );
    return response.data;
  }

  /**
   * 시장 데이터 검색
   */
  async searchMarket(query: string): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>(
      API_ENDPOINTS.SEARCH.MARKET,
      {
        params: { q: query },
      }
    );
    return response.data;
  }

  /**
   * 고객 리뷰 검색
   */
  async searchReviews(query: string): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>(
      API_ENDPOINTS.SEARCH.REVIEWS,
      {
        params: { q: query },
      }
    );
    return response.data;
  }

  /**
   * 규제 검색
   */
  async searchRegulations(query: string): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>(
      API_ENDPOINTS.SEARCH.REGULATIONS,
      {
        params: { q: query },
      }
    );
    return response.data;
  }

  /**
   * 기술 트렌드 검색
   */
  async searchTechnology(query: string): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>(
      API_ENDPOINTS.SEARCH.TECHNOLOGY,
      {
        params: { q: query },
      }
    );
    return response.data;
  }

  /**
   * 수익성 검색
   */
  async searchProfitability(query: string): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>(
      API_ENDPOINTS.SEARCH.PROFITABILITY,
      {
        params: { q: query },
      }
    );
    return response.data;
  }
}

export const searchService = new SearchService();

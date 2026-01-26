import { apiClient } from '@/utils/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { Report } from '@/types';

export class ReportService {
  /**
   * 보고서 조회
   */
  async getReport(reportId: string): Promise<Report> {
    const response = await apiClient.get<Report>(
      API_ENDPOINTS.REPORTS.GET(reportId)
    );
    return response.data;
  }
}

export const reportService = new ReportService();

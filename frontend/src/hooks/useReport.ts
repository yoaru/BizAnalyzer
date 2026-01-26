import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';

export const useReport = (reportId: string) => {
  const reportQuery = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => reportService.getReport(reportId),
    enabled: !!reportId,
  });

  return {
    report: reportQuery.data,
    isReportLoading: reportQuery.isLoading,
    reportError: reportQuery.error,
    refetchReport: reportQuery.refetch,
  };
};

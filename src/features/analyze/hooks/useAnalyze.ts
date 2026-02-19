import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAnalyzeJobStatus,
  getMyAnalyzeJobs,
  issueAnalyzeUploadUrls,
  startAnalyzeJob,
  uploadFileToPresignedUrl,
} from "@/features/analyze/api/analyze.api";
import { queryKeys } from "@/lib/queryKeys";
import type {
  AnalyzeJobListResponse,
  AnalyzeJobStartResponse,
  AnalyzeJobStatusResponse,
  AnalyzeMode,
  AnalyzeUploadUrlsResponse,
  Gender,
  MeasurementModel,
} from "@/types/trendscope";

export function useAnalyzeJob(jobId: string | null, polling = false, pollingIntervalMs = 2_000) {
  return useQuery<AnalyzeJobStatusResponse>({
    queryKey: queryKeys.analyze.job(jobId ?? "none"),
    queryFn: () => getAnalyzeJobStatus(jobId as string),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      if (!polling) return false;

      const status = query.state.data?.status;
      if (!status) return pollingIntervalMs;

      return status === "QUEUED" || status === "RUNNING" ? pollingIntervalMs : false;
    },
  });
}

export function useMyAnalyzeJobs(size = 20) {
  return useQuery<AnalyzeJobListResponse>({
    queryKey: queryKeys.analyze.jobs(size),
    queryFn: () => getMyAnalyzeJobs(size),
    staleTime: 10_000,
  });
}

export type AnalyzePipelineInput = {
  mode: AnalyzeMode;
  frontFile: File;
  sideFile?: File;
  heightCm: number;
  weightKg?: number;
  gender: Gender;
  measurementModel?: MeasurementModel;
};

export type AnalyzePipelineOutput = {
  upload: AnalyzeUploadUrlsResponse;
  start: AnalyzeJobStartResponse;
  measurementModel: MeasurementModel;
};

function inferMeasurementModel(mode: AnalyzeMode): MeasurementModel {
  return mode === "QUICK_1VIEW" ? "quick" : "premium";
}

export function useAnalyzePipelineMutation() {
  const queryClient = useQueryClient();

  return useMutation<AnalyzePipelineOutput, Error, AnalyzePipelineInput>({
    mutationFn: async (input) => {
      const measurementModel = input.measurementModel ?? inferMeasurementModel(input.mode);

      if (input.mode === "STANDARD_2VIEW" && !input.sideFile) {
        throw new Error("STANDARD_2VIEW 모드에서는 측면 사진이 필요합니다.");
      }

      const upload = await issueAnalyzeUploadUrls({
        mode: input.mode,
        frontFilename: input.frontFile.name,
        sideFilename: input.sideFile?.name,
      });

      const uploadTasks: Promise<void>[] = [
        uploadFileToPresignedUrl(upload.frontImage.uploadUrl, input.frontFile),
      ];

      if (input.mode === "STANDARD_2VIEW" && upload.sideImage && input.sideFile) {
        uploadTasks.push(uploadFileToPresignedUrl(upload.sideImage.uploadUrl, input.sideFile));
      }

      await Promise.all(uploadTasks);

      const start = await startAnalyzeJob(upload.jobId, {
        heightCm: input.heightCm,
        weightKg: input.weightKg,
        gender: input.gender,
        measurementModel,
      });

      return { upload, start, measurementModel };
    },
    onSuccess: async ({ upload }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.analyze.root }),
        queryClient.invalidateQueries({ queryKey: queryKeys.tickets.root }),
      ]);

      queryClient.setQueryData(queryKeys.analyze.job(upload.jobId), null);
    },
  });
}

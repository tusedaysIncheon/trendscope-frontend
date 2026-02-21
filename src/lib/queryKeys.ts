export const queryKeys = {
  tickets: {
    root: ["tickets"] as const,
    summary: (size: number) => ["tickets", "summary", size] as const,
  },
  analyze: {
    root: ["analyze"] as const,
    job: (jobId: string) => ["analyze", "job", jobId] as const,
    jobs: (size: number) => ["analyze", "jobs", size] as const,
    sharedJob: (token: string) => ["analyze", "shared-job", token] as const,
  },
  measurement: {
    root: ["measurement"] as const,
    recommendationHistory: (size: number) => ["measurement", "recommendation", "history", size] as const,
    recommendationHistoryDetail: (userSeq: number) =>
      ["measurement", "recommendation", "history", userSeq] as const,
  },
  mypage: {
    root: ["mypage"] as const,
    summary: (ticketSize: number, analyzeSize: number) => ["mypage", "summary", ticketSize, analyzeSize] as const,
  },
  user: ["user"] as const,
} as const;

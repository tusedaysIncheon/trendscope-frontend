export type AnalyzeMode = "STANDARD_2VIEW" | "QUICK_1VIEW";
export type AnalyzeJobStatus = "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
export type MeasurementModel = "quick" | "premium";
export type Gender = "male" | "female" | "other";
export type TicketType = "QUICK" | "PREMIUM";
export type TicketLedgerReason = "PURCHASE" | "USE" | "REFUND";

export interface AuthUser {
  username: string;
  isSocial: boolean;
  email: string;
  ticketBalance: number;
}

export interface EmailOtpRequest {
  email: string;
}

export interface EmailOtpVerifyRequest {
  email: string;
  code: string;
  deviceId?: string;
}

export interface EmailOtpVerifyResponse {
  accessToken: string;
  user: AuthUser;
}

export interface TicketTransactionRequest {
  ticketType: TicketType;
  refId: string;
  quantity?: number;
}

export interface TicketTransactionResponse {
  transactionId: number;
  ticketType: TicketType;
  reason: TicketLedgerReason;
  refId: string;
  quantity: number;
  delta: number;
  quickTicketBalance: number;
  premiumTicketBalance: number;
  totalTicketBalance: number;
  applied: boolean;
  createdDate: string;
}

export interface TicketLedgerItem {
  id: number;
  ticketType: TicketType;
  reason: TicketLedgerReason;
  delta: number;
  refId: string;
  createdDate: string;
}

export interface TicketSummaryResponse {
  username: string;
  quickTicketBalance: number;
  premiumTicketBalance: number;
  totalTicketBalance: number;
  recentLedger: TicketLedgerItem[];
}

export interface AnalyzeUploadUrlsRequest {
  mode: AnalyzeMode;
  frontFilename: string;
  sideFilename?: string;
}

export interface AnalyzePresignedUpload {
  fileKey: string;
  uploadUrl: string;
}

export interface AnalyzeUploadUrlsResponse {
  jobId: string;
  mode: AnalyzeMode;
  status: AnalyzeJobStatus;
  frontImage: AnalyzePresignedUpload;
  sideImage: AnalyzePresignedUpload | null;
  glbObject: AnalyzePresignedUpload;
}

export interface AnalyzeJobStartRequest {
  heightCm: number;
  weightKg?: number;
  gender: Gender;
  measurementModel?: MeasurementModel;
}

export interface AnalyzeJobStartResponse {
  jobId: string;
  mode: AnalyzeMode;
  status: AnalyzeJobStatus;
  queuedAt: string;
}

export interface AnalyzeShareLinkResponse {
  token: string;
  shareUrl: string;
  expiresAt: string;
}

export interface AnalyzeLengths {
  shoulder_width_cm: number | null;
  arm_length_cm: number | null;
  leg_length_cm: number | null;
  torso_length_cm: number | null;
  inseam_cm: number | null;
}

export interface AnalyzeCircumferences {
  chest_cm: number | null;
  waist_cm: number | null;
  hip_cm: number | null;
  thigh_cm: number | null;
  chest_axis_m: number | null;
  waist_axis_m: number | null;
  hip_axis_m: number | null;
  thigh_axis_m: number | null;
}

export interface QuickAnalyzeResult {
  success: true;
  lengths: AnalyzeLengths;
}

export interface PremiumAnalyzeResult {
  success: true;
  lengths: AnalyzeLengths;
  circumferences: AnalyzeCircumferences;
  body_shape: string;
}

export interface AnalyzeFailureResult {
  success: false;
  error: string;
  detail?: string;
}

export type AnalyzeResultPayload = QuickAnalyzeResult | PremiumAnalyzeResult | AnalyzeFailureResult;

export interface AnalyzeJobStatusResponse {
  jobId: string;
  mode: AnalyzeMode;
  status: AnalyzeJobStatus;
  frontImageKey: string;
  sideImageKey: string | null;
  glbObjectKey: string;
  glbDownloadUrl?: string | null;
  heightCm: number | null;
  weightKg: number | null;
  gender: Gender | null;
  qualityMode: "fast" | "accurate" | null;
  normalizeWithAnny: boolean | null;
  measurementModel: MeasurementModel | null;
  outputPose: "PHOTO_POSE" | string | null;
  errorCode: string | null;
  errorDetail: string | null;
  result: AnalyzeResultPayload | null;
  queuedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdDate: string;
  updatedDate: string;
}

export interface AnalyzeSharedJobResponse {
  jobId: string;
  mode: AnalyzeMode;
  status: AnalyzeJobStatus;
  glbDownloadUrl?: string | null;
  heightCm: number | null;
  weightKg: number | null;
  gender: Gender | null;
  measurementModel: MeasurementModel | null;
  result: AnalyzeResultPayload | null;
  completedAt: string | null;
  createdDate: string | null;
}

export interface AnalyzeJobListItem {
  jobId: string;
  mode: AnalyzeMode;
  status: AnalyzeJobStatus;
  glbObjectKey: string;
  createdDate: string;
  completedAt: string | null;
}

export interface AnalyzeJobListResponse {
  username: string;
  jobs: AnalyzeJobListItem[];
}

export interface FashionRecommendationRequest {
  jobId: string;
  language?: string;
  location?: string;
}

export interface FashionRecommendationResponse {
  jobId: string;
  measurementModel: MeasurementModel;
  recommendation: Record<string, unknown>;
}

export interface FashionRecommendationHistoryItem {
  userSeq: number;
  jobId: string;
  mode: AnalyzeMode;
  measurementModel: MeasurementModel;
  frontImageKey: string;
  sideImageKey: string | null;
  glbObjectKey: string;
  createdDate: string;
}

export interface FashionRecommendationHistoryListResponse {
  username: string;
  histories: FashionRecommendationHistoryItem[];
}

export interface FashionRecommendationHistoryDetailResponse {
  userSeq: number;
  jobId: string;
  mode: AnalyzeMode;
  measurementModel: MeasurementModel;
  frontImageKey: string;
  sideImageKey: string | null;
  glbObjectKey: string;
  result: AnalyzeResultPayload;
  recommendation: Record<string, unknown>;
  llmModel: string;
  promptVersion: string;
  createdDate: string;
}

export interface CreemCheckoutCreateRequest {
  ticketType: TicketType;
  quantity?: number;
  successUrl?: string;
}

export interface CreemCheckoutCreateResponse {
  checkoutId: string;
  checkoutUrl: string;
  requestId: string;
  ticketType: TicketType;
  quantity: number;
  productId: string;
}

export interface MyPageSummaryResponse {
  username: string;
  ticket: TicketSummaryResponse;
  recentAnalyzeJobs: AnalyzeJobListItem[];
}

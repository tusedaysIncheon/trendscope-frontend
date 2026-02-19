import { requestData, requestEnvelope } from "@/lib/api/request";
import type { EmailOtpRequest, EmailOtpVerifyRequest, EmailOtpVerifyResponse } from "@/types/trendscope";
import { getDeviceId } from "@/lib/utils";

export async function requestEmailOtp(payload: EmailOtpRequest): Promise<string> {
  const response = await requestEnvelope<null, EmailOtpRequest>(
    {
      url: "/v1/auth/email-otp/request",
      method: "POST",
      data: payload,
      skipAuth: true,
    },
    "인증 코드 요청 중 오류가 발생했습니다."
  );
  return response.message;
}

export async function verifyEmailOtp(payload: EmailOtpVerifyRequest): Promise<EmailOtpVerifyResponse> {
  const requestPayload: EmailOtpVerifyRequest = {
    ...payload,
    deviceId: payload.deviceId ?? getDeviceId(),
  };

  return requestData<EmailOtpVerifyResponse, EmailOtpVerifyRequest>(
    {
      url: "/v1/auth/email-otp/verify",
      method: "POST",
      data: requestPayload,
      skipAuth: true,
    },
    "인증 코드 검증 중 오류가 발생했습니다."
  );
}

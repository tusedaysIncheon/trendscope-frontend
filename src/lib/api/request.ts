import type { AxiosRequestConfig } from "axios";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { getApiErrorMessage } from "@/lib/api/error";
import type { ApiResponse } from "@/types/api";

export async function requestData<TResponse, TRequest = unknown>(
  config: AxiosRequestConfig<TRequest>,
  fallbackMessage: string
): Promise<TResponse> {
  try {
    const response = await axiosInstance.request<ApiResponse<TResponse>>(config);
    return response.data.data;
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, fallbackMessage));
  }
}

export async function requestEnvelope<TResponse, TRequest = unknown>(
  config: AxiosRequestConfig<TRequest>,
  fallbackMessage: string
): Promise<ApiResponse<TResponse>> {
  try {
    const response = await axiosInstance.request<ApiResponse<TResponse>>(config);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, fallbackMessage));
  }
}

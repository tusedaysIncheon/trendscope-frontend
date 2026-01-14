import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { axiosInstance } from "../../lib/api/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";
import { getDeviceId } from "@/lib/utils";

const initAuthProcess = async () => {
  const deviceId = getDeviceId();

  const { data } = await axiosInstance.post(
    "/jwt/refresh",
    { deviceId },
    { skipAuth: true }
  );
  
  return data.accessToken;
};

export function useAuthInit(enabled: boolean) {
  const { setAccessToken } = useAuthStore();

  const { isLoading, isError, data: accessToken } = useQuery<string | null>({
    queryKey: ["auth-init"],
    queryFn: initAuthProcess,
    enabled: enabled,
    retry: 0,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
    }
    if (isError) {
      setAccessToken(null);
    }
  }, [accessToken, isError, setAccessToken]);

  // Return only what the consumer (`AuthInitializer`) needs
  return { isLoading };
}
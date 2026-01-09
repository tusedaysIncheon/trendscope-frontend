import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { axiosInstance } from "../../lib/api/axiosInstance";
import { useAuthStore } from "../../store/useAuthStore";

const initAuthProcess = async () => {
  const deviceId = localStorage.getItem("deviceId") || "unknown-device";


  const { data: tokenData } = await axiosInstance.post(
    "/jwt/refresh", 
    { deviceId }, 
    { skipAuth: true }
  );
  

  const { data: userData } = await axiosInstance.get("/v1/user", {
    headers: { Authorization: `Bearer ${tokenData.accessToken}` }
  });

  return { accessToken: tokenData.accessToken, user: userData };
};

export function useAuthInit(enabled: boolean) {
  const { setAccessToken, setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["auth-init"],
    queryFn: initAuthProcess,
    enabled: enabled, 
    retry: 0,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data) {
      setAccessToken(query.data.accessToken);
      setUser(query.data.user);
    }
    if (query.isError) {
    }
  }, [query.data, query.isError, setAccessToken, setUser ]);

  return query;
}
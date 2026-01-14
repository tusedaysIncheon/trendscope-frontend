import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/api/axiosInstance';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserLoadDTO } from '@/types/auth';
import { getUserLoadInfo } from '@/lib/api/UserApi';

const fetchUser = async (): Promise<UserLoadDTO> => {
    // We already have a function for this, so we can reuse it.
    return await getUserLoadInfo();
};

export function useUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<UserLoadDTO>({
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

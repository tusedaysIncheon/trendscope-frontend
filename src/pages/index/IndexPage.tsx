import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";

import { PageLayout } from "@/shared/layouts/PageLayout";
import { VoteCard } from "@/features/vote/components/VoteCard";
import { getVoteFeedApi } from "@/features/vote/api/vote.api";
import { useFeedStore } from "@/store/useFeedStore";

export default function IndexPage() {
  const { activeTab } = useFeedStore();

  // Gravity Feed (Recommendation)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ["votes", "gravity"], // Currently only Gravity is implemented
    queryFn: ({ pageParam = 0 }) => getVoteFeedApi(pageParam, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    },
    enabled: activeTab === "rec", // Only fetch when on "rec" tab
    staleTime: 0, // 3분 동안 데이터 유지 (서버 부하 감소)
  });

  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersectionObserver(intersectionRef, {
    threshold: 1.0,
  });

  useEffect(() => {
    if (intersection && intersection.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [intersection, hasNextPage, isFetchingNextPage, fetchNextPage]);


  const votes = data?.pages.flatMap((page) => page) || [];

  return (
    <PageLayout
      variant="top"
      contentWidth="md"
      className="py-0 mt-0"
      contentClassName="gap-0"
    >
      <div className="flex flex-col gap-6 pb-20 px-0 items-center">
        {isLoading ? (
          <div className="py-20 flex justify-center w-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="py-20 text-center text-red-500">
            투표 목록을 불러오는데 실패했습니다.
          </div>
        ) : votes.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p>아직 볼 수 있는 투표가 없어요 텅.. 🗑️</p>
          </div>
        ) : (
          <>
            {votes.map((vote) => (
              <VoteCard key={vote.id} data={vote} />
            ))}

            {/* Infinite Scroll Trigger */}
            <div ref={intersectionRef} className="w-full h-10 flex justify-center items-center">
              {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
import { PageLayout } from "@/components/layouts/PageLayout";
import { VoteCard } from "@/components/feature/vote/VoteCard";
import type { VoteData } from "@/types/vote";
import { useFeedStore } from "@/store/useFeedStore"; // ✅ 스토어 import

// 🟢 MOCK DATA (데이터는 그대로 유지)
const RECOMMENDED_VOTES: VoteData[] = [
  {
    id: 1,
    writer: { name: "김개발", handle: "dev_king" },
    question: "주 4일제 도입, 찬성하시나요? 🤔",
    createdAt: "1시간 전",
    timeLeft: "2일 남음",
    totalVotes: 1240,
    isLiked: false,
    likeCount: 45,
    commentCount: 12,
    options: [
      { id: 101, text: "무조건 찬성! 월급 줄어도 됨", count: 800 },
      { id: 102, text: "반대, 일이 밀릴 것 같다", count: 300 },
      { id: 103, text: "잘 모르겠음", count: 140 },
    ],
  },
  {
    id: 2,
    writer: { name: "민트초코", handle: "mincho_lover" },
    question: "민초는 치약맛이다 vs 맛있는 초콜릿이다 🍫",
    createdAt: "3시간 전",
    timeLeft: "5시간 남음",
    totalVotes: 3200,
    isLiked: true,
    likeCount: 120,
    commentCount: 89,
    options: [
      { id: 201, text: "치약맛 극혐 🤮", count: 1500 },
      { id: 202, text: "천상의 맛이지 🌿", count: 1700 },
    ],
  },
];

const FOLLOWING_VOTES: VoteData[] = [
  {
    id: 3,
    writer: { name: "내친구", handle: "my_friend" },
    question: "점심 메뉴 추천좀 해줘 (팔로잉 전용) 🍜",
    createdAt: "방금 전",
    timeLeft: "1시간 남음",
    totalVotes: 10,
    isLiked: false,
    likeCount: 2,
    commentCount: 5,
    options: [
      { id: 301, text: "짜장면", count: 5 },
      { id: 302, text: "짬뽕", count: 5 },
    ],
  },
];

export default function IndexPage() {
  // ✅ [변경] 로컬 useState 삭제 -> 전역 스토어 사용
  const { activeTab } = useFeedStore();

  // 스토어의 탭 상태(rec/following)에 따라 보여줄 데이터 결정
  const currentVotes = activeTab === "rec" ? RECOMMENDED_VOTES : FOLLOWING_VOTES;

  return (
    <PageLayout
      variant="top"
      contentWidth="md"
      className="py-0 mt-0"
      contentClassName="gap-0"
    >
  
      <div className="flex flex-col gap-6 pb-20 px-0">
        {currentVotes.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p>아직 볼 수 있는 투표가 없어요 텅.. 🗑️</p>
          </div>
        ) : (
          currentVotes.map((vote, index) => (
            <VoteCard key={`${vote.id}-${index}`} data={vote} />
          ))
        )}
      </div>
    </PageLayout>
  );
}
import { PageLayout } from "@/shared/layouts/PageLayout";
import { VoteCard } from "@/features/vote/components/VoteCard";
import type { VoteData } from "@/types/vote";
import { useFeedStore } from "@/store/useFeedStore";

// 🟢 MOCK DATA
const RECOMMENDED_VOTES: VoteData[] = [
  {
    id: 1,
    writer: {
      id: 10,
      nickname: "김개발",
      avatarUrl: null,
      isFollowing: false
    },
    content: "주 4일제 도입, 찬성하시나요? 🤔",
    imageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1시간 전
    endDate: "2026-01-23T00:00:00",
    totalVotes: 1240,
    commentCount: 12,
    votedOptionId: null,
    options: [
      { id: 101, text: "무조건 찬성! 월급 줄어도 됨", count: 800, imageUrl: null },
      { id: 102, text: "반대, 일이 밀릴 것 같다", count: 300, imageUrl: null },
      { id: 103, text: "잘 모르겠음", count: 140, imageUrl: null },
    ],
  },
  {
    id: 2,
    writer: {
      id: 11,
      nickname: "민트초코",
      avatarUrl: null,
      isFollowing: true
    },
    content: "민초는 치약맛이다 vs 맛있는 초콜릿이다 🍫",
    imageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3시간 전
    endDate: "2026-01-21T09:00:00",
    totalVotes: 3200,
    commentCount: 89,
    votedOptionId: 201, // 이미 투표함
    options: [
      { id: 201, text: "치약맛 극혐 🤮", count: 1500, imageUrl: null },
      { id: 202, text: "천상의 맛이지 🌿", count: 1700, imageUrl: null },
    ],
  },
  {
    id: 4,
    writer: {
      id: 11,
      nickname: "여행가고싶다",
      avatarUrl: null,
      isFollowing: false
    },
    content: "이번 여름 휴가, 바다 vs 산 어디로 갈까요? 🏖️🏔️\n(사진은 예시입니다)",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop", // 바다 이미지 예시
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    endDate: "2026-02-01T00:00:00",
    totalVotes: 56,
    commentCount: 3,
    votedOptionId: null,
    options: [
      { id: 401, text: "시원한 바다", count: 30, imageUrl: null },
      { id: 402, text: "상쾌한 산", count: 26, imageUrl: null },
    ],
  },
  {
    id: 5,
    writer: {
      id: 13,
      nickname: "패션피플",
      avatarUrl: null,
      isFollowing: true
    },
    content: "오늘 소개팅 나가는데 옷 골라주세요! 👔\n1번: 캐주얼, 2번: 댄디",
    imageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    endDate: "2026-01-21T18:00:00",
    totalVotes: 120,
    commentCount: 45,
    votedOptionId: null,
    options: [
      {
        id: 501,
        text: "캐주얼 룩 (청바지+티셔츠)",
        count: 50,
        imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: 502,
        text: "댄디 룩 (슬랙스+셔츠)",
        count: 70,
        imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=400&q=80"
      },
    ],
  },
];

const FOLLOWING_VOTES: VoteData[] = [
  {
    id: 7,
    writer: {
      id: 12,
      nickname: "미식가",
      avatarUrl: null,
      isFollowing: true
    },
    content: "오늘 저녁 뭐 먹죠? 5가지 메뉴 중 골라주세요! 🥢",
    imageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    endDate: "2026-01-21T05:00:00",
    totalVotes: 10,
    commentCount: 5,
    votedOptionId: null,
    options: [
      { id: 701, text: "피자", count: 2, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80" },
      { id: 702, text: "치킨", count: 3, imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80" },
      { id: 703, text: "초밥", count: 1, imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80" },
      { id: 704, text: "삼겹살", count: 4, imageUrl: "https://images.unsplash.com/photo-1621213320269-e374528d229f?auto=format&fit=crop&w=400&q=80" },
      { id: 705, text: "햄버거", count: 0, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" },
    ],
  },
];

export default function IndexPage() {
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
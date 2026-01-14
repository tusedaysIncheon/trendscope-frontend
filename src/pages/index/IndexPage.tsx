import { PageLayout } from "@/components/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { VoteData } from "@/types/vote";
import { VoteCard } from "@/components/feature/vote/VoteCard";

function IndexPage() {
  const MOCK_VOTES: VoteData[] = [
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
      question: "민트초코는 치약맛이다 vs 맛있는 초콜릿이다 🍫",
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
    {
      id: 2,
      writer: { name: "민트초코", handle: "mincho_lover" },
      question: "민트초코는 치약맛이다 vs 맛있는 초콜릿이다 🍫",
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
    {
      id: 2,
      writer: { name: "민트초코", handle: "mincho_lover" },
      question: "민트초코는 치약맛이다 vs 맛있는 초콜릿이다 🍫",
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
    {
      id: 2,
      writer: { name: "민트초코", handle: "mincho_lover" },
      question: "민트초코는 치약맛이다 vs 맛있는 초콜릿이다 🍫",
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

  return (
    <PageLayout
      variant="top"
      contentWidth="md"
      className="py-0 mt-3"
      contentClassName="gap-6"
    >
     <div className="w-full flex flex-col gap-6">
        {MOCK_VOTES.map((vote, index) => (
          <VoteCard key={`${vote.id}-${index}`} data={vote} />
        ))}
      </div>
    </PageLayout>
  );
}


export default IndexPage;

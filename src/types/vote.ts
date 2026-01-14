interface VoteOption {
  id: number;
  text: string;
  count: number;
}

export interface VoteData {
  id: number;
  writer: {
    name: string;
    handle: string;
    avatarUrl?: string;
  };
  question: string;
  createdAt: string;
  timeLeft: string; // 예: "2일 남음"
  totalVotes: number;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  options: VoteOption[];
}

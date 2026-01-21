// 1. 작성자 정보 (User + UserDetails)
export interface Writer {
  id: number;
  nickname: string;
  avatarUrl: string | null;
  isFollowing: boolean;
}

// 2. 투표 항목 (vote_options)
export interface VoteOption {
  id: number;
  text: string;
  imageUrl: string | null;
  count: number;
}

// 3. 메인 투표 데이터 (vote + vote_records)
export interface VoteData {
  id: number;
  writer: Writer;
  content: string;
  imageUrl: string | null;
  createdAt: string; // ISO Date string
  endDate: string;   // ISO Date string
  totalVotes: number;
  commentCount: number;
  options: VoteOption[];

  // 사용자 상호작용
  votedOptionId: number | null; // null이면 투표 안 함
}
// 1. 작성자 정보 (User + UserDetails)
export interface Writer {
  id: number;
  nickname: string;
  avatarUrl: string | null;
  isFollowing: boolean;
}

// 2. 투표 항목 Response (DTO: VoteOptionResponseDTO)
// 2. 투표 항목 Response (DTO: VoteOptionResponseDTO)
export interface VoteOptionStats {
  mbti: Record<string, number>;
  age: Record<string, number>;
  region: Record<string, number>;
  status: Record<string, number>;
}

export interface VoteOption {
  id: number;
  content: string; // Changed from text to content to match DTO
  imageUrl: string | null;
  count: number;
  stats?: VoteOptionStats;
}

// 3. 메인 투표 데이터 Response (DTO: VoteResponseDTO)
export interface VoteData {
  id: number;
  writer: Writer;
  content: string;
  imageUrl: string | null;
  createdAt: string; // ISO Date string
  endDate: string;   // ISO Date string

  // 통계
  totalVote: number; // Changed from totalVotes to totalVote
  commentCount: number;

  // 상태
  isClosed: boolean;
  isVoted: boolean; // Boolean to boolean
  votedOptionId: number | null;

  options: VoteOption[];
}

// 4. 투표 생성 Request (DTO: VoteRequestDTO)
export interface VoteOptionRequest {
  content: string;
  imageUrl?: string;
}

export interface VoteRequest {
  content: string;
  imageUrl?: string;
  duration: number; // 시간 단위
  options: VoteOptionRequest[];
}

export interface Comment {
  id: number;
  writer: Writer;
  content: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  replyCount: number;
}

export interface Demographics {
  ageGroup: string; // "10s", "20s", "30s", ...
  percentage: number;
  color: string;
}
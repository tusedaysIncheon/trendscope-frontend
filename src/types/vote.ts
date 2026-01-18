import type { Gender, MBTI, Region, RelationshipStatus } from "./profile";

// 1. 작성자 정보 (재사용)
export interface Writer {
  id: number;
  nickname: string;
  handle: string;
  avatarUrl?: string;
}

// 2. 투표 항목
export interface VoteOption {
  id: number;
  text: string;     // 예: 짜장면
  count: number;    // 득표수
  imageUrl?: string; // (선택) 항목 이미지
}

// 3. 댓글 정보 (투표한 항목 포함)
export interface Comment {
  id: number;
  writer: Writer;          // 댓글 쓴 사람
  content: string;         // 댓글 내용
  createdAt: string;
  votedOptionText?: string; // 💡 핵심: 이 사람이 투표한 항목 이름 (예: "짜장면")
                            // 투표 안 하고 댓글만 썼으면 null/undefined
}

// 4. 📊 통계 정보
export interface VoteStat {
  gender: Gender;
  mbti: MBTI;
  ageGroup: Record<string, number>;
  region: Region;
  relationshipStatus: RelationshipStatus;
}

// 5. 투표 게시글 전체 데이터
export interface VoteData {
  id: number;
  writer: Writer;
  
  question: string;
  imageUrl?: string;
  
  createdAt: string;
  endDate: string;
  
  totalVotes: number;
  commentCount: number;
  
  options: VoteOption[];
  
  // 내 투표 정보
  mySelectionId?: number; 
  
  // 통계 (옵션 ID별 통계)
  stats?: Record<number, VoteStat>;
  
  // 베스트 댓글 (미리보기용 3개 정도)
  bestComments?: Comment[]; 
}
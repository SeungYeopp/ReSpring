export interface Participant {
  userId: string;
  nickname: string;
  profileImage: string;
}

export interface ParticipantListResponse {
  challengeId: number;
  participantCount: number;
  participants: Participant[];
}

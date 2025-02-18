package org.ssafy.respring.domain.challenge.dto.response;

import lombok.*;
import org.ssafy.respring.domain.tag.vo.Tag;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeDetailResponseDto {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Set<Tag> tags;
    private Long participantCount;
    private Long likes;
    private Long views;
    private boolean isSuccessToday;
    private int longestStreak;
    private int currentStreak;
    private double successRate;
    private String ownerNickname;
    private String ownerProfileImage;
    private Map<String, String> records;

    // ====== 새로 추가할 필드 ====== //
    private boolean isParticipating;  // 사용자가 이 챌린지에 참가 중인지 여부
    private boolean isLiked;          // 사용자가 이 챌린지를 좋아하는지 여부
}

package org.ssafy.respring.domain.challenge.dto.response;

import lombok.*;
import org.ssafy.respring.domain.tag.vo.ChallengeTag;
import org.ssafy.respring.domain.tag.vo.Tag;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeDetailResponseDto {
    private Long id;
    private String title;
    private String description;
    private String image;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Set<Tag> tags;
    private Long participantCount;
    private Long likes;
    private Long views;
    private boolean isSuccessToday;
    private int longestStreak;  // ✅ 연속 성공 일수
    private int currentStreak;  // ✅ 현재 연속 성공 일수
    private double successRate; // ✅ 성공률
    private UUID ownerId; // ✅ OwnerId 추가
    private Object records; // ✅ Records 객체 그대로 담기
}

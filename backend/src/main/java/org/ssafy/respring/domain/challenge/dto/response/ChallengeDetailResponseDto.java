package org.ssafy.respring.domain.challenge.dto.response;

import lombok.*;

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
    private String imageUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Set<String> tags;
    private Long participantCount;
    private Long likes;
    private Long views;
    private boolean isSuccessToday;
    private int longestStreak;
    private int currentStreak;
    private double successRate;
    private UUID ownerId;
    private Object records;
}

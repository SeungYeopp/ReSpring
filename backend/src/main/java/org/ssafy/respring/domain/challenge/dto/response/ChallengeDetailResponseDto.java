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
    private String ownerName;
    private Object records;
}

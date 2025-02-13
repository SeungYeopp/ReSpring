package org.ssafy.respring.domain.challenge.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.ssafy.respring.domain.challenge.vo.ChallengeStatus;
import org.ssafy.respring.domain.tag.vo.Tag;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeListResponseDto {
    private Long id;
    private String title;
    private String description;
    private String image;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registerDate;
    private Set<Tag> tags;
    private boolean isLiked;
    private Long likes;
    private Long views;
    private Long participantCount;
    private ChallengeStatus status;
}

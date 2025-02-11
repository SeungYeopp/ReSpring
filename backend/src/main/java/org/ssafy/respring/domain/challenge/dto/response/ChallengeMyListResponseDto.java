package org.ssafy.respring.domain.challenge.dto.response;

import lombok.*;
import org.ssafy.respring.domain.tag.vo.ChallengeTag;
import org.ssafy.respring.domain.tag.vo.Tag;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeMyListResponseDto {
    private Long id;
    private String title;
    private String image;
    private LocalDateTime registerDate;
    private Set<Tag> tags; // ✅ 태그 추가
    private int tagCount; // ✅ 태그 개수 추가
    private int currentStreak; // ✅ 현재 연속 성공 일수 추가

}

package org.ssafy.respring.domain.subscribe.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscribedBookResponseDto {
	private Long id;
	private String title;
	private String coverImage;
	private Set<String> tags;
	private boolean isLiked;
	private Long likeCount;
	private Long viewCount;
	private Set<UUID> likedUsers;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	// ✅ 추가: 작성자 정보 (구독한 사람이 만든 봄날의 서인지 확인)
	private UUID authorId;
	private String authorName;
}

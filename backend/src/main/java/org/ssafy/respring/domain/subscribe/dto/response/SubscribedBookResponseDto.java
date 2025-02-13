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
	private Set<String> likedUsers;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	private String authorName;
	private String authorProfileImage;
}

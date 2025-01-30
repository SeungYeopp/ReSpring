package org.ssafy.respring.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDTO;
import org.ssafy.respring.domain.image.vo.Image;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class BookResponseDto {
	private Long id;
	private UUID userId;
	private String title;
	private String content;
	private String coverImg;
	private String tag;
	private Long likes;
	private Long view;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private List<Long> storyIds;
	private List<String> imageUrls; // ✅ 포함된 이미지 URL 리스트 추가
}

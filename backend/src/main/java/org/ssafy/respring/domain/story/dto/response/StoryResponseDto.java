package org.ssafy.respring.domain.story.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDto;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class StoryResponseDto {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long eventId;
    private LocalDateTime occurredAt;
    private List<ImageResponseDto> images;
}

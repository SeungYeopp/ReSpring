package org.ssafy.respring.domain.story.dto.request;

import lombok.Data;
import org.ssafy.respring.domain.image.vo.Image;

import java.util.List;
import java.util.UUID;

@Data
public class StoryRequestDto {
    private UUID userId;
    private String title;
    private String content;
    private Long eventId;
}

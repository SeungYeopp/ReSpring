package org.ssafy.respring.domain.story.dto.request;

import lombok.Data;

@Data
public class StoryRequestDto {
    private String title;
    private String content;
    private Long eventId;
}

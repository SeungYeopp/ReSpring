package org.ssafy.respring.domain.story.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class StoryUpdateRequestDto {
    private String title;
    private String content;
    private Long eventId;
    private List<String> deleteImageIds;
}

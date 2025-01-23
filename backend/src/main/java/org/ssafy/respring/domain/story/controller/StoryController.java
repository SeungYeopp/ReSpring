package org.ssafy.respring.domain.story.controller;


import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ssafy.respring.domain.story.service.StoryService;

@RestController
@RequestMapping("/stories")
@RequiredArgsConstructor
@Tag(name = "Stories API", description = "글 조각 관련 API")
public class StoryController {
    private final StoryService storyService;
}

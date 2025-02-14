package org.ssafy.respring.domain.story.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.post.dto.request.PostRequestDto;
import org.ssafy.respring.domain.story.dto.request.StoryRequestDto;
import org.ssafy.respring.domain.story.dto.request.StoryUpdateRequestDto;
import org.ssafy.respring.domain.story.dto.response.StoryResponseDto;
import org.ssafy.respring.domain.story.service.StoryService;
import org.ssafy.respring.domain.user.service.UserService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/stories")
@RequiredArgsConstructor
@Tag(name = "Stories API", description = "글 조각 관련 API")
public class StoryController {
    private final StoryService storyService;

    @PostMapping(consumes = {"multipart/form-data"})
    @Operation(summary = "글 조각 생성", description = "새로운 글 조각을 생성합니다.")
    public ResponseEntity<Long> createStory(
            @RequestPart("storyDto") @Valid StoryRequestDto requestDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,HttpSession session
    ) throws IOException {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(storyService.createStory(requestDto, images,userId));
    }
    
    @PatchMapping(value = "/{story_id}", consumes = {"multipart/form-data"})
    @Operation(summary = "글 조각 수정", description = "특정 글 조각을 수정합니다.")
    public ResponseEntity<Void> updateStory(
        @Parameter(description = "글 조각 ID") @PathVariable(required = true) Long story_id,
        @RequestPart("storyDto") @Valid StoryUpdateRequestDto requestDto,
        @RequestPart(value = "images", required = false) List<MultipartFile> newImages,
        HttpSession session
    ) throws IOException {
        UUID userId = (UUID) session.getAttribute("userId");
        storyService.updateStory(story_id, requestDto, newImages,userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{story_id}")
    @Operation(summary = "글 조각 삭제", description = "특정 글 조각을 삭제합니다.")
    public ResponseEntity<Void> deleteStory(
            @Parameter(description = "글 조각 ID") @PathVariable Long story_id,
            HttpSession session
    ) {
        UUID userId = (UUID)session.getAttribute("userId");
        storyService.deleteStory(story_id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(summary = "나의 글 조각 목록 조회", description = "나의 글 조각 목록을 조회합니다.")
    public ResponseEntity<List<StoryResponseDto>> getMyStories(
            HttpSession session
    ) {
        UUID userId = (UUID)session.getAttribute("userId");
        return ResponseEntity.ok(storyService.getMyStories(userId));
    }

    @GetMapping("/{story_id}")
    @Operation(summary = "글 조각 세부 조회", description = "글 조각의 세부 정보를 조회합니다.")
    public ResponseEntity<StoryResponseDto> getStoryDetail(
            @Parameter(description = "글 조각 ID") @PathVariable Long story_id,
            HttpSession session
    ) {
        UUID userId = (UUID)session.getAttribute("userId");

        return ResponseEntity.ok(storyService.getStoryDetail(story_id, userId));
    }
}

package org.ssafy.respring.domain.story.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.event.repository.EventRepository;
import org.ssafy.respring.domain.event.vo.Event;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.image.vo.ImageType;
import org.ssafy.respring.domain.story.dto.request.StoryRequestDto;
import org.ssafy.respring.domain.story.dto.request.StoryUpdateRequestDto;
import org.ssafy.respring.domain.story.dto.response.StoryResponseDto;
import org.ssafy.respring.domain.story.repository.StoryRepository;
import org.ssafy.respring.domain.story.vo.Story;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class StoryService {
    private final StoryRepository storyRepository;
    private final EventRepository eventRepository;
    private final ImageService imageService;

    /**
     * 스토리 생성
     */
    public Long createStory(StoryRequestDto requestDto, List<MultipartFile> imageFiles,UUID userId) {
        // 사용자 정보 설정
        User user = new User();
        user.setId(userId);

        // 이벤트 조회
        Event event = eventRepository.findById(requestDto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + requestDto.getEventId()));

        // 이벤트 소유자인지 검증
        if (!event.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not allowed to access this event.");
        }

        // 스토리 생성 및 저장
        Story story = Story.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .user(user)
                .event(event)
                .build();

        // 스토리 저장
        storyRepository.save(story);

        // ✅ Image 테이블에 이미지 저장
        if (imageFiles != null && !imageFiles.isEmpty()) {
            imageService.saveImages(imageFiles, ImageType.STORY, story.getId());
        }

        return story.getId();
    }

    /**
     * 스토리 수정
     */
    @Transactional
    public void updateStory(Long storyId, StoryUpdateRequestDto requestDto, List<MultipartFile> imageFiles,UUID userId) {
        // 스토리 조회
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found - id: " + storyId));

        // 작성자인지 검증
        if (!story.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not allowed to update this story.");
        }

        // 이벤트 조회
        Event event = eventRepository.findById(requestDto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + requestDto.getEventId()));

        // 유저가 다른 유저의 이벤트를 선택했는지 검증
        if (!event.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not allowed to select this event.");
        }

        // 스토리 수정
        story.setTitle(requestDto.getTitle());
        story.setContent(requestDto.getContent());
        story.setEvent(event);

        // ✅ 기존 이미지 삭제
        List<String> deleteImageIds = requestDto.getDeleteImageIds();
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            imageService.deleteImagesByEntityAndS3Key(ImageType.STORY, storyId, deleteImageIds);
        }

        // ✅ 새로운 이미지 추가
        if (imageFiles != null && !imageFiles.isEmpty()) {
            imageService.saveImages(imageFiles, ImageType.STORY, storyId);
        }

        storyRepository.save(story);
    }

    /**
     * 스토리 삭제
     */
    public void deleteStory(Long storyId, UUID userId) {
        // 스토리 조회
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found - id: " + storyId));

        // 작성자인지 검증
        if (!story.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not allowed to delete this story.");
        }

        // ✅ Image 테이블에서 관련 이미지 삭제
        imageService.deleteImages(ImageType.STORY, storyId);

        // 스토리 삭제
        storyRepository.deleteById(storyId);
    }

    /**
     * 내가 작성한 스토리 목록 조회
     */
    public List<StoryResponseDto> getMyStories(UUID userId) {
        return storyRepository.findByUserId(userId)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * 스토리 상세 조회
     */
    public StoryResponseDto getStoryDetail(Long storyId, UUID userId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story with ID " + storyId + " does not exist."));

        // 접근 권한 확인
        if (!story.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not allowed to view this story.");
        }

        return toResponseDto(story);
    }

    /**
     * Story -> StoryResponseDto 변환
     */
    private StoryResponseDto toResponseDto(Story story) {
        // ✅ Image 테이블에서 스토리에 해당하는 이미지 조회 후 변환
        List<String> images = imageService.getImagesByEntity(ImageType.STORY, story.getId());

        LocalDateTime occurredAt = story.getEvent().getOccurredAt();

        return new StoryResponseDto(
                story.getId(),
                story.getTitle(),
                story.getContent(),
                story.getCreatedAt(),
                story.getUpdatedAt(),
                story.getEvent().getId(),
                occurredAt,
                images
        );
    }
}

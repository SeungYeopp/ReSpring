package org.ssafy.respring.domain.story.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.event.repository.EventRepository;
import org.ssafy.respring.domain.event.vo.Event;
import org.ssafy.respring.domain.image.repository.ImageRepository;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.story.dto.request.StoryRequestDto;
import org.ssafy.respring.domain.story.dto.response.StoryResponseDto;
import org.ssafy.respring.domain.story.repository.StoryRepository;
import org.ssafy.respring.domain.story.vo.Story;
import org.ssafy.respring.domain.user.vo.User;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class StoryService {
    private final StoryRepository storyRepository;
    private final EventRepository eventRepository;
    private final ImageRepository imageRepository;

    public Long createStory(StoryRequestDto requestDto) {

//		User user = userRepository.findById(requestDto.getUserId())
//				.orElseThrow(() -> new IllegalArgumentException("User not found with id: " + requestDto.getUserId()));

        User user = new User();
        user.setId(requestDto.getUserId());

        Event event = eventRepository.findById(requestDto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + requestDto.getEventId()));

        Story story = new Story();
        story.setTitle(requestDto.getTitle());
        story.setContent(requestDto.getContent());
        story.setImages(requestDto.getImageList());

        story.setUser(user);
        story.setEvent(event);

        storyRepository.save(story);

        return story.getId();
    }

    public void updateStory(Long storyId, StoryRequestDto requestDto) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found - id: " + storyId));

        story.setTitle(requestDto.getTitle());
        story.setContent(requestDto.getContent());

        Event event = eventRepository.findById(requestDto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + requestDto.getEventId()));

        story.setEvent(event);

        // 기존 컬렉션을 수정
        story.getImages().clear(); // 기존 이미지를 모두 제거
        story.getImages().addAll(requestDto.getImageList()); // 새로운 이미지 추가
    }

    public void deleteStory(Long storyId) {
        storyRepository.deleteById(storyId);
    }

    public List<StoryResponseDto> getMyStories(UUID userId) {
        return storyRepository.findByUserId(userId)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<StoryResponseDto> getStoryDetail(Long storyId) {
        return storyRepository.findById(storyId)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    private StoryResponseDto toResponseDto(Story story) {
        List<Image> images = imageRepository.findImagesByStoryId(story.getId());
        List<Long> imageIds = new ArrayList<>();

        for (Image img: images)
            imageIds.add(img.getImageId());

        return new StoryResponseDto(
                story.getId(),
                story.getTitle(),
                story.getContent(),
                story.getCreatedAt(),
                story.getUpdatedAt(),
                story.getEvent().getId(),
                imageIds
        );
    }
}

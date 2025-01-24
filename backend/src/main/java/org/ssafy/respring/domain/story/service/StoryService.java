package org.ssafy.respring.domain.story.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.event.repository.EventRepository;
import org.ssafy.respring.domain.event.vo.Event;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDTO;
import org.ssafy.respring.domain.image.repository.ImageRepository;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.story.dto.request.StoryRequestDto;
import org.ssafy.respring.domain.story.dto.request.StoryUpdateRequestDto;
import org.ssafy.respring.domain.story.dto.response.StoryResponseDto;
import org.ssafy.respring.domain.story.repository.StoryRepository;
import org.ssafy.respring.domain.story.vo.Story;
import org.ssafy.respring.domain.user.vo.User;

import java.io.File;
import java.io.IOException;
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

    @Value("${file.upload-dir}")
    private String uploadDir;

    public Long createStory(StoryRequestDto requestDto, List<MultipartFile> imageFiles) {

//		User user = userRepository.findById(requestDto.getUserId())
//				.orElseThrow(() -> new IllegalArgumentException("User not found with id: " + requestDto.getUserId()));

        User user = new User();
        user.setId(requestDto.getUserId());

        Event event = eventRepository.findById(requestDto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + requestDto.getEventId()));

        Story story = new Story();
        story.setTitle(requestDto.getTitle());
        story.setContent(requestDto.getContent());

        story.setUser(user);
        story.setEvent(event);

        //story.setImages(requestDto.getImageList());
        File uploadDirFolder = new File(uploadDir);
        if (!uploadDirFolder.exists()) {
            if (!uploadDirFolder.mkdirs()) {
                throw new RuntimeException("Failed to create upload directory: " + uploadDir);
            }
        }

        // 이미지 저장 및 연결
        if (imageFiles != null && !imageFiles.isEmpty()) {
            List<Image> images = imageFiles.stream().map(file -> {
                try {
                    String originalFileName = file.getOriginalFilename();
                    String extension = originalFileName != null && originalFileName.contains(".") ?
                            originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
                    String uniqueFileName = UUID.randomUUID().toString() + extension;

                    String filePath = uploadDir + File.separator + uniqueFileName;
                    file.transferTo(new File(filePath));

                    Image image = new Image();
                    image.setImageUrl(filePath);
                    image.setStory(story);

                    return image;
                } catch (IOException e) {
                    throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
                }
            }).collect(Collectors.toList());
            story.setImages(images);
        }

        storyRepository.save(story);

        return story.getId();
    }

    public void updateStory(Long storyId, StoryUpdateRequestDto requestDto, List<MultipartFile> imageFiles) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found - id: " + storyId));
        story.setTitle(requestDto.getTitle());
        story.setContent(requestDto.getContent());

        Event event = eventRepository.findById(requestDto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + requestDto.getEventId()));
        story.setEvent(event);
        System.out.println(event.getUser().getId() +", "+ requestDto.getUserId());
        // 예외 처리) 유저가 다른 유저의 이벤트를 골랐을 경우
        if (!event.getUser().getId().equals(requestDto.getUserId())) {

            throw new IllegalArgumentException("You are not authorized to modify this story.");
        }

        // 특정 이미지 삭제
        List<Long> deleteImageIds = requestDto.getDeleteImageIds();
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            // ImageRepository를 사용하여 삭제할 이미지 조회
            List<Image> imagesToDelete = imageRepository.findAllById(deleteImageIds);

            // 삭제하려는 이미지 ID가 story와 연결되지 않은 경우 예외 처리
            for (Image image : imagesToDelete) {
                if (!story.getImages().contains(image)) {
                    throw new IllegalArgumentException("Image ID " + image.getImageId() + " is not associated with this story.");
                }
            }

            // 이미지 파일 및 DB 삭제
            for (Image image : imagesToDelete) {
                File imageFile = new File(image.getImageUrl());
                if (imageFile.exists() && !imageFile.delete()) {
                    throw new RuntimeException("Failed to delete file: " + imageFile.getAbsolutePath());
                }
                imageRepository.delete(image); // DB에서 삭제
            }

            // story와의 관계 제거
            story.getImages().removeAll(imagesToDelete);
        }
        
        // 새로운 이미지 추가
        File uploadDirFolder = new File(uploadDir);
        if (!uploadDirFolder.exists()) {
            if (!uploadDirFolder.mkdirs()) {
                throw new RuntimeException("Failed to create upload directory: " + uploadDir);
            }
        }

        if (imageFiles != null && !imageFiles.isEmpty()) {
            List<Image> newImages = imageFiles.stream().map(file -> {
                try {
                    String originalFileName = file.getOriginalFilename();
                    String extension = originalFileName != null && originalFileName.contains(".") ?
                            originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
                    String uniqueFileName = UUID.randomUUID().toString() + extension;

                    String filePath = uploadDir + File.separator + uniqueFileName;
                    file.transferTo(new File(filePath));

                    Image image = new Image();
                    image.setImageUrl(filePath);
                    image.setStory(story); // story와 연결

                    return image;
                } catch (IOException e) {
                    throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
                }
            }).collect(Collectors.toList());
            story.getImages().addAll(newImages); // story에 새로운 이미지 추가
        }
    }

    public void deleteStory(Long storyId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(()-> new IllegalArgumentException("Story not found - id: "+ storyId));

        // 이미지 파일 및 DB 삭제
        List<Image> images = story.getImages();
        for (Image image : images) {
            File file = new File(image.getImageUrl());
            if (file.exists() && !file.delete()) {
                throw new RuntimeException("Failed to delete file: " + file.getAbsolutePath());
            }
        }

        imageRepository.deleteAll(images);
        storyRepository.deleteById(storyId);
    }

    public List<StoryResponseDto> getMyStories(UUID userId) {
        return storyRepository.findByUserId(userId)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public StoryResponseDto getStoryDetail(Long storyId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story with ID " + storyId + " does not exist."));
        return toResponseDto(story);
    }

    private StoryResponseDto toResponseDto(Story story) {
        List<ImageResponseDTO> imageDtos = story.getImages().stream()
                .map(image -> new ImageResponseDTO(image.getImageId(), image.getImageUrl()))
                .collect(Collectors.toList());

        return new StoryResponseDto(
                story.getId(),
                story.getTitle(),
                story.getContent(),
                story.getCreatedAt(),
                story.getUpdatedAt(),
                story.getEvent().getId(),
                imageDtos
        );
    }
}

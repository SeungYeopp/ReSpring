package org.ssafy.respring.domain.book.util;

import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.story.repository.StoryRepository;
import org.ssafy.respring.domain.image.vo.Image;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class BookMapper {
    private final StoryRepository storyRepository;

    public BookMapper(StoryRepository storyRepository) {
        this.storyRepository = storyRepository;
    }

    public BookResponseDto toResponseDto(Book book) {
        return new BookResponseDto(
                book.getId(),
                book.getUserId(),
                book.getTitle(),
                book.getContent(),
                book.getCoverImg(),
                book.getTags(),
                book.getLikeCount(),
                book.getViewCount(),
                book.getCreatedAt(),
                book.getUpdatedAt(),
                book.getStoryIds(),
                getImagesFromStories(book.getStoryIds())
        );
    }

    private Set<String> getImagesFromStories(Set<Long> storyIds) {
        return storyRepository.findAllById(storyIds).stream()
                .flatMap(story -> story.getImages() != null ? story.getImages().stream() : List.<Image>of().stream())
                .map(Image::getS3Key)
                .collect(Collectors.toSet());
    }
}

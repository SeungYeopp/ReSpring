package org.ssafy.respring.domain.image.repository;

import org.ssafy.respring.domain.image.vo.Image;

import java.util.List;

public interface ImageRepositoryQuerydsl {
    List<Image> findImagesByPostId(Long postId);
    List<Image> findImagesByStoryId(Long storyId);
}

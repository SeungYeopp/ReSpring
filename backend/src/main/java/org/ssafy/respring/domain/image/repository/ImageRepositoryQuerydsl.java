package org.ssafy.respring.domain.image.repository;

import org.ssafy.respring.domain.image.vo.Image;

import java.util.List;

public interface ImageRepositoryQuerydsl {
    List<Image> findImagesByTypeAndEntityId(String imageType, Long entityId);
}

package org.ssafy.respring.domain.image.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.image.vo.ImageType;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long>, ImageRepositoryQuerydsl{
    List<Image> findByImageTypeAndEntityId(ImageType imageType, Long entityId);
    List<Image> findByImageTypeAndEntityIdAndS3KeyIn(ImageType imageType, Long entityId, List<String> deleteImageIds);
}
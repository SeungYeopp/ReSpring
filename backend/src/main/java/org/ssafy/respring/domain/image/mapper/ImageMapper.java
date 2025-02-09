package org.ssafy.respring.domain.image.mapper;

import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDto;
import org.springframework.stereotype.Component;

@Component
public class ImageMapper {

    public ImageResponseDto toResponseDto(Image image, String imageUrl) {
        return ImageResponseDto.builder()
                .imageId(image.getImageId())
                .imageUrl(imageUrl)
                .build();
    }
}

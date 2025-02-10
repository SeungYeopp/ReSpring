package org.ssafy.respring.domain.image.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
@Builder
@Getter
@AllArgsConstructor
public class ImageResponseDto {
    private Long imageId;
    private String imageUrl;
}

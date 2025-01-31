package org.ssafy.respring.domain.image.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ImageResponseDTO {
    private Long imageId;
    private String imageUrl;
}

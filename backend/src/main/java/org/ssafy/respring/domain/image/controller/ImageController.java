package org.ssafy.respring.domain.image.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.image.vo.ImageType;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/images")
@Tag(name = "Image API", description = "이미지 관련 API")
public class ImageController {

    private final ImageService imageService;
    @GetMapping("/{imageType}/{entityId}")
    @Operation(summary = "이미지 조회", description = "타입과 ID를 받아 타입에 해당하는 이미지들을 조회합니다.")
    public List<String> getImagesByEntity(ImageType imageType, Long entityId) {
        return imageService.getImagesByEntity(imageType, entityId);
    }

}

package org.ssafy.respring.domain.image.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.image.dto.request.ImageRequestDTO;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDTO;
import org.ssafy.respring.domain.image.service.ImageService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@Tag(name = "이미지 API", description = "이미지를 관리하는 API")
public class ImageController {
    private final ImageService imageService;

    @Operation(summary = "이미지 생성", description = "이미지를 업로드하고 게시글 또는 스토리에 연관짓습니다.")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<List<ImageResponseDTO>> createImage(
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("imageDTO") @Valid ImageRequestDTO imageDTO) throws IOException {
        List<ImageResponseDTO> createdImages = imageService.saveImages(files, imageDTO);
        return ResponseEntity.ok(createdImages);
    }

    @Operation(summary = "게시글의 이미지 조회", description = "특정 게시글에 연관된 모든 이미지를 조회합니다.")
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ImageResponseDTO>> getImagesByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(imageService.getImagesByPostId(postId));
    }

    @Operation(summary = "스토리의 이미지 조회", description = "특정 스토리에 연관된 모든 이미지를 조회합니다.")
    @GetMapping("/story/{storyId}")
    public ResponseEntity<List<ImageResponseDTO>> getImagesByStory(@PathVariable Long storyId) {
        return ResponseEntity.ok(imageService.getImagesByStoryId(storyId));
    }

    @Operation(summary = "이미지 삭제", description = "특정 ID를 가진 이미지를 삭제합니다.")
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }

//    @Operation(summary = "이미지 업데이트", description = "이미지와 해당 연관 데이터를 업데이트합니다.")
//    @PatchMapping(value = "/{imageId}", consumes = {"multipart/form-data"})
//    public ResponseEntity<ImageResponseDTO> updateImage(@PathVariable Long imageId,
//                                                        @RequestPart(required = false) MultipartFile file) throws IOException {
//        ImageResponseDTO updatedImage = imageService.updateImage(imageId, file);
//        return ResponseEntity.ok(updatedImage);
//    }
}


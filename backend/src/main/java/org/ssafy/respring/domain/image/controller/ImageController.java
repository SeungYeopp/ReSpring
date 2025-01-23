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
@RequestMapping("/image")
@RequiredArgsConstructor
@Tag(name = "Image API", description = "APIs for managing images")
public class ImageController {
    private final ImageService imageService;

    @Operation(summary = "Create Image", description = "Upload an image and associate it with a post or book")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<List<ImageResponseDTO>> createImage(
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("imageDTO") @Valid ImageRequestDTO imageDTO) throws IOException {
        List<ImageResponseDTO> createdImages = imageService.saveImages(files, imageDTO);
        return ResponseEntity.ok(createdImages);
    }

    @Operation(summary = "Get Images by Post", description = "Retrieve all images associated with a post")
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ImageResponseDTO>> getImagesByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(imageService.getImagesByPostId(postId));
    }

    @Operation(summary = "Get Images by Book", description = "Retrieve all images associated with a book")
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<ImageResponseDTO>> getImagesByBook(@PathVariable Long bookId) {
        return ResponseEntity.ok(imageService.getImagesByBookId(bookId));
    }

    @Operation(summary = "Delete Image", description = "Delete an image by its ID")
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update Image", description = "Update an image and its associations")
    @PatchMapping(value = "/{imageId}", consumes = {"multipart/form-data"})
    public ResponseEntity<ImageResponseDTO> updateImage(@PathVariable Long imageId,
                                                        @RequestPart(required = false) MultipartFile file) throws IOException {
        ImageResponseDTO updatedImage = imageService.updateImage(imageId, file);
        return ResponseEntity.ok(updatedImage);
    }
}


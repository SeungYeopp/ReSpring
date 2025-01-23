package org.ssafy.respring.domain.image.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.image.dto.request.ImageRequestDTO;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDTO;
import org.ssafy.respring.domain.image.repository.ImageRepository;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.post.vo.Post;
import org.ssafy.respring.domain.story.vo.Story;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ImageService {
    private final ImageRepository imageRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    public List<ImageResponseDTO> saveImages(List<MultipartFile> files, ImageRequestDTO dto) throws IOException {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        List<Image> images = files.stream().map(file -> {
            try {
                String originalFileName = file.getOriginalFilename();
                String extension = originalFileName != null && originalFileName.contains(".") ?
                        originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
                String uniqueFileName = UUID.randomUUID().toString() + extension;

                String filePath = uploadDir + File.separator + uniqueFileName;
                file.transferTo(new File(filePath));

                Image image = new Image();
                image.setImageUrl(filePath);

                if (dto.getPostId() != null) {
                    Post post = new Post();
                    post.setId(dto.getPostId());
                    image.setPost(post);
                }

                if (dto.getStoryId() != null) {
                    Story story = new Story();
                    story.setId(dto.getStoryId());
                    image.setStory(story);
                }

                image.validateAssociations();

                return image;
            } catch (IOException e) {
                throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
            }
        }).collect(Collectors.toList());

        List<Image> savedImages = imageRepository.saveAll(images);

        return savedImages.stream()
                .map(savedImage -> new ImageResponseDTO(
                        savedImage.getImageId(),
                        savedImage.getImageUrl(),
                        savedImage.getPost() != null ? savedImage.getPost().getId() : null,
                        savedImage.getStory() != null ? savedImage.getStory().getId() : null
                )).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ImageResponseDTO> getImagesByPostId(Long postId) {
        return imageRepository.findImagesByPostId(postId).stream()
                .map(image -> new ImageResponseDTO(image.getImageId(), image.getImageUrl(),
                        image.getPost().getId(), null))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ImageResponseDTO> getImagesByStoryId(Long storyId) {
        return imageRepository.findImagesByStoryId(storyId).stream()
                .map(image -> new ImageResponseDTO(image.getImageId(), image.getImageUrl(),
                        null, image.getStory().getId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteImage(Long imageId) {
        imageRepository.deleteById(imageId);
    }

    @Transactional
    public ImageResponseDTO updateImage(Long imageId, MultipartFile file) throws IOException {
        // 데이터베이스에서 기존 이미지 조회
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));

        if (file != null && !file.isEmpty()) {
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName != null && originalFileName.contains(".") ?
                    originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
            String uniqueFileName = UUID.randomUUID().toString() + extension;

            String filePath = uploadDir + File.separator + uniqueFileName;
            file.transferTo(new File(filePath));

            String oldFilePath = image.getImageUrl();
            if (oldFilePath != null) {
                File oldFile = new File(oldFilePath);
                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }

            image.setImageUrl(filePath);
        }

        Image updatedImage = imageRepository.save(image);

        return new ImageResponseDTO(
                updatedImage.getImageId(),
                updatedImage.getImageUrl(),
                updatedImage.getPost() != null ? updatedImage.getPost().getId() : null,
                updatedImage.getStory() != null ? updatedImage.getStory().getId() : null
        );
    }

}


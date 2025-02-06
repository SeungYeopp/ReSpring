package org.ssafy.respring.domain.image.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
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
@Transactional
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * 단일 이미지 저장 (커버 이미지용)
     */
    public String saveCoverImage(MultipartFile coverImg) {
        if (coverImg == null || coverImg.isEmpty()) return null;

        File uploadDirFolder = new File(uploadDir);
        if (!uploadDirFolder.exists() && !uploadDirFolder.mkdirs()) {
            throw new RuntimeException("Failed to create upload directory: " + uploadDir);
        }

        try {
            String extension = coverImg.getOriginalFilename() != null
                    ? coverImg.getOriginalFilename().substring(coverImg.getOriginalFilename().lastIndexOf("."))
                    : "";
            String uniqueFileName = UUID.randomUUID() + extension;
            File file = new File(uploadDirFolder, uniqueFileName);

            coverImg.transferTo(file);
            return file.getAbsolutePath();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + coverImg.getOriginalFilename(), e);
        }
    }

    /**
     * 다중 이미지 저장 (Post에 연결)
     */
    public List<String> saveImages(List<MultipartFile> images, Post post) {
        return images.stream()
                .map(image -> saveAndPersistImage(image, post, null))
                .collect(Collectors.toList());
    }

    /**
     * 다중 이미지 저장 (Story에 연결)
     */
    public List<String> saveImages(List<MultipartFile> images, Story story) {
        return images.stream()
                .map(image -> saveAndPersistImage(image, null, story))
                .collect(Collectors.toList());
    }

    /**
     * 이미지 저장 후 DB에 Image 엔티티 저장
     */
    private String saveAndPersistImage(MultipartFile image, Post post, Story story) {
        if (image == null || image.isEmpty()) return null;

        String imageUrl = saveCoverImage(image);

        Image imgEntity = Image.builder()
                .imageUrl(imageUrl)
                .post(post)
                .story(story)
                .build();

        imageRepository.save(imgEntity);
        return imageUrl;
    }

    /**
     * 특정 이미지 삭제 (파일 및 DB에서 삭제)
     */
    public void deleteImages(List<Long> imageIds) {
        if (imageIds == null || imageIds.isEmpty()) {
            return;
        }

        // DB에서 이미지 조회
        List<Image> imagesToDelete = imageRepository.findAllById(imageIds);

        // 이미지 파일 삭제
        for (Image image : imagesToDelete) {
            File file = new File(image.getImageUrl());
            if (file.exists() && !file.delete()) {
                throw new RuntimeException("Failed to delete file: " + file.getAbsolutePath());
            }
        }

        // DB에서 이미지 삭제
        imageRepository.deleteAll(imagesToDelete);
    }
}

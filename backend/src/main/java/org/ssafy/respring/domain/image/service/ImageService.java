package org.ssafy.respring.domain.image.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.image.repository.ImageRepository;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDto;
import org.ssafy.respring.domain.image.mapper.ImageMapper;
import org.ssafy.respring.domain.post.vo.Post;
import org.ssafy.respring.domain.story.vo.Story;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper; // ✅ Mapper 주입

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    private final S3Client s3Client;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private S3Presigner createPresigner() {
        return S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    // ✅ S3에 파일 업로드 후 객체 Key 반환
    public String uploadImageToS3(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어 있습니다.");
        }

        String extension = file.getOriginalFilename() != null
                ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."))
                : "";
        String objectKey = folder + "/" + UUID.randomUUID() + extension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

        } catch (IOException e) {
            throw new RuntimeException("S3 파일 업로드 실패: " + file.getOriginalFilename(), e);
        }

        return objectKey; // ✅ S3 객체 Key 반환
    }

    // ✅ Presigned URL 생성 (제한된 시간 동안만 접근 가능)
    public String generatePresignedUrl(String objectKey, int expirationMinutes) {
        if (objectKey == null || objectKey.isEmpty()) {
            throw new IllegalArgumentException("Invalid S3 object key");
        }

        S3Presigner presigner = createPresigner();

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(expirationMinutes))
                .getObjectRequest(getObjectRequest)
                .build();

        String presignedUrl = presigner.presignGetObject(presignRequest).url().toString();
        presigner.close();
        return presignedUrl;
    }

    // ✅ 특정 Post에 속한 이미지 리스트 반환 (Presigned URL 변환)
    public List<ImageResponseDto> getImagesByPostId(Long postId) {
        List<Image> images = imageRepository.findImagesByPostId(postId);
        return images.stream()
                .map(image -> imageMapper.toResponseDto(image, generatePresignedUrl(image.getS3Key(), 20)))
                .collect(Collectors.toList());
    }

    // ✅ 특정 Story에 속한 이미지 리스트 반환 (Presigned URL 변환)
    public List<ImageResponseDto> getImagesByStoryId(Long storyId) {
        List<Image> images = imageRepository.findImagesByStoryId(storyId);
        return images.stream()
                .map(image -> imageMapper.toResponseDto(image, generatePresignedUrl(image.getS3Key(), 20)))
                .collect(Collectors.toList());
    }
}

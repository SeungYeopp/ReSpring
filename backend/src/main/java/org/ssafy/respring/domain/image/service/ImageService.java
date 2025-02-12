package org.ssafy.respring.domain.image.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.image.ImageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDto;
import org.ssafy.respring.domain.image.repository.ImageRepository;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.image.vo.ImageType;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    private final S3Client s3Client;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final long MAX_TOTAL_FILE_SIZE = 20 * 1024 * 1024;


    private void validateFileSize(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("파일 크기는 5MB를 초과할 수 없어요.");
        }
    }

    private void validateTotalFileSize(List<MultipartFile> files) {
        long totalSize = files.stream().mapToLong(MultipartFile::getSize).sum();
        if (totalSize > MAX_TOTAL_FILE_SIZE) {
            throw new IllegalArgumentException("전체 파일 크기의 합은 20MB를 초과할 수 없어요.");
        }
    }




    private S3Presigner createPresigner() {
        return S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

     //  S3에 파일 업로드 후 객체 Key 반환
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

        return objectKey;
    }

     // Presigned URL 생성
    public String generatePresignedUrl(String objectKey) {
        if (objectKey == null || objectKey.isEmpty()) {
            throw new IllegalArgumentException("올바른 S3Key가 아니에요");
        }

        S3Presigner presigner = createPresigner();

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(60))
                .getObjectRequest(getObjectRequest)
                .build();

        String presignedUrl = presigner.presignGetObject(presignRequest).url().toString();
        presigner.close();
        return presignedUrl;
    }

    // DB에 저장 (이미지 업로드 후 객체 Key 저장)
    public String saveImageToDatabase(MultipartFile file, String folder, ImageType imageType, Long entityId) {
        String s3Key = uploadImageToS3(file, folder);

        Image image = Image.builder()
                .s3Key(s3Key)
                .imageType(imageType)
                .entityId(entityId)
                .build();

        imageRepository.save(image);

        return s3Key;
    }

    public List<String> saveImages(List<MultipartFile> files, ImageType imageType, Long entityId) {

        validateTotalFileSize(files);

        String folder = imageType.name().toLowerCase() + "s";

        return files.stream()
                .map(file -> saveImageToDatabase(file, folder, imageType, entityId))
                .collect(Collectors.toList());
    }

    public String saveImage(MultipartFile file, ImageType imageType, Long entityId) {
        validateFileSize(file);
        String folder = imageType.name().toLowerCase() + "s";
        return saveImageToDatabase(file, folder, imageType, entityId);
    }

    public void deleteImages(ImageType imageType, Long entityId) {
        List<Image> imagesToDelete = imageRepository.findByImageTypeAndEntityId(imageType, entityId);

        for (Image image : imagesToDelete) {
            String objectKey = image.getS3Key();
            if (objectKey != null && !objectKey.isEmpty()) {
                deleteImageFromS3(objectKey);
            }
        }

        imageRepository.deleteAll(imagesToDelete);
    }

    private void deleteImageFromS3(String objectKey) {
        try {
            s3Client.deleteObject(builder -> builder
                    .bucket(bucketName)
                    .key(objectKey)
                    .build());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public List<ImageResponseDto> getImagesByEntity(ImageType imageType, Long entityId) {
        List<Image> images = imageRepository.findByImageTypeAndEntityId(imageType, entityId);
        return images.stream()
                .map(image -> new ImageResponseDto(image.getImageId(),generatePresignedUrl(image.getS3Key())))
                .collect(Collectors.toList());
    }

    public List<String> getImageUrlsByEntity(ImageType imageType, Long entityId) {
        List<Image> images = imageRepository.findByImageTypeAndEntityId(imageType, entityId);
        return images.stream()
                .map(image -> generatePresignedUrl(image.getS3Key()))
                .collect(Collectors.toList());
    }

    public String getSingleImageByEntity(ImageType imageType, Long entityId) {
        Optional<Image> image = imageRepository.findByImageTypeAndEntityId(imageType, entityId).stream().findFirst();

        return image.map(img -> generatePresignedUrl(img.getS3Key())).orElse(null);
    }

    public boolean isPresignedUrlExpired(Long timestamp) {
        if (timestamp == null) {
            return true;
        }
        long expirationTimeMillis = 60 * 60 * 1000;
        return System.currentTimeMillis() - timestamp > expirationTimeMillis;
    }

}

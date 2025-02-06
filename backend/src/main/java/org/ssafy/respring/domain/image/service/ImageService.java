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
//
//    /**
//     * 다중 이미지 저장 (Post에 연결)
//     */
    public List<String> saveImages(List<MultipartFile> images, Post post) {
        return images.stream()
                .map(image -> saveAndPersistImage(image, post, null))
                .collect(Collectors.toList());
    }
//
//    /**
//     * 다중 이미지 저장 (Story에 연결)
//     */
    public List<String> saveImages(List<MultipartFile> images, Story story) {
        return images.stream()
                .map(image -> saveAndPersistImage(image, null, story))
                .collect(Collectors.toList());
    }
//
//    /**
//     * 이미지 저장 후 DB에 Image 엔티티 저장
//     */
    private String saveAndPersistImage(MultipartFile image, Post post, Story story) {
        if (image == null || image.isEmpty()) return null;

        String imageUrl = saveCoverImage(image);

        Image imgEntity = Image.builder()
                .s3Key(imageUrl)
                .post(post)
                .story(story)
                .build();

        imageRepository.save(imgEntity);
        return imageUrl;
    }
//
//    /**
//     * 특정 이미지 삭제 (파일 및 DB에서 삭제)
//     */
    public void deleteImages(List<Long> imageIds) {
        if (imageIds == null || imageIds.isEmpty()) {
            return;
        }

        // DB에서 이미지 조회
        List<Image> imagesToDelete = imageRepository.findAllById(imageIds);

        // 이미지 파일 삭제
        for (Image image : imagesToDelete) {
            File file = new File(image.getS3Key());
            if (file.exists() && !file.delete()) {
                throw new RuntimeException("Failed to delete file: " + file.getAbsolutePath());
            }
        }

        // DB에서 이미지 삭제
        imageRepository.deleteAll(imagesToDelete);
    }



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

        // 파일명 생성 (UUID + 확장자 유지)
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

     // ✅ Unsigned URL 반환 (S3 객체 키를 정적인 URL로 변환)
    public String getUnsignedS3Url(String objectKey) {
        if (objectKey == null) {
            return null;
        }
        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + objectKey;
    }

     //✅ Presigned URL 생성 (제한된 시간 동안만 접근 가능)
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

    //✅ DB에 저장 (이미지 업로드 후 객체 Key 저장)
    public String saveImageToDatabase(MultipartFile file, String folder, Post post, Story story) {
        String s3Key = uploadImageToS3(file, folder);
        String unsignedUrl = getUnsignedS3Url(s3Key); // ✅ Unsigned URL 생성
        String presignedUrl = generatePresignedUrl(s3Key, 20);

        Image image = Image.builder()
                .s3Key(s3Key)
                .post(post)
                .story(story)
                .build();

        imageRepository.save(image);

        System.out.println("📌 S3 객체 키: " + s3Key);
        System.out.println("🔗 생성된 Unsigned URL: " + presignedUrl);

        return s3Key;
    }
}
